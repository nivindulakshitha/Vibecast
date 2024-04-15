// main.js

const { getRoomData, updateRoomData } = require('./github.js');
const { scrapeAndUpdateRoomData } = require('./scrape.js');

async function isValidSpotifyUrl(url) {
    // Regular expression to match the Spotify track URL format
    const spotifyUrlPattern = /^https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+$/;

    // Test if the URL matches the pattern
    return spotifyUrlPattern.test(url);
}

// Example usage:
const url = "https://open.spotify.com/track/1w9L6dvttZalWd8XqFYvSa?si=ced0b683989d48ad";
console.log(isValidSpotifyUrl(url)); // Output: true

const invalidUrl = "https://open.spotify.com/album/12345";
console.log(isValidSpotifyUrl(invalidUrl)); // Output: false


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

                if (!await isValidSpotifyUrl(spotifyUrl)) {
                    // Remove the invalid 'waiting' object from roomData
                    delete roomData.waiting[id];
                    await updateRoomData(owner, repo, filePath, `Removed invalid URL for id ${id}`, roomData, responseSha);
                    console.error(`Invalid Spotify URL for id ${id}: ${spotifyUrl}`);
                    return;
                }

                // Check if 'id' already exists in 'designed' object
                if (roomData.designed[id]) {
                    console.error(`ID ${id} already exists in the 'designed' object.`);
                } else {
                    if (roomData.processing.includes(id)) {
                        continue;
                    }

                    // Add id to 'processing' array in roomData
                    roomData.processing.push(id);

                    const status = await scrapeAndUpdateRoomData(roomData, id, spotifyUrl);

                    // Write updated JSON content back to GitHub repository
                    await updateRoomData(owner, repo, filePath, 'Update room.json', roomData, responseSha);

                    const index = roomData.processing.indexOf(id);
                    if (index > -1) {
                        roomData.processing.splice(index, 1);
                    }

                    if (status === false) {
                        // Remove id from 'processing' array in roomData
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
