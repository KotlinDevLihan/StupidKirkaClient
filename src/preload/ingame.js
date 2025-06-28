const {clipboard, ipcRenderer} = require('electron');
const fs = require('fs');
const path = require('path');
const Store = require('electron-store');

// --- Script Definitions for GUI Options ---
const scriptOpenAllCards = `function _0x49b2(){const _0x53323f=['forEach','317853JapNKf','137IOKTRP','classList','addedNodes','3749982iZQqoJ','button','6730725BZNChm','children','observe','style','appendChild','6281ed5a-663a-45e1-9772-962c95aa4605','Periodic','15890jYvsFW','createElement','dataset','openallbutton_','includes','472zdYYio','1134119kMUbhj','innerHTML','Cold','Soldiers','Girls\\x20band','723c4ba7-57b3-4ae4-b65e-75686fa77bf1','innerText','length','subject','Party','className','text','382650QPoTYQ','keys','34524ywXPWQ','a5002827-97d1-4eb4-b893-af4047e0c77f'];_0x49b2=function(){return _0x53323f;};return _0x49b2();}function _0x5b85(_0x4ae122,_0x5d9718){const _0x49b226=_0x49b2();return _0x5b85=function(_0x5b855f,_0x39e0c7){_0x5b855f=_0x5b855f-0x114;let _0x50e90b=_0x49b226[_0x5b855f];return _0x50e90b;},_0x5b85(_0x4ae122,_0x5d9718);}(function(_0x5ebdf7,_0xbd67a){const _0x27f9f7=_0x5b85,_0x3b6d2c=_0x5ebdf7();while(!![]){try{const _0x51fd99=-parseInt(_0x27f9f7(0x124))/0x1*(-parseInt(_0x27f9f7(0x130))/0x2)+-parseInt(_0x27f9f7(0x11e))/0x3+-parseInt(_0x27f9f7(0x120))/0x4+parseInt(_0x27f9f7(0x129))/0x5+parseInt(_0x27f9f7(0x127))/0x6+-parseInt(_0x27f9f7(0x136))/0x7+-parseInt(_0x27f9f7(0x135))/0x8*(parseInt(_0x27f9f7(0x123))/0x9);if(_0x51fd99===_0xbd67a)break;else _0x3b6d2c['push'](_0x3b6d2c['shift']());}catch(_0xf5ee36){_0x3b6d2c['push'](_0x3b6d2c['shift']());}}}(_0x49b2,0xa574a),(function(){const _0x54d27c=_0x5b85;let _0x35e591=[_0x54d27c(0x11b),'Cold',_0x54d27c(0x115),_0x54d27c(0x116),_0x54d27c(0x12f)],_0x22a4de=[{'cardid':_0x54d27c(0x12e),'name':_0x54d27c(0x11b)}],_0x5bdb18=[{'cardid':'723c4ba7-57b3-4ae4-b65e-75686fa77bf2','name':_0x54d27c(0x114)}],_0x4b86c4=[{'cardid':'9cc5bd60-806f-4818-a7d4-1ba9b32bd96c','name':_0x54d27c(0x115)}],_0xe5525a=[{'cardid':_0x54d27c(0x117),'name':_0x54d27c(0x116)}],_0x2af004=[{'cardid':_0x54d27c(0x121),'name':'Periodic'}];const _0xde5a58=new MutationObserver(_0x4369d0=>{const _0x1c49d0=_0x54d27c;for(const _0x870251 of _0x4369d0){if(_0x870251['addedNodes'][_0x1c49d0(0x119)]){if(_0x870251[_0x1c49d0(0x126)][0x0][_0x1c49d0(0x11c)][_0x1c49d0(0x134)](_0x1c49d0(0x11a))){let _0x569c81=_0x870251[_0x1c49d0(0x126)][0x0],_0xadd81c=_0x870251[_0x1c49d0(0x126)][0x0];if(_0x569c81[_0x1c49d0(0x12a)][0x2]){_0x569c81=_0x569c81[_0x1c49d0(0x12a)][0x2];if(_0x569c81['children'][0x0]){_0x569c81=_0x569c81[_0x1c49d0(0x12a)][0x0];if(_0x569c81[_0x1c49d0(0x118)]&&_0x35e591[_0x1c49d0(0x134)](_0x569c81['innerText'])){let _0x46dac6=_0x569c81[_0x1c49d0(0x118)],_0x503839=_0xadd81c[_0x1c49d0(0x12a)][0x3],_0x545255=document[_0x1c49d0(0x131)](_0x1c49d0(0x128));_0x545255[_0x1c49d0(0x137)]=_0x503839['innerHTML'],_0x545255['id']=_0x1c49d0(0x133)+_0x569c81[_0x1c49d0(0x118)],_0x545255[_0x1c49d0(0x12c)]='background-color:\\x20var(--red-5);\\x20--hover-color:var(--red-1);\\x20--top:var(--red-1);\\x20--bottom:var(--red-3);margin-top:2rem',_0x545255[_0x1c49d0(0x125)]=_0x503839[_0x1c49d0(0x125)],Object[_0x1c49d0(0x11f)](_0x503839[_0x1c49d0(0x132)])[_0x1c49d0(0x122)](_0x2fe6f=>{const _0x35fe5d=_0x1c49d0;_0x545255[_0x35fe5d(0x132)][_0x2fe6f]='';}),_0x545255[_0x1c49d0(0x12a)][0x1][_0x1c49d0(0x137)]='\\x20OPEN\\x20ALL\\x20';let _0x5dc4a1;if(_0x46dac6==_0x1c49d0(0x11b))_0x5dc4a1=_0x22a4de;else{if(_0x46dac6==_0x1c49d0(0x114))_0x5dc4a1=_0x5bdb18;else{if(_0x46dac6==_0x1c49d0(0x115))_0x5dc4a1=_0x4b86c4;else{if(_0x46dac6==_0x1c49d0(0x116))_0x5dc4a1=_0xe5525a;else _0x46dac6==_0x1c49d0(0x12f)&&(_0x5dc4a1=_0x2af004);}}}_0x545255['onclick']=function(){try{let _0x229b90,_0x48e1b1;async function _0xdab9a7(){const _0x271c4d=_0x5b85;_0x229b90=await fetch('https://raw.githubusercontent.com/SheriffCarry/KirkaScripts/main/ConsoleScripts/OpenAllCards_live_updating.js'),_0x48e1b1=await _0x229b90[_0x271c4d(0x11d)](),eval(_0x48e1b1);}_0xdab9a7();}catch{}},_0xadd81c[_0x1c49d0(0x12d)](_0x545255);}}}}}}});_0xde5a58[_0x54d27c(0x12b)](document,{'childList':!![],'subtree':!![]});}()));`;

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
if (settings.get('openAllCards') === undefined) settings.set('openAllCards', false);
if (settings.get('autoOpenChests') === undefined) settings.set('autoOpenChests', false); // Changed setting name for clarity


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
let openAllCards = !!settings.get('openAllCards');
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

