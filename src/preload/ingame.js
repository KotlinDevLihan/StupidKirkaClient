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
if (settings.get('tradingNotifications') === undefined) settings.set('tradingNotifications', true);
if (settings.get('showTradeValues') === undefined) settings.set('showTradeValues', true);
if (settings.get('performanceMonitor') === undefined) settings.set('performanceMonitor', false);
if (settings.get('inventoryPricing') === undefined) settings.set('inventoryPricing', true);
if (settings.get('quickActions') === undefined) settings.set('quickActions', true);


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
let tradingNotifications = !!settings.get('tradingNotifications');
let showTradeValues = !!settings.get('showTradeValues');
let performanceMonitor = !!settings.get('performanceMonitor');
let inventoryPricing = !!settings.get('inventoryPricing');
let quickActions = !!settings.get('quickActions');

let menuVisible = false;
let quickCssStyleElement;

// --- Trading System Variables ---
let tradingPriceData = {
    yzzz: null,
    bros: null,
    fetched: false
};
let activeTrades = new Map();
let tradeNotificationQueue = [];

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

// --- Trading System Implementation ---
async function fetchTradingPrices() {
    if (tradingPriceData.fetched) return;
    
    try {
        console.log("Fetching trading price data...");
        
        // Fetch Yzzz price data
        const yzzzResponse = await fetch('https://opensheet.elk.sh/1VqX9kwJx0WlHWKCJNGyIQe33APdUSXz0hEFk6x2-3bU/Sorted+View', {
            headers: {
                'accept': '*/*',
                'accept-language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
                'sec-fetch-site': 'cross-site'
            },
            method: 'GET'
        });
        tradingPriceData.yzzz = await yzzzResponse.json();
        
        // Fetch BROS price data
        const brosResponse = await fetch('https://opensheet.elk.sh/1tzHjKpu2gYlHoCePjp6bFbKBGvZpwDjiRzT9ZUfNwbY/Alphabetical');
        tradingPriceData.bros = await brosResponse.json();
        
        tradingPriceData.fetched = true;
        console.log("Trading price data fetched successfully");
    } catch (error) {
        console.error("Failed to fetch trading price data:", error);
    }
}

function getSkinValue(skinName, source = 'average') {
    if (!tradingPriceData.fetched) return null;
    
    let value = 0;
    let found = false;
    
    if (source === 'yzzz' && Array.isArray(tradingPriceData.yzzz)) {
        tradingPriceData.yzzz.forEach(item => {
            if (item.Name && item.Name.toLowerCase() === skinName.toLowerCase() && item['Base Value'] !== '-') {
                const baseValue = item['Base Value'].split(' ')[0].replace(/,/g, '').replace(/\./g, '');
                value = Number(baseValue);
                found = true;
            }
        });
    } else if (source === 'BROS' && Array.isArray(tradingPriceData.bros)) {
        tradingPriceData.bros.forEach(item => {
            if (item['Skin Name'] && item['Skin Name'].toLowerCase() === skinName.toLowerCase() && item.Price !== '-') {
                const price = item.Price.split(' ')[0].split('?')[0].replace(/,/g, '').replace(/\./g, '');
                value = Number(price);
                found = true;
            }
        });
    } else if (source === 'average') {
        let yzzzValue = 0, brosValue = 0, count = 0;
        
        if (Array.isArray(tradingPriceData.yzzz)) {
            tradingPriceData.yzzz.forEach(item => {
                if (item.Name && item.Name.toLowerCase() === skinName.toLowerCase() && item['Base Value'] !== '-') {
                    const baseValue = item['Base Value'].split(' ')[0].replace(/,/g, '').replace(/\./g, '');
                    yzzzValue = Number(baseValue);
                    count++;
                }
            });
        }
        
        if (Array.isArray(tradingPriceData.bros)) {
            tradingPriceData.bros.forEach(item => {
                if (item['Skin Name'] && item['Skin Name'].toLowerCase() === skinName.toLowerCase() && item.Price !== '-') {
                    const price = item.Price.split(' ')[0].split('?')[0].replace(/,/g, '').replace(/\./g, '');
                    brosValue = Number(price);
                    count++;
                }
            });
        }
        
        if (count > 0) {
            value = (yzzzValue + brosValue) / count;
            found = true;
        }
    }
    
    return found ? value : null;
}

