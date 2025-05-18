const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'matchdb',
    timezone: 'Z'
}).promise();

module.exports = connection;
