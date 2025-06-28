const {clipboard, ipcRenderer} = require('electron');
const fs = require('fs');
const path = require('path');
const Store = require('electron-store');

// --- Your full-featured, standalone opening scripts ---
const scriptOpenAllCards = `
(async () => {
  let git_base = "SheriffCarry";
  let openingdelay = 2000;
  let cards;
  try {
    cards = customcardlist;
  } catch {
    cards = [
      { cardid: "723c4ba7-57b3-4ae4-b65e-75686fa77bf2", name: "Cold" },
      { cardid: "723c4ba7-57b3-4ae4-b65e-75686fa77bf1", name: "Girls band" },
      { cardid: "6281ed5a-663a-45e1-9772-962c95aa4605", name: "Party" },
      { cardid: "9cc5bd60-806f-4818-a7d4-1ba9b32bd96c", name: "Soldiers" },
      { cardid: "a5002827-97d1-4eb4-b893-af4047e0c77f", name: "Periodic" },
    ];
  }
  let coloroutput = { PARANORMAL: "000000", MYTHICAL: "c20025", LEGENDARY: "feaa37", EPIC: "cd2afc", RARE: "43abde", COMMON: "47f2a0", DEFAULT: "ffffff" };
  let translations_req = await fetch(\`https://raw.githubusercontent.com/\${git_base}/KirkaScripts/main/ConsoleScripts/microwaves.json\`);
  let translations = await translations_req.json();
  Object.keys(translations).forEach((item) => { translations[translations[item]] = item; });
  function logCredits() { console.log("%cMade by carrysheriff/SheriffCarry discord: @carrysheriff", "color: #000000;background-color: #FFFFFF;font-size: large;"); console.log("If you only want a specific card to be opened, just delete the card from the array at the top of the script"); console.log(\`https://github.com/\${git_base}/KirkaScripts/blob/main/ConsoleScripts/OpenAllCards_live_updating.js this code is live updatin\`); }
  async function fetchInventory() { let response = await fetch(\`https://api2.kirka.io/api/\${translations["inventory"]}\`, { headers: { accept: "application/json", authorization: \`Bearer \${localStorage.token}\` } }); return await response.json(); }
  let bvl = [];
  async function setBVL() { let response = await fetch("https://opensheet.elk.sh/1tzHjKpu2gYlHoCePjp6bFbKBGvZpwDjiRzT9ZUfNwbY/Alphabetical"); bvl = await response.json(); }
  function rarity_backup(spreadsheet, namefield, rarityfield, skinname) { let found = false; let rarity = "Unknown-Rarity"; spreadsheet.forEach((listitem) => { if (listitem && listitem[namefield] && listitem[rarityfield]) { if (found == false && listitem[namefield] == skinname && Object.keys(coloroutput).includes(listitem[rarityfield].toUpperCase())) { found = true; rarity = listitem[rarityfield]; } } }); return rarity; }
  async function openCard(cardid) { let bodyobj = {}; bodyobj[translations["id"]] = cardid; const response = await fetch(\`https://api2.kirka.io/api/\${translations["inventory"]}/\${translations["openCharacterCard"]}\`, { method: "POST", headers: { accept: "application/json", authorization: \`Bearer \${localStorage.token}\`, "content-type": "application/json;charset=UTF-8" }, body: JSON.stringify(bodyobj) }); let json = await response.json(); let returnobj = {}; Array.from(json).forEach((item) => { Object.keys(item).forEach((key) => { if (typeof item[key] == "boolean" && item[key] == true) { returnobj = item; } }); }); return returnobj; }
  function ingameShowcase_messages(message, displaylength) { let elem = document.createElement("div"); elem.classList = "vue-notification-wrapper"; elem.style = "transition-timing-function: ease; transition-delay: 0s; transition-property: all;"; elem.innerHTML = \`<div data-v-3462d80a="" data-v-460e7e47="" class="alert-default"><span data-v-3462d80a="" class="text">\${message}</span></div>\`; elem.onclick = function () { try { elem.remove(); } catch {} }; document.getElementsByClassName("vue-notification-group")[0].children[0].appendChild(elem); setTimeout(() => { try { elem.remove(); } catch {} }, displaylength); }
  function ingameShowcase_end() { let end_elem = document.createElement("div"); end_elem.classList = "vue-notification-wrapper"; end_elem.style = "transition-timing-function: ease; transition-delay: 0s; transition-property: all;"; end_elem.innerHTML = \`<div data-v-3462d80a="" data-v-460e7e47="" class="alert-default"><span data-v-3462d80a="" class="text">Finished running, check console for more details</span></div>\`; end_elem.onclick = function () { try { end_elem.remove(); } catch {} }; document.getElementsByClassName("vue-notification-group")[0].children[0].appendChild(end_elem); setTimeout(() => { try { end_elem.remove(); } catch {} }, 15000); }
  function ingameShowcase(message, rarity, name) { rarity = translations[rarity]; if (rarity == undefined) { rarity = rarity_backup(bvl, "Skin Name", "Rarity", name); } const text = \`\${rarity} \${message} from: \${name}\`; const style = \`color: #\${coloroutput[rarity.toUpperCase()] || coloroutput.DEFAULT}\`; console.log(\`%c\${text}\`, style); const elem = document.createElement("div"); elem.classList.add("vue-notification-wrapper"); elem.style = "transition-timing-function: ease; transition-delay: 0s; transition-property: all;"; elem.innerHTML = \`<div data-v-3462d80a="" data-v-460e7e47="" class="alert-default"><span data-v-3462d80a="" class="text" style="color:#\${coloroutput[rarity.toUpperCase()] || coloroutput.DEFAULT}">\${text}</span></div>\`; elem.onclick = function () { try { elem.remove(); } catch {} }; document.getElementsByClassName("vue-notification-group")[0].children[0].appendChild(elem); setTimeout(() => { try { elem.remove(); } catch {} }, 5000); }
  function confettiAnimation() { const duration = 15 * 1000; const animationEnd = Date.now() + duration; const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }; function randomInRange(min, max) { return Math.random() * (max - min) + min; } const intervalconfetti = setInterval(() => { const timeLeft = animationEnd - Date.now(); if (timeLeft <= 0) { clearInterval(intervalconfetti); return; } const particleCount = 50 * (timeLeft / duration); confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, zIndex: 99999 }); confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, zIndex: 99999 }); }, 250); }
  function updateCounter(counter, cardskipper) { counter = (counter + 1) % cards.length; while (cardskipper[counter] >= 2) { counter = (counter + 1) % cards.length; let check = cardskipper.reduce((acc, val) => acc + val, 0); if (check == cardskipper.length * 2) { counter = 0; break; } } return counter; }
  function automatic_microwaves(inventory) { inventory.forEach((item) => { Object.keys(item).forEach((key) => { if (typeof item[key] == "object") { translations["item"] = key; } }); }); inventory.forEach((item) => { Object.keys(item[translations["item"]]).forEach((key) => { if ((typeof item[translations["item"]][key] == "string" && item[translations["item"]][key] == "Elizabeth") || item[translations["item"]][key] == "James") { translations["name"] = key; } }); }); inventory.forEach((item) => { Object.keys(item[translations["item"]]).forEach((key) => { if ((typeof item[translations["item"]][key] == "string" && item[translations["item"]][key] == "a1055b22-18ca-4cb9-8b39-e46bb0151185") || item[translations["item"]][key] == "6be53225-952a-45d7-a862-d69290e4348e") { translations["id"] = key; } }); }); }
  function processCardskipper(cardskipper, inventory) { try { inventory.forEach((item) => { for (let i = 0; i < cards.length; i++) { if (item[translations["item"]][translations["id"]] == cards[i]["cardid"]) { cardskipper[i] = 0; } } }); return cardskipper; } catch { ingameShowcase_messages("Kirka microwave issue", 15000); return cardskipper; } }
  function logSummary(itemsByRarity, colorMap) { console.log("%c--- Summary ---", "color: #FFFFFF; background-color: #000000; font-weight: bold; font-size: 1.2em; padding: 2px;"); const rarityOrder = [ "PARANORMAL", "MYTHICAL", "LEGENDARY", "EPIC", "RARE", "COMMON" ]; const sortedRarities = Object.keys(itemsByRarity).sort((a, b) => { const indexA = rarityOrder.indexOf(a); const indexB = rarityOrder.indexOf(b); if (indexA === -1 && indexB === -1) return 0; if (indexA === -1) return 1; if (indexB === -1) return -1; return indexA - indexB; }); for (const rarity of sortedRarities) { const items = itemsByRarity[rarity]; if (!items || items.length === 0) continue; const itemCounts = items.reduce((acc, item) => { acc[item] = (acc[item] || 0) + 1; return acc; }, {}); const itemsString = Object.entries(itemCounts).map(([name, count]) => \`\${name} x\${count}\`).join(", "); const totalCount = items.length; const color = colorMap[rarity] || colorMap.DEFAULT; const logText = \`\${totalCount}x \${rarity}: \${itemsString}\`; console.log(\`%c\${logText}\`, \`color: #\${color}; font-weight: bold;\`); } }
  let cardskipper = new Array(cards.length).fill(2); try { cardskipper[0] = 0; } catch {}
  (async () => { logCredits(); if (!cards[0]) { return; } await setBVL(); let inventory = await fetchInventory(); automatic_microwaves(inventory); cardskipper = processCardskipper(cardskipper, inventory); if (!document.getElementById("konfettijs")) { let script = document.createElement("script"); script.id = "konfettijs"; script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"; document.head.appendChild(script); } let openedItems = {}; let counter = 0; let interval = setInterval(async () => { let cardresult = await openCard(cards[counter]["cardid"]); let resultName = cardresult[translations["name"]]; let resultRarity = cardresult[translations["rarity"]]; if (resultName) { ingameShowcase(resultName, resultRarity, cards[counter]["name"]); let translatedRarity = translations[resultRarity]; if (translatedRarity == undefined) { translatedRarity = rarity_backup( bvl, "Skin Name", "Rarity", resultName, ); } translatedRarity = translatedRarity.toUpperCase(); if (!openedItems[translatedRarity]) { openedItems[translatedRarity] = []; } openedItems[translatedRarity].push(resultName); if ( translations[resultRarity] == "MYTHICAL" || translations[resultRarity] == "PARANORMAL" ) { confettiAnimation(); } } else if (cardresult["code"] == 9910) { console.log("RATELIMIT"); } else { cardskipper[counter]++; console.log("DON'T WORRY ABOUT THE ERROR"); console.log("THE CHEST THAT IT TRIED TO OPEN IS NOT AVAILABLE ANYMORE"); console.log("IT WILL SKIP THAT ONE AFTER 2 FAILS"); } counter = updateCounter(counter, cardskipper); let check = cardskipper.reduce((acc, val) => acc + val, 0); if (check == cardskipper.length * 2) { clearInterval(interval); console.log("Finished Running"); ingameShowcase_end(); logSummary(openedItems, coloroutput); } }, openingdelay); })();
})();
`;

