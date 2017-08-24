// Required files

var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require("fs");

// Getting the user request or input
var userreq = [];
var userreq = process.argv;
var action = userreq[2];
console.log(action);
var song="";

// Assigning keys to avariable
var client = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys);


// Twitter
if (action === "my-tweets") {
    tweets();
}  

function tweets() {
  var params = {screen_name: 'ucitestclass'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var index = 0; index < tweets.length; index++) {
        console.log(tweets[index].text);
      }  
    }
  });
} // End function tweets

// Spotify

  for (var i = 3; i < userreq.length; i++) {
        // Building the song name with the user input 
      song = song + " " + userreq[i];
    }
    console.log(song);

if (action === "spotify-this-song") {
  if (song) {
      spotifySong(song);
        }
            
  else {
    spotifySong('The Sign by Ace of Base');
    }
}; // spotify-this-song

  function spotifySong(song) {
    spotify.search({ type: 'track', query: song }, function(err, data) {
      if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
      console.log("Artist(s): ",data.tracks.items[0].artists[0].name);
      console.log("Song name:  ", data.tracks.items[0].name);
      console.log("Song preview url:  ", data.tracks.items[0].preview_url);
      console.log("Song external url:  ", data.tracks.items[0].external_urls);
      console.log("Album:  ", data.tracks.items[0].album.name);   
      });
  }

// omdb

if (action === "movie-this") {
    var title = "";
    for (var i = 3; i < userreq.length; i++) {
      // Building a string with the user input 
        var title = title + userreq[i] + "+";
    }
  
  if (title){
       movieThis(title)
  }
  else {
    var title = "Mr+Nobody";
    movieThis(title);
  };
}

function movieThis(title) {
  var queryURL ="http://www.omdbapi.com/?t=" + title + "&plot=short&apikey=40e9cece";
  
      request.get(queryURL, function (error, response, body) {
        if ( error ) {
          console.log('Error occurred: ' + error); // Print the error if one occurred
          return;
      }
            
      var bodyResults = JSON.parse(body);
      
      console.log("Title: ", bodyResults.Title);
      console.log("Year: ", bodyResults.Year);
      console.log("IMDB Rating: ", bodyResults.imdbRating);
      //old movies don't have RT Ratting
      if (bodyResults.Ratings[1]){
        console.log("Rotten Tomatoes Rating: ", bodyResults.Ratings[1].Value);
      }
      else{
        console.log("Rotten Tomatoes Rating: \"N/A\"");
      }
      console.log("Country: ", bodyResults.Country);
      console.log("Language: ", bodyResults.Language);
      console.log("Plot: ", bodyResults.Plot);
      console.log("Actors: ", bodyResults.Actors); 
      });
};

// do-what-it-says
if (action === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
  
  data = data.split(",");
  
  action = data[0];
  console.log(action);
  req = data[1];
  console.log(req);
  
  if (action === "spotify-this-song") {
    song = req;
    spotifySong(song);
    }
  
  if (action === "movie-this") {
      var title = "";
      req = req.split(" ");
      for (var i = 0; i < req.length; i++) {
        // Building a string with the user input 
          var title = title + req[i] + "+";
      }
    console.log(title);
    movieThis(title);
    }
  
  
}); // End fs-readfile
}// End do-what-it-says