function showTradeNotification(tradeData) {
    if (!tradingNotifications) return;
    
    const notification = document.createElement('div');
    notification.className = 'trade-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 10001;
        min-width: 350px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.18);
        font-family: "Montserrat", sans-serif;
        animation: slideIn 0.3s ease-out;
    `;
    
    const tradeValue = calculateTradeValue(tradeData);
    
    notification.innerHTML = `
        <style>
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .trade-notification .trade-header {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                font-size: 16px;
                font-weight: 600;
            }
            .trade-notification .trade-from {
                color: #ffd700;
                margin-left: 8px;
            }
            .trade-notification .trade-value {
                background: rgba(255,255,255,0.2);
                padding: 10px;
                border-radius: 8px;
                margin: 10px 0;
                text-align: center;
            }
            .trade-notification .trade-buttons {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }
            .trade-notification button {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            .trade-notification .accept-btn {
                background: #4CAF50;
                color: white;
            }
            .trade-notification .accept-btn:hover {
                background: #45a049;
                transform: translateY(-1px);
            }
            .trade-notification .deny-btn {
                background: #f44336;
                color: white;
            }
            .trade-notification .deny-btn:hover {
                background: #da190b;
                transform: translateY(-1px);
            }
            .trade-notification .view-btn {
                background: #2196F3;
                color: white;
            }
            .trade-notification .view-btn:hover {
                background: #1976D2;
                transform: translateY(-1px);
            }
        </style>
        <div class="trade-header">
            🤝 Trade Request from<span class="trade-from">${tradeData.fromUser || 'Unknown'}</span>
        </div>
        <div class="trade-value">
            📊 Estimated Value: <strong>${tradeValue.toLocaleString()} credits</strong>
        </div>
        <div class="trade-buttons">
            <button class="view-btn" onclick="viewTradeDetails('${tradeData.id}')">📋 View</button>
            <button class="accept-btn" onclick="acceptTrade('${tradeData.id}')">✅ Accept</button>
            <button class="deny-btn" onclick="denyTrade('${tradeData.id}')">❌ Deny</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 30000);
    
    // Store trade data
    activeTrades.set(tradeData.id, tradeData);
}

function calculateTradeValue(tradeData) {
    let totalValue = 0;
    
    if (tradeData.items && Array.isArray(tradeData.items)) {
        tradeData.items.forEach(item => {
            const value = getSkinValue(item.name);
            if (value) totalValue += value;
        });
    }
    
    return totalValue;
}