// --- NEW: Automatic Chest Opener ---
let autoChestInterval = null;
let isOpening = false; // A lock to prevent multiple clicks at once

function startAutoChestOpener() {
    if (autoChestInterval) return; // Already running
    console.log("Auto Chest Opener Activated.");

    autoChestInterval = setInterval(async () => {
        if (isOpening) return; // Don't do anything if an open action is already in progress

        // Find the "Continue" button from a previous open, and click it first
        const continueButton = Array.from(document.querySelectorAll('button.button.green'))
                                  .find(btn => btn.innerText.trim().toUpperCase() === 'CONTINUE');
        if (continueButton) {
            console.log("Found 'Continue' button, clicking it.");
            isOpening = true;
            continueButton.click();
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for animation
            isOpening = false;
            return; // End this check and let the next interval find the 'Open' button
        }
        
        // Check if we are on the chest opening screen by looking for the title
        const chestScreenTitle = Array.from(document.querySelectorAll('.title-text'))
                                    .find(el => el.innerText.includes('Select a chest to open'));

        if (chestScreenTitle) {
            // Find the "Open for Free" button
            const openButton = Array.from(document.querySelectorAll('button.button.green'))
                                  .find(btn => btn.innerText.trim().toUpperCase() === 'OPEN FOR FREE');
                                  
            if (openButton) {
                console.log("Found 'Open for Free' button, clicking it.");
                isOpening = true;
                openButton.click();
                // The 'isOpening' lock will be released by the 'Continue' button logic
            }
        }
    }, 1000); // Check every second
}

