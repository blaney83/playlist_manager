DROP DATABASE IF EXISTS playlist_db;

CREATE DATABASE playlist_db;

USE playlist_db;

CREATE TABLE songs (
	id INTEGER(2) NOT NULL AUTO_INCREMENT,
    title VARCHAR(20) NOT NULL,
	artist VARCHAR(20),
	genre VARCHAR(20),
    PRIMARY KEY (id)
);

INSERT INTO songs (title, artist, genre) VALUES ("Kryptonite", "Three Doors Down", "Rock");
INSERT INTO songs (title, artist, genre) VALUES ("Lose Yourself", "Eminem", "Rap");
INSERT INTO songs (title, artist, genre) VALUES ("Thriller", "Michael Jackson", "Pop");
INSERT INTO songs (title, artist, genre) VALUES ("Can I", "Galimatias", "Chillwave");
INSERT INTO songs (title, artist, genre) VALUES ("Come & Go", "Aer", "Rap");
INSERT INTO songs (title, artist, genre) VALUES ("Kings of Summer", "Quinn XCII", "Chillwave");
INSERT INTO songs (title, artist, genre) VALUES ("Ain't No Sunshine", "Bill Withers", "Jazz");
INSERT INTO songs (title, artist, genre) VALUES ("I Like It", "Cardi B", "Rap");
INSERT INTO songs (title, artist, genre) VALUES ("Yes Indeed", "Lil Baby", "Rap");
INSERT INTO songs (title, artist, genre) VALUES ("The House of the Rising Sun", "The Animals", "Rock");

SELECT * FROM songs;

SELECT * FROM songs WHERE genre = "Rap";

SELECT artist, genre FROM songs WHERE title = "Lose Yourself";