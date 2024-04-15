const puppeteer = require("puppeteer-core")
const webdriver = require('selenium-webdriver');
const { By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromium = require('chromium');

async function scrapeAndUpdateRoomData(roomData, urlId, spotifyUrl) {
    let browser;
    try {
        browser = await puppeteer.launch({ executablePath: chromium.path });
        const page = await browser.newPage();

        await page.goto("https://spotifymate.com/");
        // Update the 'url' field with Spotify URL from the JSON
        await page.type("#url", spotifyUrl);

        await page.click("#send");
        await page.waitForSelector(".abuttons a");
        const downloadHref = await page.$eval(".abuttons a", element => element.getAttribute("href"));

        // Update 'downloadHref' in the JSON content
        roomData.designed = roomData.designed || {};
        roomData.designed[urlId] = downloadHref;

        // Close browser and return downloadHref
        return downloadHref;
    } catch (err) {
        console.error('Error during web scraping:', err.message);
    } finally {
        if (browser) {
            await browser.close();
        }
        const index = roomData.processing.indexOf(urlId);
        if (index > -1) {
            roomData.processing.splice(index, 1);
        }
    }
}

module.exports = { scrapeAndUpdateRoomData };
