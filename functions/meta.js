const Chromium = require("chrome-aws-lambda")
const puppeteer = require("puppeteer-core")

exports.handler = async function (req, res) {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
        ]
    })

    const page = await browser.newPage()
    await page.goto("https://spotifymate.com/")

    await page.focus("#url")
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
    }))

    browser.close()
}