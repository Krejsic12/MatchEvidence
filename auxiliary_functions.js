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

function randomFormatedDate(start = new Date(2000, 0, 1), end = new Date()) {
    time = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    formatedDate = new Date(time).toISOString().slice(0, 10);
    return formatedDate;
}

module.exports = {
    randomNumber,
    loadDataByLines,
    randomOne,
    randomFormatedDate
};