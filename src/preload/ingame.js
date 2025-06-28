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

// --- UPDATED KDR SCRIPT IMPLEMENTATION ---
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

    // Create KDR element if it doesn't exist
    if (!kdrElement) {
        const kdrElementWrapper = document.createElement('div');
        kdrElementWrapper.innerHTML = '<div data-v-07689ebb="" class="kill bg text-1" id="kdrElem" style="color: white; padding-left: 15px;">K/D: 0.00</div>';
        kdrElement = kdrElementWrapper.firstChild;
    }

    function updateKDR() {
        const killsElem = document.querySelector('.kill-death .kill');
        // Updated to specifically target the WwwNnMm bg text-1 class for deaths
        let deathsElem = document.querySelector('.WwwNnMm.bg.text-1');
        
        // Fallback selectors if the primary death selector fails
        if (!deathsElem) {
            const alternatives = [
                '[class*="WwwNnMm"][class*="bg"][class*="text-1"]', // More flexible class matching
                '.kill-death .death',
                '.death:not(.kill-death)',
                '[class*="death"]:not(.kill-death)', 
                '.kill-death .icon-death + *', // Element after skull icon
                '.kill-death > *:last-child', // Last element in kill-death container
                '.scoreboard-self .value:nth-child(2)'
            ];
            
            for (const selector of alternatives) {
                deathsElem = document.querySelector(selector);
                if (deathsElem && deathsElem.textContent && deathsElem.textContent.trim()) break;
            }
        }
        
        const kdrDisplayElem = document.getElementById('kdrElem');

        if (!killsElem || !kdrDisplayElem) return;

        const kills = Number(killsElem.textContent || killsElem.innerText) || 0;
        
        // Smart death parsing - handle SVG icons and extract numbers
        let deaths = 0;
        if (deathsElem) {
            const deathText = deathsElem.textContent || deathsElem.innerText || '';
            
            // If it's the entire kill-death container, extract death number
            if (deathText.includes('K/D:')) {
                const numbers = deathText.match(/\d+/g);
                if (numbers && numbers.length >= 2) {
                    deaths = Number(numbers[1]) || 0;
                }
            } else if (deathText.trim()) {
                // Simple case - get the number
                deaths = Number(deathText.trim()) || 0;
            } else {
                // If death element has no text, try to find death counter in siblings
                const killDeathContainer = document.querySelector('.kill-death');
                if (killDeathContainer) {
                    const allText = killDeathContainer.textContent || killDeathContainer.innerText || '';
                    const numbers = allText.match(/\d+/g);
                    if (numbers && numbers.length >= 2) {
                        deaths = Number(numbers[1]) || 0;
                    }
                }
            }
        }
        
        // Debug logging
        console.log(`KDR Debug - Kills element:`, killsElem, `text: "${killsElem.textContent || killsElem.innerText}"`);
        console.log(`KDR Debug - Deaths element (WwwNnMm.bg.text-1):`, deathsElem, `text: "${deathsElem ? (deathsElem.textContent || deathsElem.innerText) : 'null'}"`);
        console.log(`KDR Debug - Parsed values: kills=${kills}, deaths=${deaths}`);
        
        // Handle respawn detection death increment
        if (respawnDetected && deaths === lastDeaths) {
            console.log('Respawn detected - incrementing deaths manually');
            const adjustedDeaths = lastDeaths + 1;
            updateKDRDisplay(kills, adjustedDeaths);
            lastDeaths = adjustedDeaths; // Update stored deaths
            respawnDetected = false;
            return;
        }
        
        // Always update if values changed OR if this is a fresh check
        if (kills !== lastKills || deaths !== lastDeaths) {
            lastKills = kills;
            lastDeaths = deaths;
            updateKDRDisplay(kills, deaths);
        }
    }
    
    function updateKDRDisplay(kills, deaths) {
        const kdrDisplayElem = document.getElementById('kdrElem');
        if (!kdrDisplayElem) return;
        
        let kdRatio;
        if (deaths === 0) {
            // No deaths: show number of kills (1 kill, 0 deaths = 1.00)
            kdRatio = kills.toFixed(2);
        } else {
            const ratio = kills / deaths;
            if (ratio === 1) {
                // Equal kills and deaths = 0.00 (1 kill, 1 death = 0.00)
                kdRatio = "0.00";
            } else {
                // Normal division (3 kills, 1 death = 3.00, 1 kill, 3 deaths = 0.33)
                kdRatio = ratio.toFixed(2);
            }
        }
        
        kdrDisplayElem.textContent = 'K/D: ' + kdRatio;
        console.log(`KDR Updated: ${kills}/${deaths} = ${kdRatio}`);
    }

    function detectDeath() {
        // Method 1: Health indicator detection
        const healthBars = document.querySelectorAll('[class*="health"], [class*="hp"], .health-bar, .hp-bar');
        healthBars.forEach(healthBar => {
            const healthText = healthBar.textContent || healthBar.innerText;
            const healthMatch = healthText.match(/(\d+)/);
            if (healthMatch) {
                const currentHealth = Number(healthMatch[1]);
                if (lastHealth > 0 && currentHealth === 0) {
                    console.log('Death detected via health drop to 0');
                    respawnDetected = true;
                    setTimeout(updateKDR, 100);
                }
                lastHealth = currentHealth;
            }
        });
        
        // Method 2: Respawn timer/button detection
        const respawnElements = document.querySelectorAll('[class*="respawn"], [class*="spawn"], .respawn-timer, .spawn-timer');
        if (respawnElements.length > 0) {
            console.log('Death detected via respawn element appearance');
            respawnDetected = true;
            setTimeout(updateKDR, 100);
        }
        
        // Method 3: Kill notification detection (when someone kills you)
        const killNotifications = document.querySelectorAll('[class*="killed"], [class*="death"], .notification, .kill-feed');
        killNotifications.forEach(notification => {
            const text = notification.textContent || notification.innerText || '';
            if (text.includes('killed') || text.includes('eliminated') || text.includes('died')) {
                console.log('Death detected via kill notification');
                respawnDetected = true;
                setTimeout(updateKDR, 100);
            }
        });
    }

    function forceKDRCheck() {
        // Run death detection methods
        detectDeath();
        
        // Try multiple selectors for kills and deaths but EXCLUDE our KDR element completely
        const killSelectors = [
            '.kill-death .kill',
            '.kill:not(.kill-death):not(#kdrElem)',
            '[class*="kill"]:not(.kill-death):not(#kdrElem)',
            '.scoreboard-self .value:nth-child(1)'
        ];
        
        // Updated death selectors to prioritize the specific WwwNnMm class
        const deathSelectors = [
            '.WwwNnMm.bg.text-1',
            '[class*="WwwNnMm"][class*="bg"][class*="text-1"]',
            '.scoreboard-self .value:nth-child(2)' // Fallback to scoreboard
        ];
        
        let killsElem = null;
        let deathsElem = null;
        
        // Find kills element
        for (const selector of killSelectors) {
            killsElem = document.querySelector(selector);
            if (killsElem && killsElem.textContent && killsElem.textContent.trim() && killsElem.id !== 'kdrElem') break;
        }
        
        // Find deaths element using the updated selectors
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
                // Skip if it's our own KDR element
                if (!deathText.includes('K/D:')) {
                    currentDeaths = Number(deathText.trim()) || 0;
                }
            }
            
            // Fallback: extract from kill-death container, excluding our KDR text
            if (currentDeaths === 0) {
                const killDeathContainer = document.querySelector('.kill-death');
                if (killDeathContainer) {
                    const allText = killDeathContainer.textContent || killDeathContainer.innerText || '';
                    // Remove our KDR text before parsing
                    const cleanText = allText.replace(/K\/D:\s*[\d.]+/g, '');
                    const numbers = cleanText.match(/\d+/g);
                    if (numbers && numbers.length >= 2) {
                        currentDeaths = Number(numbers[1]) || 0;
                    }
                }
            }
            
            console.log(`Force check values: ${currentKills}/${currentDeaths} (stored: ${lastKills}/${lastDeaths})`);
            
            // If values are different from what we last recorded, force an update
            if (currentKills !== lastKills || currentDeaths !== lastDeaths) {
                console.log(`Force KDR check detected change: ${currentKills}/${currentDeaths} (was ${lastKills}/${lastDeaths})`);
                updateKDR();
            }
        } else {
            console.log('Force check: No kills element found with any selector');
        }
    }
    
    // Hook into game scene objects for low-level detection
    function hookGameScene() {
        // Try to hook into Three.js scene objects
        const originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            if (prop === 'gameLogic' || prop === 'scene' || (descriptor && descriptor.value && descriptor.value.type === 'Scene')) {
                console.log('Game scene object detected:', obj, prop);
                gameSceneHook = descriptor.value;
            }
            return originalDefineProperty.call(this, obj, prop, descriptor);
        };
        
        // Hook into requestAnimationFrame for game loop monitoring
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) {
            return originalRAF.call(this, function(time) {
                detectDeath(); // Run death detection in game loop
                return callback(time);
            });
        };
    }
    
    kdrObserver = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        
        // Check if kill-death container exists and inject KDR element
        const killDeathContainer = document.getElementsByClassName('kill-death')[0];
        const isKdrElementInjected = document.getElementById('kdrElem');

        if (killDeathContainer && !isKdrElementInjected) {
            killDeathContainer.appendChild(kdrElement);
            shouldUpdate = true;
        }

        // Enhanced mutation detection for all death-related elements
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                const checkNode = (node) => {
                    if (node.nodeType === 1) {
                        const className = node.className || '';
                        const classNameStr = typeof className === 'string' ? className : (className.toString ? className.toString() : '');
                        const textContent = node.textContent || '';
                        
                        // Check for death-related classes or content, including the specific WwwNnMm class
                        if (classNameStr.includes('kill') || classNameStr.includes('death') || 
                            classNameStr.includes('respawn') || classNameStr.includes('spawn') ||
                            classNameStr.includes('health') || classNameStr.includes('hp') ||
                            classNameStr.includes('WwwNnMm') || // Added specific class check
                            textContent.includes('respawn') || textContent.includes('killed')) {
                            return true;
                        }
                        
                        // Check children
                        if (node.querySelector && (
                            node.querySelector('.kill') || node.querySelector('.death') ||
                            node.querySelector('[class*="death"]') || node.querySelector('[class*="respawn"]') ||
                            node.querySelector('.WwwNnMm.bg.text-1'))) { // Added specific class check
                            return true;
                        }
                    }
                    return false;
                };
                
                [...(mutation.addedNodes || []), ...(mutation.removedNodes || [])].forEach(node => {
                    if (checkNode(node)) shouldUpdate = true;
                });
            }
            
            if (mutation.type === 'characterData') {
                let node = mutation.target;
                while (node && node.parentElement) {
                    const className = node.className || '';
                    const classNameStr = typeof className === 'string' ? className : (className.toString ? className.toString() : '');
                    if (classNameStr.includes('kill') || classNameStr.includes('death') || 
                        classNameStr.includes('health') || classNameStr.includes('hp') ||
                        classNameStr.includes('WwwNnMm')) { // Added specific class check
                        shouldUpdate = true;
                        break;
                    }
                    node = node.parentElement;
                }
            }
        });

        if (shouldUpdate) {
            setTimeout(updateKDR, 10);
            setTimeout(updateKDR, 50);
            setTimeout(updateKDR, 100);
        }
    });

    const config = { 
        childList: true, 
        subtree: true, 
        characterData: true,
        characterDataOldValue: true
    };
    kdrObserver.observe(document, config);
    
    // Initialize game hooks
    hookGameScene();
    
    // Start polling interval for comprehensive checks
    kdrUpdateInterval = setInterval(forceKDRCheck, 300); // More frequent checking
    
    // Initial update
    setTimeout(updateKDR, 100);
}

