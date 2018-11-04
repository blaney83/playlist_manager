
const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'playlist_db'
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("Connection successful!");
    interactiveQuery();
})

function interactiveQuery() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do with the music database: ",
                choices: ["Show All Songs", "Add Song", "Search Database", "Update Song", "Delete Song", "Exit Database"],
                name: "DataBase_Functions"
            }
        ]).then(function (resp) {
            let userChoice = resp.DataBase_Functions
            switch (userChoice) {
                case ("Show All Songs"):
                    showAllSongs();
                    break;
                case ("Add Song"):
                    addSong();
                    break;
                case ("Search Database"):
                    searchDatabase();
                    break;
                case ("Update Song"):
                    updateSong();
                    break;
                case ("Delete Song"):
                    deleteSong();
                    break;
                case ("Exit Database"):
                    connection.end();
                    break;
            }
        })
}

function showAllSongs() {
    connection.query('SELECT * FROM songs', function (err, data) {
        if (err) throw err;
        let dataArr = data;
        dataArr.forEach((arr) => {
            console.log("\nTitle: " + arr.title + "\nArtist: " + arr.artist + "\nGenre: " + arr.genre)
        });
        setTimeout(interactiveQuery, 2000);
    })
}


function addSong() {
    inquirer
        .prompt([
            {
                type: "input",
                question: "What is the song name?",
                name: "songName"
            },
            {
                type: "input",
                question: "What is the artist name?",
                name: "songArtist"
            },
            {
                type: "input",
                question: "What is the song genre?",
                name: "songGenre"
            }
        ]).then(function (resp) {
            let sName = resp.songName.trim();
            let sArt = resp.songArtist.trim();
            let sGen = resp.songGenre.trim();
            connection.query("INSERT INTO songs SET ?", {
                title: sName,
                artist: sArt,
                genre: sGen,
            }, function (err, resp) {
                if (err) throw err;
                console.log("Insertion Successful!");
                showAllSongs();
            })
        })
}

function searchDatabase() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would category would you like to search by: ",
                choices: ["Title", "Artist", "Genre", "Song ID"],
                name: "searchField"
            }
        ]).then(function (resp) {
            switch (resp.searchField) {
                case ("Title"):
                    generalQuery("title")
                    break;
                case ("Artist"):
                    generalQuery("artist")
                    break;
                case ("Genre"):
                    generalQuery("genre")
                    break;
                case ("Song ID"):
                    generalQuery("id")
                    break;
            }
        })
}

function generalQuery(colName) {
    inquirer
        .prompt([
            {
                type: "input",
                question: "What" + colName + "would you like to search for?",
                name: "genQuer",
            }
        ]).then(function (resp) {
            connection.query('SELECT * FROM songs WHERE ' + colName + ' = "' + resp.genQuer + '"', function (err, data) {
                let dataArr = data;
                if (err) {
                    console.log("There was a problem with your search. It may be because our database does not contain any matches for your search. Try again!");
                    setTimeout(generalQuery, 2000)
                } else {
                    dataArr.forEach((arr) => {
                        console.log("\nTitle: " + arr.title + "\nArtist: " + arr.artist + "\nGenre: " + arr.genre)
                    });
                    setTimeout(interactiveQuery, 2000);
                }
            });
        });
}

function updateSong() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What catagory would you like to update: ",
                choices: ["Title", "Artist", "Genre"],
                name: "colChange"
            },
        ]).then(function (resp) {
            switch (resp.colChange) {
                case ("Title"):
                    generalChange("title")
                    break;
                case ("Artist"):
                    generalChange("artist")
                    break;
                case ("Genre"):
                    generalChange("genre")
                    break;
            }
        })
}

function generalChange(colName) {
    inquirer
        .prompt([
            {
                type: "input",
                message: "For which song would you like to change the " + colName + "?",
                name: "genQuer",
            }
        ]).then(function (resp) {
            connection.query('SELECT * FROM songs WHERE title = "' + resp.genQuer + '"', function (err, data) {
                let dataArr = data;
                if (err) {
                    console.log("There was a problem with your search. It may be because our database does not contain any matches for your search. Try again!");
                    setTimeout(generalChange, 2000)
                } else {
                    dataArr.forEach((arr) => {
                        console.log("Here is the current data for that song: ");
                        console.log("\nTitle: " + arr.title + "\nArtist: " + arr.artist + "\nGenre: " + arr.genre)
                    });
                    changeData(colName, resp.genQuer);
                }
            });
        });
}

function changeData(colName, song) {
    inquirer
        .prompt([
            {
                type: "input",
                message: "\nNow, what would you like to change the " + colName + " to?",
                name: "newData"
            }
        ]).then(function (resp) {
            switch (colName) {
                case ("title"):
                    console.log(resp.newData)
                    connection.query("UPDATE songs SET ? WHERE ?", [{ title: resp.newData }, { title: song }], function (err, resp) {
                        console.log("Song Title Changed Successfully!")
                        setTimeout(interactiveQuery, 2000);
                    })
                    break;
                case ("artist"):
                    connection.query("UPDATE songs SET ? WHERE ?", [{ artist: resp.newData }, { title: song }], function (err, resp) {
                        connection.query('SELECT * FROM songs WHERE title = "' + song + '"', function (err, data) {
                            let dataArr = data;
                            if (err) {
                                console.log("There was a problem with your search. It may be because our database does not contain any matches for your search. Try again!");
                                setTimeout(changeData, 2000)
                            } else {
                                dataArr.forEach((arr) => {
                                    console.log("Here is the updated data for that song: ");
                                    console.log("\nTitle: " + arr.title + "\nArtist: " + arr.artist + "\nGenre: " + arr.genre + "\n")
                                });
                                setTimeout(interactiveQuery, 2000);
                            }
                        });
                    })
                    break;
                case ("genre"):
                    connection.query("UPDATE songs SET ? WHERE ?", [{ genre: resp.newData }, { title: song }], function (err, resp) {
                        connection.query('SELECT * FROM songs WHERE title = "' + song + '"', function (err, data) {
                            let dataArr = data;
                            if (err) {
                                console.log("There was a problem with your search. It may be because our database does not contain any matches for your search. Try again!");
                                setTimeout(changeData, 2000)
                            } else {
                                dataArr.forEach((arr) => {
                                    console.log("Here is the updated data for that song: ");
                                    console.log("\nTitle: " + arr.title + "\nArtist: " + arr.artist + "\nGenre: " + arr.genre + "\n")
                                });
                                setTimeout(interactiveQuery, 2000);
                            }
                        });
                    })
                    break;
            }
        })
}

function deleteSong() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Which song would you like to remove from the database?",
                name: "title"
            }
        ]).then(function (resp) {
            connection.query("DELETE FROM songs WHERE ?", {
                title: resp.title
            }, function (err, resp) {
                if (err) {
                    console.log("An error occured while deleting that song. Please try again or consider adding songs instead.");
                    deleteSong()
                } else {
                    console.log("Song successfully removed!");
                    setTimeout(interactiveQuery, 1000);
                }
            })
        })
}