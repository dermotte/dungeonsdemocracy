const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

const path = require('path')
const PORT = process.env.PORT || 5000

const app = new express();
app.use(bodyParser.json());

app.get('/', function(request, response){
    response.sendFile(__dirname+'/view/welcome.html');
});

// default accessToken (can be changed by calling login)
let accessToken = "0222bed0-8701-11ea-ad58-87aded6b30c5";
let sessionId;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/login', function (req, res) {
    let credentials = req.body;

    axios.post('https://api.aidungeon.io/users',
        credentials
    ).then((response) => {
        if (response.data.accessToken) {
            accessToken = response.data.accessToken;
            console.log("new accessToken " + accessToken);
            res.send(accessToken);
        }
    })
    .catch((error) => {
        console.error("login failed");
        res.send("login failed");
    });
});

app.post('/initStory', function (req, res) {
    try {
        let customPrompt = req.body.customPrompt;

        // read random starting story from a file if nothing is passed
        if (!customPrompt) {
            customPrompt = getRandomStartSentence();
        }

        // let storyConfiguration = {
        //     "storyMode": "fantasy",
        //     "characterType": "knight",
        //     "name": "Donald"
        // }

        let storyConfiguration = {
            "storyMode": "custom",
            "customPrompt": customPrompt
        }

        // create a new session
        axios.post('https://api.aidungeon.io/sessions',
            storyConfiguration,
            getHeader()
        ).then((response) => {
            sessionId = response.data.id;
            console.log("new sessionId: " + sessionId);

            let output = response.data.story[0].value;
            console.log(output);
            res.send(output);
        })
        .catch((error) => {
            console.error(error)
            res.send(error);
        });
    } catch (e) {
        res.send(e);
    }

});

app.post('/resumeRandomStory', function(req, res) {

    try {
        axios.get('https://api.aidungeon.io/sessions', getHeader())
            .then((response) => {
            // response.data is an array of all started stories of the current user, we only need the id
            let sessions = response.data;
        if (sessions.length == 0) {
            res.send("no story started yet...");
            return;
        }
        let sessionIds = response.data.map(s => s.id);
        let randomIdx = Math.floor(Math.random() * sessionIds.length);
        let randomId = sessionIds[randomIdx];

        sessionId = randomId;
        console.log("resuming session: " + randomId);
        res.send("resuming session: " + randomId);
    })
    .catch((error) => {
        console.error(error);
        res.send(error);
    });

    } catch (e) {
        res.send(e);
    }

});

app.post('/input', function (req, res) {
    try {

        if (!sessionId) {
            console.log("currently no session running... call initStory or resumeRandomStory first");
            res.send("currently no session running... call initStory or resumeRandomStory first");
            return;
        }

        let data = req.body;

        axios.post('https://api.aidungeon.io/sessions/' + sessionId + '/inputs',
            data,
            getHeader()
        )
        .then((response) => {
        let output = response.data[response.data.length-1].value;   // get the most recent text
        console.log(output);
        res.send(output);
    })
    .catch((error) => {
        console.error(error)
        res.send(error);
    });
    } catch (e) {
        res.send(e);
    }

});

app.listen(PORT, function () {
    console.log('ioDungeonProxy listening on port ' + PORT);
});

function getHeader() {
    return {"headers": {"X-Access-Token" : accessToken}};
}

function getRandomStartSentence() {
    let sentences = fs.readFileSync('./startSentences.txt', 'utf8').split("\n").filter(s => s.length > 0);
    let randomIdx = Math.floor(Math.random() * sentences.length);
    let randomSentence = sentences[randomIdx];
    return randomSentence;
}
