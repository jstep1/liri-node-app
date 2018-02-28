// Require appropriate API sources, functions and keys
require("dotenv").config();
var fs = require("fs");

var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Reference user input lines

var command = process.argv[2];
var userEntry = process.argv[3];

// Show last 20 tweets and when they were created in the terminal

var showTweets = function() {

    console.log("*****************TWEETS********************");

    var params = {screen_name: 'based_crypto'};

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for(var i = 0; i < 20; i++) {
            console.log("Tweet: " + tweets[i].text + "\n \n" +
            "Created on " + tweets[i].created_at + "\n");
            console.log("----------------");
            }
        }
      })
}

// Show artist, song's name, a preview link from Spotify and the album the song was from in terminal

 var runSpot = function() {

    console.log("*****************SPOTIFY********************");

    if(userEntry !== undefined) {
    spotify.search({ type: 'track', query: userEntry }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        else {
            console.log("Artist(s): " + data.tracks.items[0].artists[0].name + "\n" +
            "Song Name: " + data.tracks.items[0].name + "\n" +
            "Preview: " + data.tracks.items[0].preview_url + "\n" +
            "Album: " + data.tracks.items[0].album.name + "\n"); 
        }     
      })

    }

    // If no user input detected, default to 'The Sign' by Ace of Bass

    else {
        spotify.search({ type: 'track', query: 'The Sign'}, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            else {
            console.log("Artist(s): " + data.tracks.items[5].artists[0].name + "\n" +
            "Song Name: " + data.tracks.items[5].name + "\n" +
            "Preview: " + data.tracks.items[5].preview_url + "\n" +
            "Album: " + data.tracks.items[5].album.name + "\n"); 
            }     
          })
    }
}


// List movie information from OMDB database

var runMov = function () {

    console.log("*****************OMDB********************");

    if(userEntry !== undefined) {
    var request = require('request');
    request('http://www.omdbapi.com/?t=' + userEntry + '&apikey=Trilogy', function (error, response, body) {
    var responseBodyObject = JSON.parse(body);
    console.log('Title: ' + responseBodyObject.Title + '\n'
                + 'Year: ' + responseBodyObject.Year + '\n'
                + 'IMDB Rating: ' + responseBodyObject.Ratings[0].Value + '\n'
                + 'Rotten Tomatoes Rating: ' + responseBodyObject.Ratings[1].Value + '\n'
                + 'Country: ' + responseBodyObject.Country + '\n'
                + 'Language: ' + responseBodyObject.Language + '\n'
                + 'Plot: ' + responseBodyObject.Plot + '\n'
                + 'Actors: ' + responseBodyObject.Actors + '\n');
        })
    }

    else {
    var request = require('request');
    request('http://www.omdbapi.com/?t=Mr.+Nobody&apikey=Trilogy', function (error, response, body) {
    var responseBodyObject = JSON.parse(body);
    console.log('Title: ' + responseBodyObject.Title + '\n'
                + 'Year: ' + responseBodyObject.Year + '\n'
                + 'IMDB Rating: ' + responseBodyObject.Ratings[0].Value + '\n'
                + 'Rotten Tomatoes Rating: ' + responseBodyObject.Ratings[1].Value + '\n'
                + 'Country: ' + responseBodyObject.Country + '\n'
                + 'Language: ' + responseBodyObject.Language + '\n'
                + 'Plot: ' + responseBodyObject.Plot + '\n'
                + 'Actors: ' + responseBodyObject.Actors + '\n');
        })
    }
}


// Run specific function based on user input
var runFunctions = function() {

    if(command === 'my-tweets') {
        showTweets();
    }
    else if(command === 'spotify-this-song') {
        runSpot();
    }
    else if(command === 'movie-this') {
        runMov();
    }
    else if(command === 'do-what-it-says') {
        // LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands
        fs.readFile("random.txt", "utf8", function(err, data) {

            var display = data.split(",");
            command = display[0];
            userEntry = display[1];
        
            runFunctions();
        })
}}

// BONUS: Aggregate each response and append to 'log.txt'

var logToFile = function(input) {

    fs.appendFile("log.txt", input, function(err) {

    if (err) {
        console.log(err);
    }

    })

};

// Initialize function

runFunctions();


