const puppeteer = require("puppeteer-core");
const webdriver = require('selenium-webdriver');
const { By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromium = require('chromium');
const axios = require('axios'); // Import axios for HTTP requests

async function main(event, context) {
    // Your GitHub repository details
    const owner = 'nivindulakshitha';
    const repo = 'Vibecast';
    const filePath = 'room.json';

    let options = new chrome.Options();
    options.setChromeBinaryPath(chromium.path);
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1280,960');

    const browser = await new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    let roomData; // Variable to hold room data

    try {
        // Retrieve room data from GitHub repository
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`);
        const content = Buffer.from(response.data.content, 'base64').toString();
        roomData = JSON.parse(content);
    } catch (err) {
        console.error('Error retrieving room.json from GitHub:', err);
        return;
    }

    // Check if 'url' field exists in 'waiting' object
    if (roomData.waiting && roomData.waiting.id && roomData.waiting.id.url) {
        const spotifyUrl = roomData.waiting.id.url;
        console.log("Spotify URL:", spotifyUrl);

        await browser.get("https://spotifymate.com/");
        // Update the 'url' field with Spotify URL from the JSON
        await browser.findElement(webdriver.By.id("url")).sendKeys(spotifyUrl);

        await browser.findElement(webdriver.By.id("send")).click();
        const element = await browser.wait(until.elementLocated(By.xpath("//div[@class='abuttons']/a")), 10000);
        const downloadHref = await element.getAttribute("href");

        // Update 'downloadHref' in the JSON content
        roomData.designed = roomData.designed || {};
        roomData.designed.id = roomData.designed.id || {};
        roomData.designed.id.url = downloadHref;

        try {
            // Write updated JSON content back to GitHub repository
            await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
                message: 'Update room.json',
                content: Buffer.from(JSON.stringify(roomData, null, 2)).toString('base64'),
                sha: response.data.sha
            });
        } catch (err) {
            console.error('Error updating room.json on GitHub:', err);
        }

        browser.quit();
        return downloadHref;
    } else {
        console.error("URL not found in room data.");
        browser.quit();
        return;
    }
}

main();