function stopKdrScript() {
    if (kdrObserver) {
        kdrObserver.disconnect();
        kdrObserver = null;
    }
    if (kdrUpdateInterval) {
        clearInterval(kdrUpdateInterval);
        kdrUpdateInterval = null;
    }
    const kdrElem = document.getElementById('kdrElem');
    if (kdrElem) {
        kdrElem.remove();
    }
    lastKills = 0;
    lastDeaths = 0;
    lastHealth = 100;
    respawnDetected = false;
    gameSceneHook = null;
}

// --- IMPROVED SCOREBOARD HANDLING ---
function enforceScoreboardStyle() {
    const scoreboard = document.querySelector('.tab-info');
    if (scoreboard && permanentScoreboard) {
        // Force the style to override any game changes
        const fixedStyle = `
            display: block !important; 
            visibility: visible !important;
            opacity: 1 !important;
            position: fixed !important; 
            top: 20px !important; 
            right: 20px !important; 
            left: auto !important; 
            transform: scale(0.8) !important; 
            transform-origin: top right !important; 
            z-index: 1000 !important;
            pointer-events: auto !important;
        `;
        
        if (scoreboard.style.cssText !== fixedStyle) {
            scoreboard.style.cssText = fixedStyle;
        }
        
        // Also add CSS class override
        if (!scoreboard.classList.contains('bk-permanent-scoreboard')) {
            scoreboard.classList.add('bk-permanent-scoreboard');
        }
    } else if (scoreboard && !permanentScoreboard) {
        scoreboard.classList.remove('bk-permanent-scoreboard');
        if (scoreboard.style.position === 'fixed') {
            scoreboard.style.cssText = '';
        }
    }
}

