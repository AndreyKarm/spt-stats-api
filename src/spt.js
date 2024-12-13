const pako = require('pako');
require('dotenv').config();
const chalk = require('chalk');
const Debug = require('./helper/log.js');

const ip = process.env.SPT_IP;
const port = process.env.SPT_PORT;
const endpoint = '/client/profile/view';

async function requestData(sessionId, maxRetries = 3, initialDelay = 1000) {
    Debug.log(chalk.magenta('Requesting data from SPT'));
    let headers = {
        "Content-Type": "application/json",
        "Accept-Encoding": "deflate",
        "Cookie": `session=${sessionId}; PHPSESSID=${sessionId}`,
    };

    let attempt = 0;
    let lastError;

    while (attempt < maxRetries) {
        try {
            const response = await fetch(`http://${ip}:${port}${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: pako.deflate(JSON.stringify({}), { to: 'string' }),
            });
            const buffer = await response.arrayBuffer();
            const decompressed = pako.inflate(new Uint8Array(buffer));
            const strData = new TextDecoder().decode(decompressed);
            if (strData.includes('FAILED')) {
                throw new Error('Request failed');
            }
            const data = JSON.parse(strData);
            return data;
        } catch (err) {
            lastError = err;
            attempt++;
            if (attempt === maxRetries) {
                console.error(`Failed after ${maxRetries} attempts:`, err);
                throw lastError;
            }
            const delay = initialDelay * Math.pow(2, attempt - 1);
            Debug.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

async function ping() {
    const response = await fetch(`http://${ip}:${port}/launcher/ping`, {
        method: 'POST',
        body: pako.deflate(JSON.stringify({}), { to: 'string' }),
    });
    const buffer = await response.arrayBuffer();
    const decompressed = pako.inflate(new Uint8Array(buffer));
    const strData = new TextDecoder().decode(decompressed);
    if (strData.includes('FAILED')) {
        throw new Error('Request failed');
    }
    const data = JSON.parse(strData);
    if (data == "pong!") {
        return;
    }
    throw new Error('Ping failed');
}

// Debug.log('requestData:', requestData("674b46c90001f7d99e7a0741"));

module.exports = { requestData, ping };