const scriptOpenAllChests = `
(async () => {
  let git_base = "SheriffCarry";
  let openingdelay = 2000;
  let chests;
  try {
    chests = customchestlist;
  } catch {
    chests = [
      { chestid: "077a4cf2-7b76-4624-8be6-4a7316cf5906", name: "Golden" },
      { chestid: "ec230bdb-4b96-42c3-8bd0-65d204a153fc", name: "Ice" },
      { chestid: "71182187-109c-40c9-94f6-22dbb60d70ee", name: "Wood" },
    ];
  }
  let coloroutput = { PARANORMAL: "000000", MYTHICAL: "c20025", LEGENDARY: "feaa37", EPIC: "cd2afc", RARE: "43abde", COMMON: "47f2a0", DEFAULT: "ffffff" };
  let translations_req = await fetch(\`https://raw.githubusercontent.com/\${git_base}/KirkaScripts/main/ConsoleScripts/microwaves.json\`);
  let translations = await translations_req.json();
  Object.keys(translations).forEach((item) => { translations[translations[item]] = item; });
  function logCredits() { console.log("%cMade by carrysheriff/SheriffCarry discord: @carrysheriff", "color: #000000;background-color: #FFFFFF;font-size: large;"); console.log("If you only want a specific chest to be opened, just delete the chest from the array at the top of the script"); console.log(\`https://github.com/\${git_base}/KirkaScripts/blob/main/ConsoleScripts/OpenAllChests_live_updating.js this code is live updating\`); }
  async function fetchInventory() { let response = await fetch(\`https://api2.kirka.io/api/\${translations["inventory"]}\`, { headers: { accept: "application/json", authorization: \`Bearer \${localStorage.token}\` } }); return await response.json(); }
  let bvl = [];
  async function setBVL() { let response = await fetch("https://opensheet.elk.sh/1tzHjKpu2gYlHoCePjp6bFbKBGvZpwDjiRzT9ZUfNwbY/Alphabetical"); bvl = await response.json(); }
  function rarity_backup(spreadsheet, namefield, rarityfield, skinname) { let found = false; let rarity = "Unknown-Rarity"; spreadsheet.forEach((listitem) => { if (listitem && listitem[namefield] && listitem[rarityfield]) { if (found == false && listitem[namefield] == skinname && Object.keys(coloroutput).includes(listitem[rarityfield].toUpperCase())) { found = true; rarity = listitem[rarityfield]; } } }); return rarity; }
  async function openChest(chestId) { let bodyobj = {}; bodyobj[translations["id"]] = chestId; const response = await fetch(\`https://api2.kirka.io/api/\${translations["inventory"]}/\${translations["openChest"]}\`, { method: "POST", headers: { accept: "application/json", authorization: \`Bearer \${localStorage.token}\`, "content-type": "application/json;charset=UTF-8" }, body: JSON.stringify(bodyobj) }); return await response.json(); }
  function ingameShowcase_messages(message, displaylength) { let elem = document.createElement("div"); elem.classList = "vue-notification-wrapper"; elem.style = "transition-timing-function: ease; transition-delay: 0s; transition-property: all;"; elem.innerHTML = \`<div data-v-3462d80a="" data-v-460e7e47="" class="alert-default"><span data-v-3462d80a="" class="text">\${message}</span></div>\`; elem.onclick = function () { try { elem.remove(); } catch {} }; document.getElementsByClassName("vue-notification-group")[0].children[0].appendChild(elem); setTimeout(() => { try { elem.remove(); } catch {} }, displaylength); }
  function ingameShowcase_end() { let end_elem = document.createElement("div"); end_elem.classList = "vue-notification-wrapper"; end_elem.style = "transition-timing-function: ease; transition-delay: 0s; transition-property: all;"; end_elem.innerHTML = \`<div data-v-3462d80a="" data-v-460e7e47="" class="alert-default"><span data-v-3462d80a="" class="text">Finished running, check console for more details</span></div>\`; end_elem.onclick = function () { try { end_elem.remove(); } catch {} }; document.getElementsByClassName("vue-notification-group")[0].children[0].appendChild(end_elem); setTimeout(() => { try { end_elem.remove(); } catch {} }, 15000); }
  function ingameShowcase(message, rarity, name) { rarity = translations[rarity]; if (rarity == undefined) { rarity = rarity_backup(bvl, "Skin Name", "Rarity", name); } const text = \`\${rarity} \${message} from: \${name}\`; const style = \`color: #\${coloroutput[rarity.toUpperCase()] || coloroutput.DEFAULT}\`; console.log(\`%c\${text}\`, style); const elem = document.createElement("div"); elem.classList.add("vue-notification-wrapper"); elem.style = "transition-timing-function: ease; transition-delay: 0s; transition-property: all;"; elem.innerHTML = \`<div data-v-3462d80a="" data-v-460e7e47="" class="alert-default"><span data-v-3462d80a="" class="text" style="color:#\${coloroutput[rarity.toUpperCase()] || coloroutput.DEFAULT}">\${text}</span></div>\`; elem.onclick = function () { try { elem.remove(); } catch {} }; document.getElementsByClassName("vue-notification-group")[0].children[0].appendChild(elem); setTimeout(() => { try { elem.remove(); } catch {} }, 5000); }
  function confettiAnimation() { const duration = 15 * 1000; const animationEnd = Date.now() + duration; const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }; function randomInRange(min, max) { return Math.random() * (max - min) + min; } const intervalconfetti = setInterval(() => { const timeLeft = animationEnd - Date.now(); if (timeLeft <= 0) { clearInterval(intervalconfetti); return; } const particleCount = 50 * (timeLeft / duration); confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, zIndex: 99999 }); confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, zIndex: 99999 }); }, 250); }
  function updateCounter(counter, chestskipper) { counter = (counter + 1) % chests.length; while (chestskipper[counter] >= 2) { counter = (counter + 1) % chests.length; let check = chestskipper.reduce((acc, val) => acc + val, 0); if (check == chestskipper.length * 2) { counter = 0; break; } } return counter; }
  function automatic_microwaves(inventory) { inventory.forEach((item) => { Object.keys(item).forEach((key) => { if (typeof item[key] == "object") { translations["item"] = key; } }); }); inventory.forEach((item) => { Object.keys(item[translations["item"]]).forEach((key) => { if ((typeof item[translations["item"]][key] == "string" && item[translations["item"]][key] == "Elizabeth") || item[translations["item"]][key] == "James") { translations["name"] = key; } }); }); inventory.forEach((item) => { Object.keys(item[translations["item"]]).forEach((key) => { if ((typeof item[translations["item"]][key] == "string" && item[translations["item"]][key] == "a1055b22-18ca-4cb9-8b39-e46bb0151185") || item[translations["item"]][key] == "6be53225-952a-45d7-a862-d69290e4348e") { translations["id"] = key; } }); }); }
  function processChestskipper(chestskipper, inventory) { try { inventory.forEach((item) => { for (let i = 0; i < chests.length; i++) { if (item[translations["item"]][translations["id"]] == chests[i]["chestid"]) { chestskipper[i] = 0; } } }); return chestskipper; } catch { ingameShowcase_messages("Kirka microwave issue", 15000); return chestskipper; } }
  function logSummary(itemsByRarity, colorMap) { console.log("%c--- Summary ---", "color: #FFFFFF; background-color: #000000; font-weight: bold; font-size: 1.2em; padding: 2px;"); const rarityOrder = [ "PARANORMAL", "MYTHICAL", "LEGENDARY", "EPIC", "RARE", "COMMON" ]; const sortedRarities = Object.keys(itemsByRarity).sort((a, b) => { const indexA = rarityOrder.indexOf(a); const indexB = rarityOrder.indexOf(b); if (indexA === -1 && indexB === -1) return 0; if (indexA === -1) return 1; if (indexB === -1) return -1; return indexA - indexB; }); for (const rarity of sortedRarities) { const items = itemsByRarity[rarity]; if (!items || items.length === 0) continue; const itemCounts = items.reduce((acc, item) => { acc[item] = (acc[item] || 0) + 1; return acc; }, {}); const itemsString = Object.entries(itemCounts).map(([name, count]) => \`\${name} x\${count}\`).join(", "); const totalCount = items.length; const color = colorMap[rarity] || colorMap.DEFAULT; const logText = \`\${totalCount}x \${rarity}: \${itemsString}\`; console.log(\`%c\${logText}\`, \`color: #\${color}; font-weight: bold;\`); } }
  let chestskipper = new Array(chests.length).fill(2); try { chestskipper[0] = 0; } catch {}
  (async () => { logCredits(); if (!chests[0]) { return; } await setBVL(); let inventory = await fetchInventory(); automatic_microwaves(inventory); chestskipper = processChestskipper(chestskipper, inventory); if (!document.getElementById("konfettijs")) { let script = document.createElement("script"); script.id = "konfettijs"; script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"; document.head.appendChild(script); } let openedItems = {}; let counter = 0; let interval = setInterval(async () => { let chestresult = await openChest(chests[counter]["chestid"]); let resultName = chestresult[translations["name"]]; let resultRarity = chestresult[translations["rarity"]]; if (resultName) { ingameShowcase(resultName, resultRarity, chests[counter]["name"]); let translatedRarity = translations[resultRarity]; if (translatedRarity == undefined) { translatedRarity = rarity_backup( bvl, "Skin Name", "Rarity", resultName, ); } translatedRarity = translatedRarity.toUpperCase(); if (!openedItems[translatedRarity]) { openedItems[translatedRarity] = []; } openedItems[translatedRarity].push(resultName); if ( translations[resultRarity] == "MYTHICAL" || translations[resultRarity] == "PARANORMAL" ) { confettiAnimation(); } } else if (chestresult["code"] == 9910) { console.log("RATELIMIT"); } else { chestskipper[counter]++; console.log("DON'T WORRY ABOUT THE ERROR"); console.log("THE CHEST THAT IT TRIED TO OPEN IS NOT AVAILABLE ANYMORE"); console.log("IT WILL SKIP THAT ONE AFTER 2 FAILS"); } counter = updateCounter(counter, chestskipper); let check = chestskipper.reduce((acc, val) => acc + val, 0); if (check == chestskipper.length * 2) { clearInterval(interval); console.log("Finished Running"); ingameShowcase_end(); logSummary(openedItems, coloroutput); } }, openingdelay); })();
})();
`;

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

