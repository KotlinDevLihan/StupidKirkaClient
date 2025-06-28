const {clipboard, ipcRenderer} = require('electron');
const fs = require('fs');
const path = require('path');
const Store = require('electron-store');

const settings = new Store();

// --- Default settings ---
if (settings.get('customCss') === undefined) settings.set('customCss', true);
if (settings.get('cssLink') === undefined) settings.set('cssLink', '');
if (settings.get('permCrosshair') === undefined) settings.set('permCrosshair', true);
if (settings.get('uncappedFps') === undefined) settings.set('uncappedFps', true);
if (settings.get('quickCssCode') === undefined) settings.set('quickCssCode', '/* Your custom CSS code here */');
if (settings.get('showKdrIndicator') === undefined) settings.set('showKdrIndicator', true);
if (settings.get('showScoreIndicator') === undefined) settings.set('showScoreIndicator', true);
if (settings.get('permanentScoreboard') === undefined) settings.set('permanentScoreboard', true);
if (settings.get('autoOpenCards') === undefined) settings.set('autoOpenCards', false);
if (settings.get('autoOpenChests') === undefined) settings.set('autoOpenChests', false);


const documents = ipcRenderer.sendSync('docs');
let scriptFolder = path.join(documents, "BetterKirkaClient", "scripts");

if (!fs.existsSync(scriptFolder)) {
    fs.mkdirSync(scriptFolder, {recursive: true});
}
try {
    fs.readdirSync(scriptFolder).filter(file => path.extname(file).toLowerCase() === '.js').forEach(filename => {
        try {
            require(path.join(scriptFolder, filename));
        } catch (e) { console.error("An error occurred while executing userscript: " + filename + " error: " + e); }
    });
} catch (e) { console.error("An error occurred while loading userscripts: " + e); }

// --- Load settings from store ---
let permCrosshair = !!settings.get('permCrosshair');
let customCss = !!settings.get('customCss');
let uncappedFps = !!settings.get('uncappedFps');
let showKdrIndicator = !!settings.get('showKdrIndicator');
let showScoreIndicator = !!settings.get('showScoreIndicator');
let permanentScoreboard = !!settings.get('permanentScoreboard');
let autoOpenCards = !!settings.get('autoOpenCards');
let autoOpenChests = !!settings.get('autoOpenChests');

let menuVisible = false;
let quickCssStyleElement;

// --- Game object references for FPS ---
let renderer;
Object.defineProperty(Object.prototype, "gameLogic", {
    set(value) {
        if (this.app && this.app.renderer) {
            renderer = this.app.renderer;
            console.log("BetterKirkaClient: Game instance captured!");
            updateFpsCap();
        }
        this._gameLogic = value;
    },
    get() { return this._gameLogic; },
    configurable: true
});

let crosshair;

// --- Automatic Openers ---
let autoChestInterval = null;
let autoCardInterval = null;
let isOpening = false;

function startAutoChestOpener() {
    if (autoChestInterval) return;
    console.log("Auto Chest Opener Activated.");
    autoChestInterval = setInterval(async () => {
        if (isOpening) return;

        const continueButton = Array.from(document.querySelectorAll('button.button.green')).find(btn => btn.innerText.trim().toUpperCase() === 'CONTINUE');
        if (continueButton) {
            isOpening = true;
            continueButton.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            isOpening = false;
            return;
        }
        
        const chestScreenTitle = Array.from(document.querySelectorAll('.title-text')).find(el => el.innerText.includes('Select a chest to open'));
        if (chestScreenTitle) {
            const openButton = Array.from(document.querySelectorAll('button.button.green')).find(btn => btn.innerText.trim().toUpperCase() === 'OPEN FOR FREE');
            if (openButton) {
                isOpening = true;
                openButton.click();
            }
        }
    }, 1000);
}

function stopAutoChestOpener() {
    if (autoChestInterval) {
        clearInterval(autoChestInterval);
        autoChestInterval = null;
        isOpening = false;
        console.log("Auto Chest Opener Deactivated.");
    }
}

