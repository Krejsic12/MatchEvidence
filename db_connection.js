const mysql = require('mysql2');

function connect() {
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

    return connection;
}

function disconnect(connection) {
    connection.end((err) => {
        if (err) console.log("Disconnecting failed: ", err);
        else console.log("Disconnected");
    });
}

module.exports = {
    connect,
    disconnect
};