// --- Game object references ---
let renderer;
let crosshair;

Object.defineProperty(Object.prototype, "gameLogic", {
    set(value) {
        if (this.app && this.app.renderer) {
            renderer = this.app.renderer;
            console.log("BetterKirkaClient: Game renderer instance captured!");
            updateFpsCap();
        }
        this._gameLogic = value;
    },
    get() { return this._gameLogic; },
    configurable: true
});

// --- Asynchronous, Standalone Script Execution ---
let openAllInterval = null;

function runOpenAllScripts() {
    // This function will be called repeatedly by the interval
    if (autoOpenChests) {
        console.log("Auto-opener: Checking for chests...");
        try { new Function(scriptOpenAllChests)(); } 
        catch (e) { console.error("Failed to execute auto-open chest script:", e); }
    }
    if (autoOpenCards) {
        console.log("Auto-opener: Checking for cards...");
        try { new Function(scriptOpenAllCards)(); } 
        catch (e) { console.error("Failed to execute auto-open card script:", e); }
    }
}

function startAsyncOpeners() {
    if (openAllInterval) return; // Prevent multiple intervals
    console.log("Starting asynchronous auto-opener interval (every 30 seconds).");
    // Run it once immediately
    runOpenAllScripts(); 
    // Then run it on a timer
    openAllInterval = setInterval(runOpenAllScripts, 30000); // Check every 30 seconds
}

