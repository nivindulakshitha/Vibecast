
const puppeteer = require("puppeteer-core")
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromium = require('chromium');
//  require('chromedriver');

exports.handler = async function (req, res) {
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
    await browser.findElement(webdriver.By.xpath("//div[@class='abuttons']/a")).getAttribute("href").then((downloadHref) => {
        console.log(downloadHref);
    });

/*     await page.focus("#url")
    await page.keyboard.type("https://open.spotify.com/track/1w9L6dvttZalWd8XqFYvSa?si=1bb8cc8c4387467a")

    await page.click("#send")
    console.log(await page.title())

    const downloadHref = await page.waitForSelector("div.abuttons > a").then(async () => {
        return await page.evaluate(() => {
            return document.querySelector("div.abuttons > a").getAttribute("href")
        })
    })

    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({
        "version": "1.0.0",
        "author": "John Doe",
        "description": "This is a sample API",
        "title": downloadHref
    })) */

    browser.close()
}

/* const fs = require('fs');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromium = require('chromium');
//require('chromedriver');

async function start() {
    let options = new chrome.Options();
    options.setChromeBinaryPath(chromium.path);
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1280,960');

    const driver = await new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    await driver.get('http://google.com');
    console.log('Hello Google!');
    await takeScreenshot(driver, 'google-start-page');

    await driver.quit();
}

async function takeScreenshot(driver, name) {
    await driver.takeScreenshot().then((data) => {
        fs.writeFileSync(name + '.png', data, 'base64');
        console.log('Screenshot is saved');
    });
}

start(); */