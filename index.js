var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

var app = express();
app.use(cors());
app.use(bodyParser.json());

// TODO login to obtain accessToken
// TODO does this token stay constant or does it expire after some time??
let accessToken = "0222bed0-8701-11ea-ad58-87aded6b30c5";
let headers = {"headers": {"X-Access-Token" : accessToken}};    // authentication magic
let sessionId;

app.post('/login', function (req, res) {
    res.send('TODO');
});

app.post('/initStory', function (req, res) {

    try {
        // TODO different choices (random? custom?)
        let storyConfiguration = {
            "storyMode": "fantasy",
            "characterType": "knight",
            "name": "Donald"
        }

        // create a new session
        axios.post('https://api.aidungeon.io/sessions',
            storyConfiguration,
            headers
        )
            .then((response) => {

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
        axios.get('https://api.aidungeon.io/sessions', headers)
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
            console.error(error)
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
            headers
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

app.listen(3000, function () {
    console.log('ioDungeonProxy listening on port 3000!');
});