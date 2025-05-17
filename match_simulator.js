const af = require('./auxiliary_functions');
const db = require('./db_connection');

async function main() {
    // Connect to DB
    db.connect();

    // Load example data
    players = af.loadDataByLines("./assets/premier_league_players.txt");
    leagues = af.loadDataByLines("./assets/leagues.txt");
    goalTypes = af.loadDataByLines("./assets/goal_types.txt");
    fouls = af.loadDataByLines("./assets/fouls.txt");
    sides = ["home", "away"];
    cardColours = ["yellow", "red"];

    // Insert teams if no inserted yet
    [result] = await db.query('SELECT COUNT(*) FROM teams');
    teamsCount = result[0]['COUNT(*)'];

    if (teamsCount == 0) {
        teams = af.loadDataByLines("./assets/premier_league_teams.txt");

        for (team of teams) {
            await db.query('INSERT INTO teams (name) VALUES (?)', [team]);
        }
    }

    // todo - Insert new match
    // random teams and league
    matchID = 0;

    // todo - Randomised match
    goals = 0;
    yellowCards = 0;
    redCards = 0;
    time = 1;

    while (goals < 3 || yellowCards < 1 || redCards < 1 || time < 75) {
        time = af.randomNumber(time, 90);

        //debug
        break;

        // todo - goal or foul
    }

    // examples

    console.log(af.randomOne(players));

    for (i = 0; i < 10; i++)
        console.log(af.randomNumber(0, 1));

    [results] = await db.query('SELECT * FROM teams');
    console.log(results);

    // Diconnect DB
    db.end();
}

main();