// --- OTHER UI ELEMENTS (in a lightweight interval for stability) ---
setInterval(() => {
    // Enhanced Permanent Scoreboard Logic
    enforceScoreboardStyle();
    
    // Team Score Logic
    const gameInterface = document.querySelector('.game-interface');
    if (gameInterface) {
        let scoreElement = document.getElementById('bk-score-indicator');
        if (showScoreIndicator) {
             if (!scoreElement) {
                scoreElement = document.createElement('div');
                scoreElement.id = 'bk-score-indicator';
                // Adjusted top position to account for the removed element
                scoreElement.style.cssText = 'position: absolute; top: 150px; left: 10px; color: white; background-color: rgba(0,0,0,0.5); padding: 5px 10px; border-radius: 5px; font-family: "Montserrat", sans-serif; font-size: 14px; z-index: 1000;';
                gameInterface.appendChild(scoreElement);
            }
            const teamScores = document.querySelectorAll('.team-score');
            if (teamScores.length >= 2) scoreElement.innerHTML = `Alpha: ${teamScores[0].innerText} <br> Beta: ${teamScores[1].innerText}`;
        } else if (scoreElement) {
            scoreElement.remove();
        }
    }
}, 100); // Increased frequency for better responsiveness


document.addEventListener("DOMContentLoaded", () => {
    if (customCss) {
        let cssLinkElem = document.createElement("link");
        cssLinkElem.href = settings.get('cssLink');
        cssLinkElem.rel = "stylesheet";
        document.head.append(cssLinkElem);
    }
    
    // Add CSS for permanent scoreboard override
    const permanentScoreboardCSS = document.createElement('style');
    permanentScoreboardCSS.id = 'permanent-scoreboard-css';
    permanentScoreboardCSS.innerHTML = `
        .bk-permanent-scoreboard {
            display: block !important; 
            visibility: visible !important;
            opacity: 1 !important;
            position: fixed !important; 
            top: 20px !important; 
            right: 20px !important; 
            left: auto !important; 
            transform: scale(0.8) !important; 
            transform-origin: top right !important; 
            z-index: 1000 !important;
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(permanentScoreboardCSS);
    
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
        </div>
    </div>`;
    document.body.appendChild(gui);

    // --- Menu Logic ---
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
        showKdrIndicator = e.target.checked;
        settings.set('showKdrIndicator', showKdrIndicator);
        if (showKdrIndicator) {
            startKdrScript();
        } else {
            stopKdrScript();
        }
    });

    document.getElementById("showScoreIndicator").checked = showScoreIndicator;
    document.getElementById("showScoreIndicator").addEventListener('change', (e) => { showScoreIndicator = e.target.checked; settings.set('showScoreIndicator', showScoreIndicator); });
    
    const permanentScoreboardCheckbox = document.getElementById("permanentScoreboard");
    permanentScoreboardCheckbox.checked = permanentScoreboard;
    permanentScoreboardCheckbox.addEventListener('change', (e) => {
        permanentScoreboard = e.target.checked;
        settings.set('permanentScoreboard', permanentScoreboard);
        enforceScoreboardStyle(); // Apply immediately
    });

    if (showKdrIndicator) {
        startKdrScript();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === "F1") { e.preventDefault(); toggleGui(); }
});

// =================== THIS IS THE FIX ===================
function toggleGui() {
    const gui = document.getElementById('gui');
    menuVisible = !menuVisible;
    gui.style.display = menuVisible ? 'block' : 'none';
    if (menuVisible) {
        // When the menu is visible, unlock the pointer so the mouse cursor shows up. This is correct.
        document.exitPointerLock();
    }
    // The "else" block that used to be here was removed.
    // By not re-locking the pointer here, the cursor remains visible after you close the menu.
    // The game will handle re-locking the pointer when you click back on the canvas.
}
// =======================================================


function updateFpsCap() {
    if (renderer && renderer.options) {
        renderer.options.maxFPS = uncappedFps ? 9999 : 60;
    }
}

function animate() {
    window.requestAnimationFrame(animate);
    crosshair = crosshair || document.getElementById("crosshair-static");
    if (crosshair && permCrosshair) {
        crosshair.style.cssText = "visibility: visible !important; opacity: 1 !important; display: block !important;";
    }
}

animate();