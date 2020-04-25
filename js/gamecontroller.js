// import
// <script type="text/javascript" src="js/gamecontroller.js"></script>
// use
// e.g. ...

const session_states = {
    lobby: "lobby",
    writing: "writing",
    voting: "voting",
    highscore: "highscore"
}

var state = { // reflected in the session ...
    game_state: session_states.lobby,
    users: [{
        is_writer: false,
        name: "",
        score: 0
    }],
    // readers: [], // all - writers
    turn: 0
}