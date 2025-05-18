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

    // Insert new match
    matchID = 0;
    date = af.randomFormatedDate();
    league = af.randomOne(leagues);
    homeTeam = awayTeam = af.randomNumber(1, teamsCount);
    while (homeTeam == awayTeam)
        awayTeam = af.randomNumber(1, teamsCount);
    [result] = await db.query(
        'INSERT INTO matches (id_home_team, id_away_team, date, league) VALUES (?, ?, ?, ?)', 
        [homeTeam, awayTeam, date, league]
    );
    matchID = result.insertId;

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

    [results] = await db.query('SELECT * FROM matches');
    console.log(results);

    // Diconnect DB
    db.end();
}

main();