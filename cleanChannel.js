/** 
	Created by Kyle Sherman
	Updated 12/14/2018
	
	Simply change the token and the chanel in the configuration section 
	you can also adjust the delay and allow private chanels to be cleared.
	
	The purpose of this program was to implement a progmatical approach to quickly
	clearing a slack channel as it reaches its limit.
	
	Does require node.js to be installed in order to operate
	
**/

var https = require('https');
var Slack = require('slack-node');

// assign the current date to a date variable
var date = new Date();

// CONFIGURATION #######################################################################################################

var token          = ''; // API Token goes here 
var channel        = ''; // channel ID goes here
var privateChannel = false;
var delay          = 100; // delay between delete operations in millisecond

// GLOBALS #############################################################################################################

var channelApi    = privateChannel ? 'groups' : 'channels';
var baseApiUrl    = 'https://slack.com/api/';
var historyApiUrl = baseApiUrl + channelApi + '.history?token=' + token + '&count=1000&channel=' + channel;
var deleteApiUrl  = baseApiUrl + 'chat.delete?token=' + token + '&channel=' + channel + '&ts='
var messages      = [];

// ---------------------------------------------------------------------------------------------------------------------

function deleteMessage() {

    if (messages.length == 0) {
        console.log();
        console.log("No more messages to delete." + "\n" + "Closing the connection!");


        // connects to the slack API and posts a message
        // logging the date and time messages were cleared
        var Slack = require('slack-node');
        slack = new Slack(token);
        
        slack.api("users.list", function(err, response) {
        console.log(response);
        });
        
        slack.api('chat.postMessage', {
        text:'Messages cleared from #general on ' + date,
        channel:'#general'
        }, function(err, response){
        console.log(response);
        });

        return;
    }

    var ts = messages.shift();

    https.get(deleteApiUrl + ts, function (res) {

        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function(){
            var response = JSON.parse(body);

            if (response.ok === true) {
                console.log(ts + ' deleted! ' + messages.length + ' remaining');
            } else if (response.ok === false) {
                messages.push(ts);
            }

            setTimeout(deleteMessage, delay);
        });
    }).on('error', function (e) {
        console.log("Got an error: ", e);
    });
}

// ---------------------------------------------------------------------------------------------------------------------

https.get(historyApiUrl, function(res) {

    var body = '';

    res.on('data', function (chunk) {
        body += chunk;
    });

    res.on('end', function () {

        var response = JSON.parse(body);
  
        for (var i = 0; i < response.messages.length; i++) {
            messages.push(response.messages[i].ts);
        }

        console.log("Successfully connected!");
        console.log("Initializing deletion process...");
        console.log();

        

        deleteMessage();  
    });
}).on('error', function (e) {
      console.log("Got an error: ", e);
});