function stopAsyncOpeners() {
    if (openAllInterval) {
        clearInterval(openAllInterval);
        openAllInterval = null;
        console.log("Stopped asynchronous auto-opener interval.");
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

function enforceScoreboardStyle() {
    const ffaScoreboard = document.querySelector('.tab-info');
    const teamScoreboard = document.querySelector('.tab-team-info');
    
    let scoreboardToPin = null;
    let isTeamBoard = false;

    if (ffaScoreboard) {
        scoreboardToPin = ffaScoreboard;
        isTeamBoard = false;
    } else if (teamScoreboard) {
        scoreboardToPin = teamScoreboard;
        isTeamBoard = true;
    }

    const baseStyle = `display: flex !important; visibility: visible !important; opacity: 1 !important; position: fixed !important; top: 20px !important; right: 20px !important; left: auto !important; bottom: auto !important; transform-origin: top right !important; z-index: 999 !important; pointer-events: auto !important; background-color: rgba(0, 0, 0, 0.2) !important; border-radius: 5px;`;
    
    let finalStyle;
    if (isTeamBoard) {
        finalStyle = baseStyle + `transform: scale(0.65) !important; padding: 8px !important;`;
    } else {
        finalStyle = baseStyle + `transform: scale(0.8) !important; padding: 10px !important;`;
    }

    if (permanentScoreboard && scoreboardToPin) {
        if (scoreboardToPin.style.cssText !== finalStyle) {
            scoreboardToPin.style.cssText = finalStyle;
        }
    } else {
        if (ffaScoreboard && ffaScoreboard.style.position === 'fixed') {
            ffaScoreboard.style.cssText = '';
        }
        if (teamScoreboard && teamScoreboard.style.position === 'fixed') {
            teamScoreboard.style.cssText = '';
        }
    }
}

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
        if (autoOpenCards || autoOpenChests) startAsyncOpeners();
        else stopAsyncOpeners();
    });

    const autoChestsCheckbox = document.getElementById("autoOpenChests");
    autoChestsCheckbox.checked = autoOpenChests;
    autoChestsCheckbox.addEventListener('change', (e) => {
        autoOpenChests = e.target.checked; settings.set('autoOpenChests', autoOpenChests);
        if (autoOpenCards || autoOpenChests) startAsyncOpeners();
        else stopAsyncOpeners();
    });
    
    // Initialize features
    if (autoOpenCards || autoOpenChests) {
        startAsyncOpeners();
    }
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
    if (crosshair && permCrosshair) {
        crosshair.style.cssText = "visibility: visible !important; opacity: 1 !important; display: block !important;";
    }
}

animate();