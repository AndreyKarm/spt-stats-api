function log(message, type = 'info') {
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    console.log(`[${hours}:${minutes}:${seconds}] [${type}] ${message}`);
}

module.exports = {
    log
};