function startAutoCardOpener() {
    if (autoCardInterval) return;
    console.log("Auto Card Opener Activated.");
    autoCardInterval = setInterval(async () => {
        if (isOpening) return;

        const continueButton = Array.from(document.querySelectorAll('button.button.green')).find(btn => btn.innerText.trim().toUpperCase() === 'CONTINUE');
        if (continueButton) {
            isOpening = true;
            continueButton.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            isOpening = false;
            return;
        }

        const cardScreen = document.querySelector('.card-collection');
        if (cardScreen) {
            const openButton = Array.from(document.querySelectorAll('button.button.green')).find(btn => btn.innerText.trim().toUpperCase() === 'OPEN FOR FREE');
            if (openButton) {
                isOpening = true;
                openButton.click();
            }
        }
    }, 1000);
}

function stopAutoCardOpener() {
    if (autoCardInterval) {
        clearInterval(autoCardInterval);
        autoCardInterval = null;
        isOpening = false;
        console.log("Auto Card Opener Deactivated.");
    }
}


// --- KDR Script Implementation ---
let kdrObserver = null;
let kdrElement = null;
let kdrUpdateInterval = null;
let gameSceneHook = null;
let lastKills = 0;
let lastDeaths = 0;
let lastHealth = 100;
let respawnDetected = false;

