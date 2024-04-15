const puppeteer = require("puppeteer-core")
const webdriver = require('selenium-webdriver');
const { By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromium = require('chromium');

async function main (event, context) {
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

    await browser.get("https://spotifymate.com/")
    await browser.findElement(webdriver.By.id("url")).sendKeys("https://open.spotify.com/track/1w9L6dvttZalWd8XqFYvSa?si=1bb8cc8c4387467a")
    await browser.findElement(webdriver.By.id("send")).click()
    const element = await browser.wait(until.elementLocated(By.xpath("//div[@class='abuttons']/a")), 10000);
    return element.getAttribute("href").then((downloadHref) => {
        browser.quit();
        return downloadHref
    })
}