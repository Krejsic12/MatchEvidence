const fs = require('fs');

// Returns random integer between min and max including extreme values
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generates 3 random integers and returns minimum of them
function randomMinOf3(min, max) {
    numbers = [];
    for (i = 0; i < 3; i++)
        numbers.push(randomNumber(min, max));
    return Math.min(...numbers);
}

// Loads lines of file to array
function loadDataByLines(path) {
    try {
        const data = fs.readFileSync(path, 'utf8');
        const lines = data.split(/\r?\n/);
        return lines;
    } catch (err) {
        console.error('Loading of file ', path, ' failed:', err);
        return [];
    }
}

// Returns random element of array
function randomOne(list) {
    i = randomNumber(0, list.length - 1);
    return list[i];
}

// Returns random date in format for SQL
function randomFormatedDate(start = new Date(2000, 0, 1), end = new Date()) {
    time = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    formatedDate = new Date(time).toISOString().slice(0, 10);
    return formatedDate;
}

// Prints basic informations about match
async function printMatch(db, matchID) {
    // Find match
    [[match]] = await db.query('SELECT * FROM matches WHERE id_match = (?)', [matchID]);
    date = match.date.toISOString().slice(0, 10);
    // Find participating teams
    [[home]] = await db.query('SELECT * FROM teams WHERE id_team = (?)', [match.id_home_team]);
    homeTeam = home.name;
    [[away]] = await db.query('SELECT * FROM teams WHERE id_team = (?)', [match.id_away_team]);
    awayTeam = away.name;

    // Find all events that occured in match
    [events] = await db.query('SELECT * FROM events WHERE id_match = (?)', [matchID]);

    // Count score of the game
    homeGoals = 0;
    awayGoals = 0;

    for (e of events) {
        [goal] = await db.query('SELECT * FROM goal WHERE id_event = (?)', [e.id_event]);
        if (goal.length) {
            if (e.side === "Home")
                homeGoals++;
            else
                awayGoals++;
        }
    }

    // Print
    console.log(
        "id: ", matchID, ", date: ", date, ", league:", match.league, 
        ", teams: ", homeTeam, " vs ", awayTeam, ", score:", homeGoals, ":", awayGoals
    );

    return events;
}

// Prints event of match
async function printEvent(db, e) {
    // Check if its goal or card
    [goal] = await db.query('SELECT * FROM goal WHERE id_event = (?)', [e.id_event]);
    [card] = await db.query('SELECT * FROM card WHERE id_event = (?)', [e.id_event]);
    if (goal.length) {
        // Print goal
        assistence = (goal[0].assisted_by) ? 
            ("assisted by: " + goal[0].assisted_by) : 
            ("without assistence");
        console.log(
            "   ", e.time, "\': ", e.side, " Goal scored by ", e.player_name,
            ", type: ", goal[0].type, ", ", assistence
        );
    }
    else {
        // Print card
        console.log(
            "   ", e.time, "\': ", e.side, " Player ", e.player_name,
            " received ", card[0].colour, " card for ", card[0].foul
        );
    }
}

// Prints match with all its events
async function summarizeMatch(db, matchID) {
    // Basic info
    events = await printMatch(db, matchID);

    // Events
    for (e of events)
        await printEvent(db, e);
}

module.exports = {
    randomNumber,
    randomMinOf3,
    loadDataByLines,
    randomOne,
    randomFormatedDate,
    printMatch,
    summarizeMatch
};