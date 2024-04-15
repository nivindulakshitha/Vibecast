const axios = require('axios');

let accessToken;

async function initializeAccessToken() {
    // Initialize access token here
    accessToken = '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';
}

async function getRoomData(owner, repo, filePath) {
    try {
        await initializeAccessToken(); // Initialize access token if not already initialized
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
            headers: {
                Authorization: `token ${accessToken}`
            }
        });

        const content = Buffer.from(response.data.content, 'base64').toString();
        const roomData = JSON.parse(content);
        const responseSha = response.data.sha;
        return { roomData, responseSha };
    } catch (err) {
        console.error('Error retrieving room.json from GitHub:', err);
        throw err;
    }
}

async function updateRoomData(owner, repo, filePath, message, content, sha) {
    try {
        await initializeAccessToken(); // Initialize access token if not already initialized
        await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
            message,
            content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
            sha
        }, {
            headers: {
                Authorization: `token ${accessToken}`
            }
        });
    } catch (err) {
        console.error('Error updating room.json on GitHub:', err);
        throw err;
    }
}

module.exports = { getRoomData, updateRoomData };