function startKdrScript() {
    if (kdrObserver) return;

    if (!kdrElement) {
        const kdrElementWrapper = document.createElement('div');
        kdrElementWrapper.innerHTML = '<div data-v-07689ebb="" class="kill bg text-1" id="kdrElem" style="color: white; padding-left: 15px;">K/D: 0.00</div>';
        kdrElement = kdrElementWrapper.firstChild;
    }

    function updateKDR() {
        const killsElem = document.querySelector('.kill-death .kill');
        let deathsElem = document.querySelector('.WwwNnMm.bg.text-1');

        if (!deathsElem) {
            const alternatives = ['[class*="WwwNnMm"][class*="bg"][class*="text-1"]', '.kill-death .death', '.death:not(.kill-death)', '[class*="death"]:not(.kill-death)', '.kill-death .icon-death + *', '.kill-death > *:last-child', '.scoreboard-self .value:nth-child(2)'];
            for (const selector of alternatives) {
                deathsElem = document.querySelector(selector);
                if (deathsElem && deathsElem.textContent && deathsElem.textContent.trim()) break;
            }
        }

        const kdrDisplayElem = document.getElementById('kdrElem');
        if (!killsElem || !kdrDisplayElem) return;

        const kills = Number(killsElem.textContent || killsElem.innerText) || 0;
        let deaths = 0;
        if (deathsElem) {
            const deathText = deathsElem.textContent || deathsElem.innerText || '';
            if (deathText.includes('K/D:')) {
                const numbers = deathText.match(/\d+/g);
                if (numbers && numbers.length >= 2) deaths = Number(numbers[1]) || 0;
            } else if (deathText.trim()) {
                deaths = Number(deathText.trim()) || 0;
            } else {
                const killDeathContainer = document.querySelector('.kill-death');
                if (killDeathContainer) {
                    const allText = killDeathContainer.textContent || killDeathContainer.innerText || '';
                    const numbers = allText.match(/\d+/g);
                    if (numbers && numbers.length >= 2) deaths = Number(numbers[1]) || 0;
                }
            }
        }

        if (respawnDetected && deaths === lastDeaths) {
            const adjustedDeaths = lastDeaths + 1;
            updateKDRDisplay(kills, adjustedDeaths);
            lastDeaths = adjustedDeaths;
            respawnDetected = false;
            return;
        }

        if (kills !== lastKills || deaths !== lastDeaths) {
            lastKills = kills;
            lastDeaths = deaths;
            updateKDRDisplay(kills, deaths);
        }
    }

    function updateKDRDisplay(kills, deaths) {
        const kdrDisplayElem = document.getElementById('kdrElem');
        if (!kdrDisplayElem) return;
        let kdRatio = (deaths === 0) ? kills.toFixed(2) : (kills / deaths).toFixed(2);
        kdrDisplayElem.textContent = 'K/D: ' + kdRatio;
    }

    function detectDeath() {
        document.querySelectorAll('[class*="health"], [class*="hp"], .health-bar, .hp-bar').forEach(healthBar => {
            const healthMatch = (healthBar.textContent || healthBar.innerText).match(/(\d+)/);
            if (healthMatch) {
                const currentHealth = Number(healthMatch[1]);
                if (lastHealth > 0 && currentHealth === 0) {
                    respawnDetected = true;
                    setTimeout(updateKDR, 100);
                }
                lastHealth = currentHealth;
            }
        });

        if (document.querySelectorAll('[class*="respawn"], [class*="spawn"], .respawn-timer, .spawn-timer').length > 0) {
            respawnDetected = true;
            setTimeout(updateKDR, 100);
        }

        document.querySelectorAll('[class*="killed"], [class*="death"], .notification, .kill-feed').forEach(notification => {
            const text = notification.textContent || notification.innerText || '';
            if (text.includes('killed') || text.includes('eliminated') || text.includes('died')) {
                respawnDetected = true;
                setTimeout(updateKDR, 100);
            }
        });
    }

    function forceKDRCheck() {
        detectDeath();
        const killSelectors = ['.kill-death .kill', '.kill:not(.kill-death):not(#kdrElem)', '[class*="kill"]:not(.kill-death):not(#kdrElem)', '.scoreboard-self .value:nth-child(1)'];
        const deathSelectors = ['.WwwNnMm.bg.text-1', '[class*="WwwNnMm"][class*="bg"][class*="text-1"]', '.scoreboard-self .value:nth-child(2)'];
        let killsElem = null;
        let deathsElem = null;
        for (const selector of killSelectors) {
            killsElem = document.querySelector(selector);
            if (killsElem && killsElem.textContent && killsElem.textContent.trim() && killsElem.id !== 'kdrElem') break;
        }
        for (const selector of deathSelectors) {
            deathsElem = document.querySelector(selector);
            if (deathsElem && deathsElem.id !== 'kdrElem') {
                const text = deathsElem.textContent || deathsElem.innerText || '';
                if (text.trim() && !text.includes('K/D:')) break;
            }
        }
        if (killsElem) {
            const currentKills = Number(killsElem.textContent || killsElem.innerText) || 0;
            let currentDeaths = 0;
            if (deathsElem && deathsElem.id !== 'kdrElem') {
                const deathText = deathsElem.textContent || deathsElem.innerText || '';
                if (!deathText.includes('K/D:')) currentDeaths = Number(deathText.trim()) || 0;
            }
            if (currentDeaths === 0) {
                const killDeathContainer = document.querySelector('.kill-death');
                if (killDeathContainer) {
                    const cleanText = (killDeathContainer.textContent || killDeathContainer.innerText || '').replace(/K\/D:\s*[\d.]+/g, '');
                    const numbers = cleanText.match(/\d+/g);
                    if (numbers && numbers.length >= 2) currentDeaths = Number(numbers[1]) || 0;
                }
            }
            if (currentKills !== lastKills || currentDeaths !== lastDeaths) updateKDR();
        }
    }

    function hookGameScene() {
        const originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            if (prop === 'gameLogic' || prop === 'scene' || (descriptor && descriptor.value && descriptor.value.type === 'Scene')) gameSceneHook = descriptor.value;
            return originalDefineProperty.call(this, obj, prop, descriptor);
        };
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) { return originalRAF.call(this, function(time) { detectDeath(); return callback(time); }); };
    }

    kdrObserver = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        const killDeathContainer = document.getElementsByClassName('kill-death')[0];
        if (killDeathContainer && !document.getElementById('kdrElem')) {
            killDeathContainer.appendChild(kdrElement);
            shouldUpdate = true;
        }
        mutations.forEach(mutation => {
            const checkNode = (node) => {
                if (node.nodeType === 1) {
                    const classNameStr = (typeof node.className === 'string' ? node.className : '');
                    const textContent = node.textContent || '';
                    if (classNameStr.match(/kill|death|respawn|spawn|health|hp|WwwNnMm/) || textContent.match(/respawn|killed/)) return true;
                    if (node.querySelector && node.querySelector('.kill, .death, [class*="death"], [class*="respawn"], .WwwNnMm.bg.text-1')) return true;
                }
                return false;
            };
            if (mutation.type === 'childList' && [...(mutation.addedNodes || []), ...(mutation.removedNodes || [])].some(checkNode)) shouldUpdate = true;
            if (mutation.type === 'characterData') {
                let node = mutation.target;
                while (node && node.parentElement) {
                    const classNameStr = (typeof node.className === 'string' ? node.className : '');
                    if (classNameStr.match(/kill|death|health|hp|WwwNnMm/)) { shouldUpdate = true; break; }
                    node = node.parentElement;
                }
            }
        });
        if (shouldUpdate) { setTimeout(updateKDR, 10); setTimeout(updateKDR, 50); }
    });

    kdrObserver.observe(document, { childList: true, subtree: true, characterData: true, characterDataOldValue: true });
    hookGameScene();
    kdrUpdateInterval = setInterval(forceKDRCheck, 300);
    setTimeout(updateKDR, 100);
}