function showTradeDetailsGUI(tradeId) {
    const tradeData = activeTrades.get(tradeId);
    if (!tradeData) return;
    
    const gui = document.createElement('div');
    gui.className = 'trade-details-gui';
    gui.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #2b2d31;
        color: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 16px 64px rgba(0,0,0,0.5);
        z-index: 10002;
        min-width: 600px;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        font-family: "Montserrat", sans-serif;
        border: 2px solid #667eea;
    `;
    
    const yourValue = calculateTradeValue({ items: tradeData.yourItems || [] });
    const theirValue = calculateTradeValue({ items: tradeData.theirItems || [] });
    
    gui.innerHTML = `
        <style>
            .trade-details-gui .trade-header {
                text-align: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid #667eea;
            }
            .trade-details-gui .trade-sides {
                display: flex;
                gap: 30px;
                margin: 20px 0;
            }
            .trade-details-gui .trade-side {
                flex: 1;
                background: #36393f;
                padding: 20px;
                border-radius: 8px;
                border: 2px solid #40444b;
            }
            .trade-details-gui .side-header {
                text-align: center;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 15px;
                padding: 10px;
                border-radius: 6px;
            }
            .trade-details-gui .your-side .side-header {
                background: #4CAF50;
            }
            .trade-details-gui .their-side .side-header {
                background: #2196F3;
            }
            .trade-details-gui .item-list {
                min-height: 200px;
                max-height: 300px;
                overflow-y: auto;
            }
            .trade-details-gui .trade-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                margin: 8px 0;
                background: #40444b;
                border-radius: 6px;
                border-left: 4px solid #667eea;
            }
            .trade-details-gui .item-name {
                font-weight: 500;
            }
            .trade-details-gui .item-value {
                color: #ffd700;
                font-weight: 600;
            }
            .trade-details-gui .value-summary {
                background: #36393f;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: center;
            }
            .trade-details-gui .action-buttons {
                display: flex;
                gap: 15px;
                margin-top: 25px;
            }
            .trade-details-gui button {
                flex: 1;
                padding: 12px 20px;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 14px;
            }
            .trade-details-gui .accept-btn {
                background: #4CAF50;
                color: white;
            }
            .trade-details-gui .accept-btn:hover {
                background: #45a049;
                transform: translateY(-1px);
            }
            .trade-details-gui .deny-btn {
                background: #f44336;
                color: white;
            }
            .trade-details-gui .deny-btn:hover {
                background: #da190b;
                transform: translateY(-1px);
            }
            .trade-details-gui .close-btn {
                background: #72767d;
                color: white;
            }
            .trade-details-gui .close-btn:hover {
                background: #5a6069;
                transform: translateY(-1px);
            }
        </style>
        <div class="trade-header">
            <h2>🤝 Trade Details</h2>
            <p>Trading with: <strong>${tradeData.fromUser || 'Unknown'}</strong></p>
        </div>
        
        <div class="trade-sides">
            <div class="trade-side your-side">
                <div class="side-header">Your Items</div>
                <div class="item-list">
                    ${(tradeData.yourItems || []).map(item => {
                        const value = getSkinValue(item.name);
                        return `
                            <div class="trade-item">
                                <span class="item-name">${item.name}</span>
                                <span class="item-value">${value ? value.toLocaleString() : 'N/A'}</span>
                            </div>
                        `;
                    }).join('') || '<p style="text-align: center; color: #72767d; margin: 50px 0;">No items</p>'}
                </div>
            </div>
            
            <div class="trade-side their-side">
                <div class="side-header">Their Items</div>
                <div class="item-list">
                    ${(tradeData.theirItems || []).map(item => {
                        const value = getSkinValue(item.name);
                        return `
                            <div class="trade-item">
                                <span class="item-name">${item.name}</span>
                                <span class="item-value">${value ? value.toLocaleString() : 'N/A'}</span>
                            </div>
                        `;
                    }).join('') || '<p style="text-align: center; color: #72767d; margin: 50px 0;">No items</p>'}
                </div>
            </div>
        </div>
        
        <div class="value-summary">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Your Value: <strong style="color: #4CAF50;">${yourValue.toLocaleString()}</strong></span>
                <span>Their Value: <strong style="color: #2196F3;">${theirValue.toLocaleString()}</strong></span>
            </div>
            <div style="font-size: 16px; font-weight: 600;">
                Difference: <strong style="color: ${yourValue > theirValue ? '#4CAF50' : theirValue > yourValue ? '#f44336' : '#ffd700'}">
                    ${Math.abs(yourValue - theirValue).toLocaleString()} 
                    ${yourValue > theirValue ? '(You gain)' : theirValue > yourValue ? '(You lose)' : '(Equal)'}
                </strong>
            </div>
        </div>
        
        <div class="action-buttons">
            <button class="close-btn" onclick="closeTradeDetails()">Close</button>
            <button class="deny-btn" onclick="denyTrade('${tradeId}'); closeTradeDetails();">❌ Deny Trade</button>
            <button class="accept-btn" onclick="acceptTrade('${tradeId}'); closeTradeDetails();">✅ Accept Trade</button>
        </div>
    `;
    
    document.body.appendChild(gui);
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'trade-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 10001;
    `;
    overlay.onclick = () => closeTradeDetails();
    document.body.appendChild(overlay);
    
    // Store references for cleanup
    gui.overlay = overlay;
}

