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
    sides = ["Home", "Away"];
    cardColours = ["Yellow", "Red"];

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

    // Randomised match - generating of random events until all conditions are met
    goals = 0;
    yellowCards = 0;
    redCards = 0;
    time = 1;

    while (goals < 3 || yellowCards < 1 || redCards < 1 || time < 75) {
        time = af.randomMinOf3(time, 90);

        // Insert new event
        side = af.randomOne(sides);
        player = af.randomOne(players);
        [result] = await db.query(
            'INSERT INTO events (id_match, time, side, player_name) VALUES (?, ?, ?, ?)', 
            [matchID, time, side, player]
        );
        eventID = result.insertId;

        // 60% probability for a goal, 40% for a card
        if (Math.random() < 0.6) {
            // Goal
            type = af.randomOne(goalTypes);

            if (type === "Penalty kick" || Math.random() < 0.2) {
                // Without assistence
                await db.query(
                    'INSERT INTO goal (id_event, type) VALUES (?, ?)', 
                    [eventID, type]
                );
            }
            else {
                // With
                assistence = af.randomOne(players);
                await db.query(
                    'INSERT INTO goal (id_event, type, assisted_by) VALUES (?, ?, ?)', 
                    [eventID, type, assistence]
                );
            }

            goals++;
        }
        else {
            // Card
            colour = af.randomOne(cardColours);
            foul = af.randomOne(fouls);
            await db.query(
                'INSERT INTO card (id_event, colour, foul) VALUES (?, ?, ?)', 
                [eventID, colour, foul]
            );

            if (colour === "Yellow")
                yellowCards++;
            else
                redCards++;
        }
    }

    await af.summarizeMatch(db, matchID);

    // Diconnect DB
    db.end();
}

main();