function stopKdrScript() {
    if (kdrObserver) { kdrObserver.disconnect(); kdrObserver = null; }
    if (kdrUpdateInterval) { clearInterval(kdrUpdateInterval); kdrUpdateInterval = null; }
    const kdrElem = document.getElementById('kdrElem');
    if (kdrElem) kdrElem.remove();
    lastKills = 0; lastDeaths = 0; lastHealth = 100; respawnDetected = false; gameSceneHook = null;
}

// --- FINAL CORRECTED: Universal Permanent Scoreboard ---
function enforceScoreboardStyle() {
    const ffaScoreboard = document.querySelector('.tab-info');
    const teamScoreboard = document.querySelector('.tab-team-info');
    
    let scoreboardToPin = null;
    let isTeamBoard = false;

    // The FFA-specific board ONLY exists in FFA modes. This is the most reliable check.
    if (ffaScoreboard) {
        scoreboardToPin = ffaScoreboard;
        isTeamBoard = false;
    } else if (teamScoreboard) {
        // If the FFA board doesn't exist, it must be a team mode.
        scoreboardToPin = teamScoreboard;
        isTeamBoard = true;
    }

    const baseStyle = `
        display: flex !important; 
        visibility: visible !important;
        opacity: 1 !important;
        position: fixed !important; 
        top: 20px !important; 
        right: 20px !important; 
        left: auto !important; 
        bottom: auto !important;
        transform-origin: top right !important; 
        z-index: 999 !important;
        pointer-events: auto !important;
        background-color: rgba(0, 0, 0, 0.2) !important;
        border-radius: 5px;
    `;
    
    let finalStyle;
    if (isTeamBoard) {
        finalStyle = baseStyle + `
            transform: scale(0.65) !important;
            padding: 8px !important;
        `;
    } else {
        finalStyle = baseStyle + `
            transform: scale(0.8) !important;
            padding: 10px !important;
        `;
    }

    if (permanentScoreboard && scoreboardToPin) {
        // Only apply the style if it's different, to prevent constant repaints
        if (scoreboardToPin.style.cssText !== finalStyle) {
            scoreboardToPin.style.cssText = finalStyle;
        }
    } else {
        // If the setting is off, ensure both are reset
        if (ffaScoreboard && ffaScoreboard.style.position === 'fixed') {
            ffaScoreboard.style.cssText = '';
        }
        if (teamScoreboard && teamScoreboard.style.position === 'fixed') {
            teamScoreboard.style.cssText = '';
        }
    }
}


// --- Main UI Loop ---
setInterval(() => {
    enforceScoreboardStyle();

    const gameInterface = document.querySelector('.game-interface');
    if (gameInterface) {
        let scoreElement = document.getElementById('bk-score-indicator');
        if (showScoreIndicator) {
             if (!scoreElement) {
                scoreElement = document.createElement('div');
                scoreElement.id = 'bk-score-indicator';
                scoreElement.style.cssText = 'position: absolute; top: 150px; left: 10px; color: white; background-color: rgba(0,0,0,0.5); padding: 5px 10px; border-radius: 5px; font-family: "Montserrat", sans-serif; font-size: 14px; z-index: 1000;';
                gameInterface.appendChild(scoreElement);
            }
            const teamScores = document.querySelectorAll('.team-score');
            if (teamScores.length >= 2) scoreElement.innerHTML = `Alpha: ${teamScores[0].innerText} <br> Beta: ${teamScores[1].innerText}`;
        } else if (scoreElement) {
            scoreElement.remove();
        }
    }
}, 250);

