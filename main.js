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

                // Check if 'id' already exists in 'designed' object
                if (roomData.designed[id]) {
                    console.error(`ID ${id} already exists in the 'designed' object.`);
                } else {
                    const status = await scrapeAndUpdateRoomData(roomData, id, spotifyUrl);

                    // Write updated JSON content back to GitHub repository
                    await updateRoomData(owner, repo, filePath, 'Update room.json', roomData, responseSha);

                    if (status === false) {
                        console.error(`Error processing id ${id}`);
                        return;
                    }

                }

                // Add id to 'processing' object in ro
               
                // Remove the processed 'waiting' object from roomData
                delete roomData.waiting[id];

                // Write updated JSON content back to GitHub repository
                await updateRoomData(owner, repo, filePath, `Procee complete for id ${id}`, roomData, responseSha);

                
            } else {
                console.error("URL not found in room data to be processed.");
                return;
            }
        }
    } catch (err) {
        console.error('An error occurred:', err);
    }
}

setInterval(main, 5000);