function stopAutoChestOpener() {
    if (autoChestInterval) {
        clearInterval(autoChestInterval);
        autoChestInterval = null;
        isOpening = false;
        console.log("Auto Chest Opener Deactivated.");
    }
}


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
        
        // Handle respawn detection death increment
        if (respawnDetected && deaths === lastDeaths) {
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
            kdRatio = kills.toFixed(2);
        } else {
            const ratio = kills / deaths;
            kdRatio = ratio.toFixed(2);
        }
        
        kdrDisplayElem.textContent = 'K/D: ' + kdRatio;
    }

    function detectDeath() {
        const healthBars = document.querySelectorAll('[class*="health"], [class*="hp"], .health-bar, .hp-bar');
        healthBars.forEach(healthBar => {
            const healthText = healthBar.textContent || healthBar.innerText;
            const healthMatch = healthText.match(/(\d+)/);
            if (healthMatch) {
                const currentHealth = Number(healthMatch[1]);
                if (lastHealth > 0 && currentHealth === 0) {
                    respawnDetected = true;
                    setTimeout(updateKDR, 100);
                }
                lastHealth = currentHealth;
            }
        });
        
        const respawnElements = document.querySelectorAll('[class*="respawn"], [class*="spawn"], .respawn-timer, .spawn-timer');
        if (respawnElements.length > 0) {
            respawnDetected = true;
            setTimeout(updateKDR, 100);
        }
        
        const killNotifications = document.querySelectorAll('[class*="killed"], [class*="death"], .notification, .kill-feed');
        killNotifications.forEach(notification => {
            const text = notification.textContent || notification.innerText || '';
            if (text.includes('killed') || text.includes('eliminated') || text.includes('died')) {
                respawnDetected = true;
                setTimeout(updateKDR, 100);
            }
        });
    }

    function forceKDRCheck() {
        detectDeath();
        
        const killSelectors = [
            '.kill-death .kill',
            '.kill:not(.kill-death):not(#kdrElem)',
            '[class*="kill"]:not(.kill-death):not(#kdrElem)',
            '.scoreboard-self .value:nth-child(1)'
        ];
        
        const deathSelectors = [
            '.WwwNnMm.bg.text-1',
            '[class*="WwwNnMm"][class*="bg"][class*="text-1"]',
            '.scoreboard-self .value:nth-child(2)'
        ];
        
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
                if (!deathText.includes('K/D:')) {
                    currentDeaths = Number(deathText.trim()) || 0;
                }
            }
            
            if (currentDeaths === 0) {
                const killDeathContainer = document.querySelector('.kill-death');
                if (killDeathContainer) {
                    const allText = killDeathContainer.textContent || killDeathContainer.innerText || '';
                    const cleanText = allText.replace(/K\/D:\s*[\d.]+/g, '');
                    const numbers = cleanText.match(/\d+/g);
                    if (numbers && numbers.length >= 2) {
                        currentDeaths = Number(numbers[1]) || 0;
                    }
                }
            }
            
            if (currentKills !== lastKills || currentDeaths !== lastDeaths) {
                updateKDR();
            }
        }
    }
    
    function hookGameScene() {
        const originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            if (prop === 'gameLogic' || prop === 'scene' || (descriptor && descriptor.value && descriptor.value.type === 'Scene')) {
                gameSceneHook = descriptor.value;
            }
            return originalDefineProperty.call(this, obj, prop, descriptor);
        };
        
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) {
            return originalRAF.call(this, function(time) {
                detectDeath();
                return callback(time);
            });
        };
    }
    
    kdrObserver = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        
        const killDeathContainer = document.getElementsByClassName('kill-death')[0];
        const isKdrElementInjected = document.getElementById('kdrElem');

        if (killDeathContainer && !isKdrElementInjected) {
            killDeathContainer.appendChild(kdrElement);
            shouldUpdate = true;
        }

        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                const checkNode = (node) => {
                    if (node.nodeType === 1) {
                        const className = node.className || '';
                        const classNameStr = typeof className === 'string' ? className : (className.toString ? className.toString() : '');
                        const textContent = node.textContent || '';
                        
                        if (classNameStr.includes('kill') || classNameStr.includes('death') || 
                            classNameStr.includes('respawn') || classNameStr.includes('spawn') ||
                            classNameStr.includes('health') || classNameStr.includes('hp') ||
                            classNameStr.includes('WwwNnMm') ||
                            textContent.includes('respawn') || textContent.includes('killed')) {
                            return true;
                        }
                        
                        if (node.querySelector && (
                            node.querySelector('.kill') || node.querySelector('.death') ||
                            node.querySelector('[class*="death"]') || node.querySelector('[class*="respawn"]') ||
                            node.querySelector('.WwwNnMm.bg.text-1'))) {
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
                        classNameStr.includes('WwwNnMm')) {
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
    
    hookGameScene();
    kdrUpdateInterval = setInterval(forceKDRCheck, 300);
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
        const fixedStyle = `display: block !important; visibility: visible !important; opacity: 1 !important; position: fixed !important; top: 20px !important; right: 20px !important; left: auto !important; transform: scale(0.8) !important; transform-origin: top right !important; z-index: 1000 !important; pointer-events: auto !important;`;
        if (scoreboard.style.cssText !== fixedStyle) {
            scoreboard.style.cssText = fixedStyle;
        }
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
}, 100);


document.addEventListener("DOMContentLoaded", () => {
    if (customCss) {
        let cssLinkElem = document.createElement("link");
        cssLinkElem.href = settings.get('cssLink');
        cssLinkElem.rel = "stylesheet";
        document.head.append(cssLinkElem);
    }
    
    const permanentScoreboardCSS = document.createElement('style');
    permanentScoreboardCSS.id = 'permanent-scoreboard-css';
    permanentScoreboardCSS.innerHTML = `.bk-permanent-scoreboard { display: block !important; visibility: visible !important; opacity: 1 !important; position: fixed !important; top: 20px !important; right: 20px !important; left: auto !important; transform: scale(0.8) !important; transform-origin: top right !important; z-index: 1000 !important; pointer-events: auto !important; }`;
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
            <div class="divider"></div>
            <label class="setting-label">Automation Scripts</label>
            <div class="setting"><label class="setting-label" style="color:#b9bbbe">"Open All Cards" Button (Reload to disable)</label><div class="setting-control"><label class="switch"><input type="checkbox" id="openAllCards"><span class="slider"></span></label></div></div>
            <div class="setting"><label class="setting-label" style="color:#b9bbbe">Auto Open Chests</label><div class="setting-control"><label class="switch"><input type="checkbox" id="autoOpenChests"><span class="slider"></span></label></div></div>
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
        enforceScoreboardStyle();
    });

    const allCardsCheckbox = document.getElementById("openAllCards");
    allCardsCheckbox.checked = openAllCards;
    allCardsCheckbox.addEventListener('change', (e) => {
        openAllCards = e.target.checked;
        settings.set('openAllCards', openAllCards);
        if (openAllCards) {
            runScript(scriptOpenAllCards);
        }
    });

    // --- NEW: Logic for Auto Chest Opener Toggle ---
    const autoChestsCheckbox = document.getElementById("autoOpenChests");
    autoChestsCheckbox.checked = autoOpenChests;
    autoChestsCheckbox.addEventListener('change', (e) => {
        autoOpenChests = e.target.checked;
        settings.set('autoOpenChests', autoOpenChests);
        if (autoOpenChests) {
            startAutoChestOpener();
        } else {
            stopAutoChestOpener();
        }
    });

    // --- Initial script execution based on settings ---
    if (openAllCards) {
        runScript(scriptOpenAllCards);
    }
    if (autoOpenChests) {
        startAutoChestOpener();
    }
    
    if (showKdrIndicator) {
        startKdrScript();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === "F1") { e.preventDefault(); toggleGui(); }
});

function toggleGui() {
    const gui = document.getElementById('gui');
    menuVisible = !menuVisible;
    gui.style.display = menuVisible ? 'block' : 'none';
    if (menuVisible) {
        document.exitPointerLock();
    }
}

function runScript(scriptCode) {
    try {
        const scriptElement = document.createElement('script');
        scriptElement.textContent = scriptCode;
        document.head.appendChild(scriptElement).remove();
    } catch(e) {
        console.error("Error executing dynamic script:", e);
    }
}

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