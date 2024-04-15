// main.js

const { getRoomData, updateRoomData } = require('./github.js');
const { scrapeAndUpdateRoomData } = require('./scrape.js');


async function main() {
    const owner = 'nivindulakshitha';
    const repo = 'Vibecast';
    const filePath = 'room.json';

    try {
        // Retrieve room data from GitHub repository
        const { roomData, responseSha } = await getRoomData(owner, repo, filePath);

        // Check if 'url' field exists in 'waiting' object
        for (let id in roomData.waiting) {
            const spotifyUrl = roomData.waiting[id];
            if (spotifyUrl) {
                // Perform web scraping and update roomData
                const downloadHref = await scrapeAndUpdateRoomData(roomData, spotifyUrl);

                // Write updated JSON content back to GitHub repository
                await updateRoomData(owner, repo, filePath, 'Update room.json', roomData, responseSha);

                return downloadHref;
            } else {
                console.error("URL not found in room data to be processed.");
                return;
            }
        }
    } catch (err) {
        console.error('An error occurred:', err);
    }
}

setInterval(main, 60000);
