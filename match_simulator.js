const af = require('./auxiliary_functions');
const db = require('./db_connection');

// Connect to DB
matchDB = db.connect();

// Load example data
teams = af.loadDataByLines("./assets/premier_league_teams.txt");
players = af.loadDataByLines("./assets/premier_league_players.txt");
leagues = af.loadDataByLines("./assets/leagues.txt");
goalTypes = af.loadDataByLines("./assets/goal_types.txt");
fouls = af.loadDataByLines("./assets/fouls.txt");
sides = ["home", "away"];
cardColour = ["yellow", "red"];

// todo - Randomised match

// example

console.log(af.chooseOne(teams));

for (i = 0; i < 10; i++)
    console.log(af.randomNumber(0, 1));

team = "FBC Zraloci Pribram";

matchDB.query(
    'INSERT INTO teams (name) VALUES (?)',
    [team],
    (err, result) => {
        if (err) console.log("Insert failed: ", err);
        else console.log("Inserted: ", result.insertId, ", ", team);
    }
);

matchDB.query('SELECT * FROM teams', (err, results) => {
    if (err) console.log("Select failed: ", err);
    else console.log("Selected: ", results);
});

// Diconnect DB
db.disconnect(matchDB);