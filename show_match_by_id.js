const af = require('./auxiliary_functions');
const db = require('./db_connection');

async function main() {
    if (process.argv.length < 3)
        console.error("Match id missing!");
    else {
        // Get parameter from command line
        matchID = parseInt(process.argv[2]);

        if (isNaN(matchID))
            console.error("Must be a number!");
        else {

            // Connect to DB
            db.connect();

            // Print match
            await af.summarizeMatch(db, matchID);
        }
    }

    // Diconnect DB
    db.end();
}

main();