// Global functions for trade actions
window.viewTradeDetails = function(tradeId) {
    // Remove existing notification
    document.querySelectorAll('.trade-notification').forEach(n => n.remove());
    showTradeDetailsGUI(tradeId);
};

window.acceptTrade = function(tradeId) {
    console.log(`Accepting trade: ${tradeId}`);
    // Remove notification
    document.querySelectorAll('.trade-notification').forEach(n => n.remove());
    activeTrades.delete(tradeId);
    
    // Here you would integrate with the actual game's trading API
    showGameNotification("Trade accepted! ✅", 3000);
};

window.denyTrade = function(tradeId) {
    console.log(`Denying trade: ${tradeId}`);
    // Remove notification
    document.querySelectorAll('.trade-notification').forEach(n => n.remove());
    activeTrades.delete(tradeId);
    
    // Here you would integrate with the actual game's trading API
    showGameNotification("Trade denied! ❌", 3000);
};

window.closeTradeDetails = function() {
    const gui = document.querySelector('.trade-details-gui');
    const overlay = document.querySelector('.trade-overlay');
    if (gui) gui.remove();
    if (overlay) overlay.remove();
};

function showGameNotification(message, duration = 5000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-family: "Montserrat", sans-serif;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);
}

// Monitor for trade requests (this would need to be integrated with the game's actual trade system)
function initTradeMonitoring() {
    if (!tradingNotifications) return;
    
    // This is a placeholder - you would need to hook into the actual game's trade request system
    // For demonstration, we'll simulate trade requests
    console.log("Trade monitoring initialized");
    
    // Example: Monitor for specific elements or API calls that indicate trade requests
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            // Look for trade-related elements being added to the DOM
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList) {
                        // Check for trade-related classes or content
                        if (node.textContent && node.textContent.includes('wants to trade') || 
                            node.classList.contains('trade-request') ||
                            node.querySelector('[data-trade-id]')) {
                            
                            // Extract trade data from the element
                            const tradeData = extractTradeData(node);
                            if (tradeData) {
                                showTradeNotification(tradeData);
                            }
                        }
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function extractTradeData(element) {
    // This function would extract actual trade data from game elements
    // For now, return a sample trade for demonstration
    return {
        id: Date.now().toString(),
        fromUser: "TestUser",
        yourItems: [
            { name: "AK-47", rarity: "legendary" },
            { name: "M4A4", rarity: "epic" }
        ],
        theirItems: [
            { name: "AWP", rarity: "mythical" },
            { name: "Glock-18", rarity: "rare" }
        ]
    };
}

// --- Performance Monitor Implementation ---
let performanceInterval = null;
let performanceElement = null;

function startPerformanceMonitor() {
    if (!performanceMonitor || performanceInterval) return;
    
    performanceElement = document.createElement('div');
    performanceElement.id = 'performance-monitor';
    performanceElement.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: #00ff00;
        padding: 10px;
        border-radius: 5px;
        font-family: "Courier New", monospace;
        font-size: 12px;
        z-index: 9999;
        min-width: 150px;
        border: 1px solid #00ff00;
    `;
    
    document.body.appendChild(performanceElement);
    
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;
    
    function updatePerformance() {
        const now = performance.now();
        frameCount++;
        
        if (now - lastTime >= 1000) {
            fps = Math.round(frameCount * 1000 / (now - lastTime));
            frameCount = 0;
            lastTime = now;
        }
        
        const memUsage = performance.memory ? 
            (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB' : 'N/A';
        
        performanceElement.innerHTML = `
            <div style="color: #00ff41;">📊 PERFORMANCE</div>
            <div>FPS: ${fps}</div>
            <div>Memory: ${memUsage}</div>
            <div>Ping: ${getPing()}ms</div>
        `;
        
        requestAnimationFrame(updatePerformance);
    }
    
    updatePerformance();
}

function stopPerformanceMonitor() {
    if (performanceElement) {
        performanceElement.remove();
        performanceElement = null;
    }
}

function getPing() {
    // This would need to be integrated with the game's networking
    // For now, return a simulated ping
    return Math.floor(Math.random() * 50) + 20;
}

// --- Inventory Pricing Implementation ---
function addInventoryPricing() {
    if (!inventoryPricing || !showTradeValues) return;
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // Look for inventory items
                        const inventoryItems = node.querySelectorAll && node.querySelectorAll('.item-container, .inventory-item, [class*="item"]');
                        if (inventoryItems) {
                            inventoryItems.forEach(item => addPriceToItem(item));
                        }
                        
                        // Check if the node itself is an inventory item
                        if (node.classList && (node.classList.contains('item-container') || 
                            node.classList.contains('inventory-item') || 
                            node.className.includes('item'))) {
                            addPriceToItem(node);
                        }
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function addPriceToItem(itemElement) {
    if (!itemElement || itemElement.querySelector('.price-tag')) return;
    
    const itemName = extractItemName(itemElement);
    if (!itemName) return;
    
    const value = getSkinValue(itemName);
    if (!value) return;
    
    const priceTag = document.createElement('div');
    priceTag.className = 'price-tag';
    priceTag.style.cssText = `
        position: absolute;
        bottom: 2px;
        right: 2px;
        background: rgba(0, 0, 0, 0.8);
        color: #ffd700;
        padding: 2px 5px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: bold;
        z-index: 1000;
    `;
    priceTag.textContent = value.toLocaleString();
    
    itemElement.style.position = 'relative';
    itemElement.appendChild(priceTag);
}

function extractItemName(element) {
    // Try to find item name from various possible selectors
    const nameSelectors = [
        '.item-name',
        '.name',
        '[data-name]',
        '.tooltip-content'
    ];
    
    for (const selector of nameSelectors) {
        const nameElement = element.querySelector(selector);
        if (nameElement) {
            return nameElement.textContent || nameElement.dataset.name;
        }
    }
    
    // Fallback: look for text content that looks like an item name
    const text = element.textContent || '';
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Return the first non-empty line that doesn't look like a number or common UI text
    for (const line of lines) {
        if (line.length > 2 && !line.match(/^\d+$/) && 
            !line.toLowerCase().includes('rarity') && 
            !line.toLowerCase().includes('level')) {
            return line;
        }
    }
    
    return null;
}

// --- Quick Actions Implementation ---
function initQuickActions() {
    if (!quickActions) return;
    
    document.addEventListener('keydown', (e) => {
        // Only process if not in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.code) {
            case 'F2':
                e.preventDefault();
                togglePerformanceMonitor();
                break;
            case 'F3':
                e.preventDefault();
                simulateTradeRequest(); // For testing
                break;
            case 'F5':
                e.preventDefault();
                location.reload();
                break;
            case 'F8':
                e.preventDefault();
                copyGameUrl();
                break;
        }
    });
    
    console.log("Quick Actions initialized:");
    console.log("F2 - Toggle Performance Monitor");
    console.log("F3 - Simulate Trade Request (Demo)");
    console.log("F5 - Refresh Game");
    console.log("F8 - Copy Current URL");
}

function togglePerformanceMonitor() {
    performanceMonitor = !performanceMonitor;
    settings.set('performanceMonitor', performanceMonitor);
    
    if (performanceMonitor) {
        startPerformanceMonitor();
        showGameNotification("Performance Monitor ON", 2000);
    } else {
        stopPerformanceMonitor();
        showGameNotification("Performance Monitor OFF", 2000);
    }
}

function simulateTradeRequest() {
    const sampleTrade = {
        id: Date.now().toString(),
        fromUser: "DemoPlayer",
        yourItems: [
            { name: "AK-47 Redline", rarity: "legendary" },
            { name: "M4A4 Dragon King", rarity: "epic" }
        ],
        theirItems: [
            { name: "AWP Lightning Strike", rarity: "mythical" },
            { name: "Glock-18 Water Elemental", rarity: "rare" }
        ]
    };
    showTradeNotification(sampleTrade);
}

function copyGameUrl() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showGameNotification("URL copied to clipboard!", 2000);
    }).catch(() => {
        showGameNotification("Failed to copy URL", 2000);
    });
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
            <label class="setting-label">Trading System</label>
            <div class="setting"><label class="setting-label" style="color:#b9bbbe">Trade Notifications</label><div class="setting-control"><label class="switch"><input type="checkbox" id="tradingNotifications"><span class="slider"></span></label></div></div>
            <div class="setting"><label class="setting-label" style="color:#b9bbbe">Show Trade Values</label><div class="setting-control"><label class="switch"><input type="checkbox" id="showTradeValues"><span class="slider"></span></label></div></div>
            <div class="divider"></div>
            <label class="setting-label">Enhanced Features</label>
            <div class="setting"><label class="setting-label" style="color:#b9bbbe">Performance Monitor</label><div class="setting-control"><label class="switch"><input type="checkbox" id="performanceMonitor"><span class="slider"></span></label></div></div>
            <div class="setting"><label class="setting-label" style="color:#b9bbbe">Inventory Pricing</label><div class="setting-control"><label class="switch"><input type="checkbox" id="inventoryPricing"><span class="slider"></span></label></div></div>
            <div class="setting"><label class="setting-label" style="color:#b9bbbe">Quick Actions (F2-F8)</label><div class="setting-control"><label class="switch"><input type="checkbox" id="quickActions"><span class="slider"></span></label></div></div>
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

    const tradingNotificationsCheckbox = document.getElementById("tradingNotifications");
    tradingNotificationsCheckbox.checked = tradingNotifications;
    tradingNotificationsCheckbox.addEventListener('change', (e) => {
        tradingNotifications = e.target.checked; 
        settings.set('tradingNotifications', tradingNotifications);
        if (tradingNotifications) initTradeMonitoring();
    });

    const showTradeValuesCheckbox = document.getElementById("showTradeValues");
    showTradeValuesCheckbox.checked = showTradeValues;
    showTradeValuesCheckbox.addEventListener('change', (e) => {
        showTradeValues = e.target.checked; 
        settings.set('showTradeValues', showTradeValues);
    });

    const performanceMonitorCheckbox = document.getElementById("performanceMonitor");
    performanceMonitorCheckbox.checked = performanceMonitor;
    performanceMonitorCheckbox.addEventListener('change', (e) => {
        performanceMonitor = e.target.checked; 
        settings.set('performanceMonitor', performanceMonitor);
        if (performanceMonitor) startPerformanceMonitor();
        else stopPerformanceMonitor();
    });

    const inventoryPricingCheckbox = document.getElementById("inventoryPricing");
    inventoryPricingCheckbox.checked = inventoryPricing;
    inventoryPricingCheckbox.addEventListener('change', (e) => {
        inventoryPricing = e.target.checked; 
        settings.set('inventoryPricing', inventoryPricing);
        if (inventoryPricing) addInventoryPricing();
    });

    const quickActionsCheckbox = document.getElementById("quickActions");
    quickActionsCheckbox.checked = quickActions;
    quickActionsCheckbox.addEventListener('change', (e) => {
        quickActions = e.target.checked; 
        settings.set('quickActions', quickActions);
        if (quickActions) initQuickActions();
    });

    
    // Initialize features
    if (autoOpenCards || autoOpenChests) {
        startAsyncOpeners();
    }
    if (showKdrIndicator) startKdrScript();
    if (performanceMonitor) startPerformanceMonitor();
    if (inventoryPricing) addInventoryPricing();
    if (quickActions) initQuickActions();
    
    // Initialize trading system
    fetchTradingPrices();
    if (tradingNotifications) initTradeMonitoring();
    
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