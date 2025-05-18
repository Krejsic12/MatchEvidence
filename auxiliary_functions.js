const fs = require('fs');

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomMinOf3(min, max) {
    numbers = [];
    for (i = 0; i < 3; i++)
        numbers.push(randomNumber(min, max));
    return Math.min(...numbers);
}

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

function randomOne(list) {
    i = randomNumber(0, list.length - 1);
    return list[i];
}

function randomFormatedDate(start = new Date(2000, 0, 1), end = new Date()) {
    time = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    formatedDate = new Date(time).toISOString().slice(0, 10);
    return formatedDate;
}

async function printMatch(db, matchID) {
    [[match]] = await db.query('SELECT * FROM matches WHERE id_match = (?)', [matchID]);
    date = match.date.toISOString().slice(0, 10);
    [[home]] = await db.query('SELECT * FROM teams WHERE id_team = (?)', [match.id_home_team]);
    homeTeam = home.name;
    [[away]] = await db.query('SELECT * FROM teams WHERE id_team = (?)', [match.id_away_team]);
    awayTeam = away.name;

    [events] = await db.query('SELECT * FROM events WHERE id_match = (?)', [matchID]);

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

    console.log(
        "id: ", matchID, ", date: ", date, ", league:", match.league, 
        ", teams: ", homeTeam, " vs ", awayTeam, ", score:", homeGoals, ":", awayGoals
    );

    return events;
}

async function printEvent(db, e) {
    [goal] = await db.query('SELECT * FROM goal WHERE id_event = (?)', [e.id_event]);
    [card] = await db.query('SELECT * FROM card WHERE id_event = (?)', [e.id_event]);
    if (goal.length) {
        assistence = (goal[0].assisted_by) ? 
            ("assisted by: " + goal[0].assisted_by) : 
            ("without assistence");
        console.log(
            "   ", e.time, "\': ", e.side, " Goal scored by ", e.player_name,
            ", type: ", goal[0].type, ", ", assistence
        );
    }
    else {
        console.log(
            "   ", e.time, "\': ", e.side, " Player ", e.player_name,
            " received ", card[0].colour, " card for ", card[0].foul
        );
    }
}

async function summarizeMatch(db, matchID) {
    events = await printMatch(db, matchID);

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