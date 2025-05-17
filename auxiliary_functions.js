const fs = require('fs');

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadDataByLines(path) {
    try {
        const data = fs.readFileSync(path, 'utf8');
        const lines = data.split(/\r?\n/);
        return lines;
    } catch (err) {
        console.error('Loading of file ', path, ' failed:', err);
        return [];
    }
}

function randomOne(list) {
    i = randomNumber(0, list.length);
    return list[i];
}

module.exports = {
    randomNumber,
    loadDataByLines,
    randomOne
};