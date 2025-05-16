CREATE DATABASE IF NOT EXISTS matchdb;

USE matchdb;

-- Remove conflicting tables
DROP TABLE IF EXISTS card CASCADE;
DROP TABLE IF EXISTS goal CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
-- End of removing

CREATE TABLE events (
    id_event INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_match INTEGER NOT NULL,
    time INTEGER NOT NULL,
    side VARCHAR(16) NOT NULL,
    player_name VARCHAR(256) NOT NULL
);

CREATE TABLE card (
    id_event INTEGER PRIMARY KEY,
    colour VARCHAR(256) NOT NULL
);

CREATE TABLE goal (
    id_event INTEGER PRIMARY KEY,
    type VARCHAR(32) NOT NULL,
    assisted_by VARCHAR(256) NOT NULL
);

CREATE TABLE matches (
    id_match INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_home_team INTEGER NOT NULL,
    id_away_team INTEGER NOT NULL,
    date DATE NOT NULL,
    league VARCHAR(256)
);

CREATE TABLE teams (
    id_team INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(256) NOT NULL
);

ALTER TABLE events ADD CONSTRAINT fk_events_matches FOREIGN KEY (id_match) REFERENCES matches (id_match) ON DELETE CASCADE;

ALTER TABLE card ADD CONSTRAINT fk_card_events FOREIGN KEY (id_event) REFERENCES events (id_event) ON DELETE CASCADE;

ALTER TABLE goal ADD CONSTRAINT fk_goal_events FOREIGN KEY (id_event) REFERENCES events (id_event) ON DELETE CASCADE;

ALTER TABLE matches ADD CONSTRAINT fk_matches_home_team FOREIGN KEY (id_home_team) REFERENCES teams (id_team) ON DELETE CASCADE;
ALTER TABLE matches ADD CONSTRAINT fk_matches_away_team FOREIGN KEY (id_away_team) REFERENCES teams (id_team) ON DELETE CASCADE;

ALTER TABLE matches ADD CONSTRAINT chk_matches_teams CHECK (id_home_team != id_away_team);