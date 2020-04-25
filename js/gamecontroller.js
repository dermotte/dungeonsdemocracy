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
        score: 0,
        finished: false
    }],
    // readers: [], // all - writers
    turn: 0
}

// checks if a specific user is the host
const is_host = (users, user) => {

  // users array not set
  if(!users || !user || !users.length) {
    console.error("users array or user not set");
    console.error("users: " + JSON.stringify(users));
    console.error("user: " + JSON.stringify(user));
    return false;
  }
  
  return user == users[0];
}

// public function
const process_message = (message) => {
  // state.users[id].finished = true;

  console.log("processing message ...");
  // message text = message.text
  // message user = message.user

  // update_users()
}

// ends the current state
const update_users = () => {
  // if state == writing
  // if all are finished: update_state(voting)


    // if state == voting
    // if all are finished: update_state(writing)


    // show highscore?
}

// starts a new state
const update_state = (state) => {
  // set state.users[all] "finished" = false

  // do stuff

  // set timer
}

// time is out
// ends current state and starts a new one
const timeout = () => {
  // set state.users[all] "finished" = true

  // update_users()
}