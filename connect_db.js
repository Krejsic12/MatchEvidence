const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'matchdb'
});

connection.connect(err => {
    if (err) {
        console.error('Connecting failed:', err);
    } else {
        console.log('Connected');
    }
});

module.exports = connection;
