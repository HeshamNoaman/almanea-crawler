import puppeteer from "puppeteer";
import fs from 'fs';
import readline from "readline";


// for stating puppeteer browser and page
async function startBrowserAndPage(pageURL, allowedResourceTypes = null, useUserDataDir = false) {

    // Set the launch opt
    const launchOptions = {
        headless: false,
        defaultViewport: null
    };

    // Set the userDataDir
    if (useUserDataDir) {
        launchOptions.userDataDir = './data'; // to cache data
    }

    // Start a puppeteer session
    const browser = await puppeteer.launch(launchOptions);

    // Open a new page
    const page = await browser.newPage();

    // Call the function to optimize page load
    if (allowedResourceTypes) {
        await optimizePageLoad(page, allowedResourceTypes);
    }

    // Navigate to the signIn page
    // , { waitUntil: "domcontentloaded" }
    await page.goto(pageURL);

    return { browser, page };
}

/*
possible value for allowedResourceTypes
"script" | "image" | "font" | "document" | "stylesheet" | "media" | "texttrack" | "xhr" | 
"fetch" | "prefetch" | "eventsource" | "websocket" | "manifest" | "signedexchange" | 
"ping" | "cspviolationreport" | "preflight" | "other"
*/

// for optimizing load of page
async function optimizePageLoad(page, allowedResourceTypes) {

    await page.setRequestInterception(true);

    page.on('request', async (request) => {
        if (allowedResourceTypes.includes(request.resourceType())) {
            request.continue();
        } else {
            request.abort();
        }
    });
}

/*
async function optimizePageLoad({ page }) {

    // allowedTypes
    const allowedResourceTypes = ['document', 'script', "xhr"];

    await page.setRequestInterception(true);

    page.on('request', async (request) => {
        if (allowedResourceTypes.includes(request.resourceType())) {
            request.continue();
        } else {
            request.abort();
        }
    });
}
*/

// save output to json file
function saveToJson(data, filePath) {
    const jsonData = JSON.stringify(data, null, 4);
    fs.writeFileSync(filePath, jsonData, "utf8");
    console.log("all items have been successfully saved in", filePath, "file");
}

const getUserInput = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Enter the text: ', (text) => {
            rl.close();
            resolve(text);
        });
    });
};

function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

// name export multiple var and function and should when import use the same name
export { startBrowserAndPage, optimizePageLoad, saveToJson, getUserInput, wait };
