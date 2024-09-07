const fs = require('fs');
exports.handler = async (event, context) => {
    const mission = JSON.parse(event.body);
    try {
        await fs.promises.appendFile('/tmp/missionlist.txt', JSON.stringify(mission) + '\n');
        return {
            statusCode: 200,
            body: 'Mission added successfully'
        };
    } catch (err) {
        console.error('Error writing to file:', err);
        return {
            statusCode: 500,
            body: 'Error saving mission'
        };
    }
};