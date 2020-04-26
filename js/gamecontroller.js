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

// user template
const new_user = {
    is_writer: false,
    name: "",
    score: 0,
    finished: false
}

// message template
const new_message = {
    text: "",
    votes: []
}

var state = state ? state : { // reflected in the session ...
    game_state: session_states.lobby,
    userList: [{
        is_writer: false,
        name: "",
        score: 0,
        finished: false
    }],
    messages: [],
    // readers: [], // all - writers
    turn: 0
}

const init_users = (users) => {
  console.log("init_users");
  state.userList = [];
  for (let user of users) {
    state.userList.push({
      ...new_user,
      name: user
    });
  }

  // 2Do: random select writers
  state.userList[0].is_writer = true;
}

// checks if a specific user is the host
const is_host = (users, user) => {
  console.log("is_host");

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
  console.log("process_message");

  state.messages.push({
    ...new_message,
    text: message.text
  })

  for(let user of state.userList) {
    if (user.name == message.user) {
      user.finished = true;
      console.log("new state");
      console.log(state);
    }
  }

  // message text = message.text
  // message user = message.user

  console.log("processing message ...");

  update_users();
}

// ends the current state
const update_users = () => {
  console.log("update_users");

  for(let user of state.userList) {
    if(state.game_state == session_states.writing){
      // check writers
      if(user.is_writer && !user.finished){
        // at least one writer is not finished - wait for them to finish
        return false;
      }
    }
  }


  console.log("everybody wrote");
  update_state(session_states.voting);
  // show highscore?
}

const process_message_update = (message) => {
  console.log("process_message_update");
  console.log("message updated: " +  message.votes.length);
  if(state.game_state == session_states.voting){
      // check voters

      for(let m of state.messages) {

        //update message in local state
        if(m.text == message.text) {
          m.votes = message.votes;
        }

        // check if everybody has voted
        if(state.userList.length > message.votes.length){
          // at least one voter is not finished - wait for them to finish
          return false;
        }
      }
    }

    console.log("everybody voted");
    update_state(session_states.writing);
}

const start_game = (sessionID) => {
    console.log("start_game");
  return update_state(session_states.writing);
}

// starts a new state
const update_state = (new_state) => {
    console.log("update_state");
  return new Promise( async (res, rej) => {

    // set state.userList[all] "finished" = false
    for (let user of state.userList) {
      user.finished = false;
    }

    state.game_state = new_state;
    console.log("set state to " + new_state);

    if (new_state == session_states.writing) {
      // writing state starts
      // 2Do: start ai message generation
    }

    await db.collection("sessions").doc(utils.getSessionID()).update(state);

    // 2Do: push state to all users

    // 2Do: set timer
    res();
  });
}

// time is out
// ends current state and starts a new one
const timeout = () => {
    console.log("timeout");
  // set state.userList[all] "finished" = true

  // update_users()
}
