const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'PASSWORD', // Fill in your password
    database: 'matchdb',
    timezone: 'Z'
}).promise();

module.exports = connection;
