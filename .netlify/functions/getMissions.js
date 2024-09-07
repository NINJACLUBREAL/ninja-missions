const fs = require('fs');

exports.handler = async (event, context) => {
    try {
        const data = await fs.promises.readFile('/tmp/missionlist.txt', 'utf8');
        const missions = data.split('\n').filter(line => line).map(JSON.parse);
        return {
            statusCode: 200,
            body: JSON.stringify(missions)
        };
    } catch (err) {
        console.error('Error reading file:', err);
        return {
            statusCode: 500,
            body: 'Error loading missions'
        };
    }
};
