const af = require('./auxiliary_functions');
const db = require('./db_connection');

async function main() {
    // Connect to DB
    db.connect();

    // Select matches
    [matches] = await db.query('SELECT * FROM matches');

    // Print each result
    for (match of matches)
        await af.printMatch(db, match.id_match);

    // Diconnect DB
    db.end();
}

main();