// --- GUI Setup and Event Listeners ---
document.addEventListener("DOMContentLoaded", () => {
    if (customCss) {
        let cssLinkElem = document.createElement("link");
        cssLinkElem.href = settings.get('cssLink');
        cssLinkElem.rel = "stylesheet";
        document.head.append(cssLinkElem);
    }
    
    quickCssStyleElement = document.createElement('style');
    quickCssStyleElement.id = 'quick-css-insert';
    quickCssStyleElement.innerHTML = settings.get('quickCssCode', '');
    document.head.appendChild(quickCssStyleElement);

    const gui = document.createElement("div");
    gui.id = "gui";
    gui.style.display = "none";
    gui.innerHTML = `
    <style>#gui-container{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:580px;background-color:#18191c;z-index:10000;color:#fff;border-radius:4px;font-family:'Montserrat',sans-serif;box-shadow:0 0 15px rgba(0,0,0,.5);overflow:hidden}.gui-header{display:flex;border-bottom:1px solid #000;background-color:#18191c}.header-tab{padding:12px 20px;cursor:pointer;font-weight:500;font-size:14px;color:#72767d;border-bottom:2px solid transparent;text-transform:uppercase}.header-tab.active{color:#fff;border-bottom-color:#fff}.gui-content{padding:20px;background-color:#2b2d31;max-height:70vh;overflow-y:auto}.setting{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.setting-column{display:flex;flex-direction:column;align-items:flex-start}.setting-label{font-size:14px;color:#dcddde;margin-bottom:8px}.setting-control input[type=text]{background-color:#1e1f22;border:1px solid #111;color:#fff;padding:8px;border-radius:3px;width:250px}.setting-control textarea{background-color:#1e1f22;border:1px solid #111;color:#fff;padding:8px;border-radius:3px;width:100%;min-height:120px;resize:vertical}.switch{position:relative;display:inline-block;width:44px;height:24px}.switch input{opacity:0;width:0;height:0}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#424549;transition:.2s;border-radius:24px}.slider:before{position:absolute;content:"";height:16px;width:16px;left:4px;bottom:4px;background-color:#fff;transition:.2s;border-radius:50%}input:checked+.slider{background-color:#3ba55d}input:checked+.slider:before{transform:translateX(20px)}.divider{border-top:1px solid #424549;margin:20px 0}</style>
    <div id="gui-container">
        <div class="gui-header"><div class="header-tab active">CLIENT</div></div>
        <div class="gui-content">
            <div class="setting"><label class="setting-label">Unlimited FPS</label><div class="setting-control"><label class="switch"><input type="checkbox" id="uncappedFps"><span class="slider"></span></label></div></div>
            <div class="setting"><label class="setting-label">Permanent Crosshair</label><div class="setting-control"><label class="switch"><input type="checkbox" id="permCrosshair"><span class="slider"></span></label></div></div>
            <div class="setting"><label class="setting-label">Permanent Scoreboard</label><div class="setting-control"><label class="switch"><input type="checkbox" id="permanentScoreboard"><span class="slider"></span></label></div></div>
            <div class="divider"></div>
            <div class="setting"><label class="setting-label">Custom CSS Link</label><div class="setting-control"><input type="text" id="cssLink"></div></div>
            <div class="setting setting-column"><label class="setting-label">Quick CSS Insert</label><div class="setting-control" style="width:100%"><textarea id="quickCssCode"></textarea></div></div>
            <div class="divider"></div>
            <label class="setting-label">On-Screen Indicators</label>
            <div class="setting"><label class="setting-label" style="color:#b9bbbe">Show K/D Ratio (Top)</label><div class="setting-control"><label class="switch"><input type="checkbox" id="showKdrIndicator"><span class="slider"></span></label></div></div>
            <div class="setting"><label class="setting-label" style="color:#b9bbbe">Show Scoreboard (Left)</label><div class="setting-control"><label class="switch"><input type="checkbox" id="showScoreIndicator"><span class="slider"></span></label></div></div>
            <div class="divider"></div>
            <label class="setting-label">Automation Scripts</label>
            <div class="setting"><label class="setting-label" style="color:#b9bbbe">Auto Open Cards</label><div class="setting-control"><label class="switch"><input type="checkbox" id="autoOpenCards"><span class="slider"></span></label></div></div>
            <div class="setting"><label class="setting-label" style="color:#b9bbbe">Auto Open Chests</label><div class="setting-control"><label class="switch"><input type="checkbox" id="autoOpenChests"><span class="slider"></span></label></div></div>
        </div>
    </div>`;
    document.body.appendChild(gui);

    document.getElementById("permCrosshair").checked = permCrosshair;
    document.getElementById("permCrosshair").addEventListener('change', (e) => { permCrosshair = e.target.checked; settings.set('permCrosshair', permCrosshair); });
    document.getElementById("uncappedFps").checked = uncappedFps;
    document.getElementById("uncappedFps").addEventListener('change', (e) => { uncappedFps = e.target.checked; settings.set('uncappedFps', uncappedFps); updateFpsCap(); });
    const cssLinkInput = document.getElementById('cssLink');
    cssLinkInput.value = settings.get('cssLink');
    cssLinkInput.addEventListener('input', () => { settings.set('cssLink', cssLinkInput.value); });
    const quickCssTextarea = document.getElementById('quickCssCode');
    quickCssTextarea.value = settings.get('quickCssCode', '');
    quickCssTextarea.addEventListener('input', () => {
        const cssCode = quickCssTextarea.value;
        settings.set('quickCssCode', cssCode);
        quickCssStyleElement.innerHTML = cssCode;
    });

    const kdrCheckbox = document.getElementById("showKdrIndicator");
    kdrCheckbox.checked = showKdrIndicator;
    kdrCheckbox.addEventListener('change', (e) => {
        showKdrIndicator = e.target.checked; settings.set('showKdrIndicator', showKdrIndicator);
        if (showKdrIndicator) startKdrScript(); else stopKdrScript();
    });

    document.getElementById("showScoreIndicator").checked = showScoreIndicator;
    document.getElementById("showScoreIndicator").addEventListener('change', (e) => { showScoreIndicator = e.target.checked; settings.set('showScoreIndicator', showScoreIndicator); });
    
    const permanentScoreboardCheckbox = document.getElementById("permanentScoreboard");
    permanentScoreboardCheckbox.checked = permanentScoreboard;
    permanentScoreboardCheckbox.addEventListener('change', (e) => {
        permanentScoreboard = e.target.checked; settings.set('permanentScoreboard', permanentScoreboard);
        enforceScoreboardStyle();
    });

    const autoCardsCheckbox = document.getElementById("autoOpenCards");
    autoCardsCheckbox.checked = autoOpenCards;
    autoCardsCheckbox.addEventListener('change', (e) => {
        autoOpenCards = e.target.checked; settings.set('autoOpenCards', autoOpenCards);
        if (autoOpenCards) startAutoCardOpener(); else stopAutoCardOpener();
    });

    const autoChestsCheckbox = document.getElementById("autoOpenChests");
    autoChestsCheckbox.checked = autoOpenChests;
    autoChestsCheckbox.addEventListener('change', (e) => {
        autoOpenChests = e.target.checked; settings.set('autoOpenChests', autoOpenChests);
        if (autoOpenChests) startAutoChestOpener(); else stopAutoChestOpener();
    });

    if (autoOpenCards) startAutoCardOpener();
    if (autoOpenChests) startAutoChestOpener();
    if (showKdrIndicator) startKdrScript();
});

document.addEventListener('keydown', (e) => {
    if (e.code === "F1") { e.preventDefault(); toggleGui(); }
});

function toggleGui() {
    const gui = document.getElementById('gui');
    menuVisible = !menuVisible;
    gui.style.display = menuVisible ? 'block' : 'none';
    if (menuVisible) document.exitPointerLock();
}

function updateFpsCap() {
    if (renderer && renderer.options) renderer.options.maxFPS = uncappedFps ? 9999 : 60;
}

function animate() {
    window.requestAnimationFrame(animate);
    crosshair = crosshair || document.getElementById("crosshair-static");
    if (crosshair && permCrosshair) crosshair.style.cssText = "visibility: visible !important; opacity: 1 !important; display: block !important;";
}

animate();