const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const chalk = require('chalk');
const cron = require('node-cron');
const ip = require('ip');
require('dotenv').config();

const Debug = require('./helper/log.js');
const db = require('./db.js');
const spt = require('./spt.js');

const app = express();

// SSL options
const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};

// Global middleware
app.use(cors({
    origin: 'https://spt.liotom.me', // Replace with your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true, // Allow cookies if needed
}));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Cron job setup
cron.schedule('0 * * * *', async () => {
    await saveStats();
});

// Function to save stats (for the cron job)
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

// Root endpoint
app.get('/', (req, res) => {
    res.send('Hello World');
});

// POST /data endpoint
app.post('/data', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send('Request body is required');
        }

        const { stat, startDate, endDate } = req.body;

        if (!stat) {
            return res.status(400).send('stat parameter is required');
        }

        const data = await db.getData(req.body);
        res.json(data);
    } catch (err) {
        console.error('Error processing request:', err);
        res.status(500).send('Internal server error');
    }
});

// Explicitly handle preflight (OPTIONS) requests
app.options('/data', cors());

// Start HTTPS server
https.createServer(sslOptions, app).listen(process.env.WEBSERVER_PORT, () => {
    Debug.log(chalk.yellow(`HTTPS Server running on ${ip.address()}:${process.env.WEBSERVER_PORT}`));
});

// Test connection to SPT
spt.ping()
    .then(() => Debug.log(chalk.gray('SPT is online')))
    .catch(error => console.error('Ping failed:', error));