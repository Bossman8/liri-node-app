require("dotenv").config();

var fs = require('fs');
var inquirer = require("inquirer");
var keys = require("./keys")
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("file-system");


inquirer.prompt([
    {
        type: "list",
        message: "Make a selection",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "choice"
    }
]).then(function (userChoice) {
    if (userChoice.choice === "my-tweets") {
        getTweets();
    } else if (userChoice.choice === "spotify-this-song") {
        getSpotify();
    } else if (userChoice.choice === "movie-this") {
        getMovie();
    } else if (userChoice.choice === "do-what-it-says") {
        doItNow();
    }
})

function getTweets() {
    var client = new Twitter(keys.twitter);

    inquirer.prompt([
        {
            type: "input",
            message: "What is the twitter username?",
            name: "twitterName"
        }
    ]).then(function (twitterAns) {
        var user = twitterAns.twitterName;
        var params = { screen_name: (user) };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                for (i = 0; i < tweets.length; i++) {
                    console.log("------------------------------");
                    console.log(tweets[i].created_at);
                    console.log(tweets[i].text);
                }
            }
            ;  // The favorites.
            // console.log(response);  // Raw response object.
        });
    })
}

function getSpotify() {
    var spotify = new Spotify(keys.spotify)
    inquirer.prompt([
        {
            type: "input",
            message: "What song do you want to search?",
            name: "song"
        }
    ]).then(function (answers) {
        var song = answers.song

        spotify.search({ type: 'track', query: song, limit: 8 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var info = data.tracks.items;

            for (i = 0; i < info.length; i++) {


                console.log("------------------------------")
                console.log("Artist: " + info[i].artists[0].name)
                console.log("Album: " + info[i].album.name)
                console.log("Song Name: " + info[i].name)
                console.log("Preview URL: " + info[i].preview_url)



            }
        });
    })
}

function getMovie() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What movie do you want informantion on?"
        },

    ]).then(function (answers) {
        var movieTitle = answers.name;
        request('http://www.omdbapi.com/?apikey=trilogy&t=' + movieTitle, function (error, response, body) {
            if (error) {
                console.log("An error has occurred: " + error);
                console.log('statusCode:', response && response.statusCode);
            }
            var jsonData = JSON.parse(body);
            console.log("------------------------------")
            console.log('Title: ' + jsonData.Title);
            console.log('Release Year: ' + jsonData.Year);
            console.log('IMDB Rating: ' + jsonData.imdbRating);
            console.log('Rotten Tomato Rating: ' + jsonData.Ratings[1].Value);
            console.log('Country of Origin: ' + jsonData.Country);
            console.log('Movie Language(s): ' + jsonData.Language);
            console.log('Movie Plot: ' + jsonData.Plot);
            console.log("Movie's Actors: " + jsonData.Actors);
        });
    });
}

function doItNow() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }
        console.log(data);
        var dataArr = data.split(",");
        console.log(dataArr);
        if (dataArr[0] === "my-tweets") {
            var client = new Twitter(keys.twitter);
            var user = dataArr[1];
            var params = { screen_name: (user) };
            client.get('statuses/user_timeline', params, function (error, tweets, response) {
                if (!error) {
                    for (i = 0; i < tweets.length; i++) {
                        console.log("------------------------------");
                        console.log(tweets[i].created_at);
                        console.log(tweets[i].text);
                    }
                }  
            });

        } else if (dataArr[0] === "spotify-this-song") {
            var spotify = new Spotify(keys.spotify)
            var song = dataArr[1];
            spotify.search({ type: 'track', query: song, limit: 8 }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                var info = data.tracks.items;

                for (i = 0; i < info.length; i++) {
                    console.log("------------------------------")
                    console.log("Artist: " + info[i].artists[0].name)
                    console.log("Album: " + info[i].album.name)
                    console.log("Song Name: " + info[i].name)
                    console.log("Preview URL: " + info[i].preview_url)
                }
            });

        } else if (dataArr[0] === "movie-this") {

            var movieTitle = dataArr[1];
            request('http://www.omdbapi.com/?apikey=trilogy&t=' + movieTitle, function (error, response, body) {
                if (error) {
                    console.log("An error has occurred: " + error);
                    console.log('statusCode:', response && response.statusCode);
                }
                var jsonData = JSON.parse(body);
                console.log("------------------------------")
                console.log('Title: ' + jsonData.Title);
                console.log('Release Year: ' + jsonData.Year);
                console.log('IMDB Rating: ' + jsonData.imdbRating);
                console.log('Rotten Tomato Rating: ' + jsonData.Ratings[1].Value);
                console.log('Country of Origin: ' + jsonData.Country);
                console.log('Movie Language(s): ' + jsonData.Language);
                console.log('Movie Plot: ' + jsonData.Plot);
                console.log("Movie's Actors: " + jsonData.Actors);
            });

        }

    });
}