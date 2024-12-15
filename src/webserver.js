const express = require('express');
const app = express();
require('dotenv').config();
const cron = require('node-cron');
const fs = require('fs');
const chalk = require('chalk');
const ip = require('ip');
const cors = require('cors'); // You already have this in package.json

const Debug = require('./helper/log.js');

app.use(cors());
app.use(express.json());

const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};

const db = require('./db.js');
const spt = require('./spt.js');

cron.schedule('0 * * * *', async () => {
    saveStats();
});

async function saveStats() {
    try {
        const timeStart = new Date();
        Debug.log(chalk.green('Running cron job at ' + timeStart));
        
        const fileContent = fs.readFileSync('./list.json', 'utf8');
        const jsonData = JSON.parse(fileContent);
        
        if (!jsonData.ids || !Array.isArray(jsonData.ids)) {
            throw new Error('Invalid JSON structure - ids array required');
        }

        for (const id of jsonData.ids) {
            try {
                Debug.log(chalk.magenta('Processing id:', id));
                const data = await spt.requestData(id);
                Debug.log(chalk.magenta('Received data for id:', id));
                if (!data || !data.data) {
                    throw new Error(`Invalid response data for id: ${id}`);
                }
                await db.addData(data);
                Debug.log(chalk.magenta('Successfully saved data for id:', id));
            } catch (err) {
                console.error(`Failed to process id ${id}:`, err.message);
            }
        }
        Debug.log(chalk.green(`Cron job completed successfully, time taken: ${new Date() - timeStart}ms`));
    } catch (err) {
        console.error('Fatal error in cron job:', err.message);
    }
}

app.post('/data', (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send('Request body is required');
        }
        const { stat, startDate, endDate } = req.body;
        if (!stat) {
            return res.status(400).send('stat parameter is required');
        }
        db.getData(req.body)
            .then(data => {
                console.log('Data:', data);
                res.json(data);
            })
            .catch(err => {
                console.error('Error in /data:', err);
                res.status(500).send('Internal server error');
            });
    } catch (err) {
        console.error('Error processing request:', err);
        res.status(500).send('Internal server error');
    }
});

https.createServer(sslOptions, app).listen(process.env.WEBSERVER_PORT, () => {
    Debug.log(chalk.yellow(`HTTPS Server running on ${ip.address()}:${process.env.WEBSERVER_PORT}`));
});

spt.ping()
    .then(result => Debug.log(chalk.gray('SPT is online'))
    )
    .catch(error => console.error('Ping failed:', error));