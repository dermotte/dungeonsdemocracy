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
    votes: [],
    user: ""
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
    story: [], // {text, user}
    // readers: [], // all - writers
    turn: 0,
    writers_sequence: [],
    current_writer: 0
}


// is called by every user
const init_users = (users) => {
  console.log("init_users");
  state.userList = [];
  for (let user of users) {
    state.userList.push({
      ...new_user,
      name: user
    });
  }
}

// checks if a specific user is the host
const is_host = (users, user) => {
  // console.log("is_host");

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
    text: message.text,
    user: message.user
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

      let user_votes = 0;
      for(let m of state.messages) {

        //update message in local state
        if(m.text == message.text) {
          m.votes = Array.from(new Set(message.votes.concat(m.votes)));
          console.log("message " + m.text + " | has now " + m.votes.length);
        }

        user_votes += m.votes.length;
      }

      console.log("votes: " + user_votes);

      // check if everybody has voted
      if(state.userList.length > user_votes){
        // at least one voter is not finished - wait for them to finish
        return false;
      }

      console.log("everybody voted");


      assingWinner();

      state.messages = [];
      // remove all "submission states" from messages
      db.collection("chat").where("sessionID", "==", sessionID)
          .onSnapshot(function (snapshot) {
              snapshot.docChanges().forEach(async function (change) {
                  var merger = change.set({state: "handled"}, {merge : true});
              })
          });

      assignWriters();

      update_state(session_states.writing);
    }
}

function assingWinner() {
  let winner;
  let message;
  let vote_count = 0;
  for(let m of state.messages) {
    if(m.votes.length > vote_count){
      vote_count = m.votes.length;
      winner = m.user;
      message = m.text;
    }
  }

  for (let user of state.userList){
    if(user.name == winner) {
      user.score ++;
    }
  }

  state.story.push({text: message, user: winner});
}

function assignWriters() {
    let first = state.writers_sequence[state.current_writer++ % state.writers_sequence.length]
    let second = state.writers_sequence[state.current_writer++ % state.writers_sequence.length]

    state.userList.forEach(u => u.is_writer = false);
    state.userList[first].is_writer = true;
    state.userList[second].is_writer = true;

}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// only host starts game, so we initialize all the important stuff like
// * init random sequence
const start_game = async (sessionID) => {
    console.log("start_game");

    // TODO already generate initial message in lobby
    // generate start message and write to state
    let message = await aiDungeon.initStory();
    state.story.push({text: message, user: "init"});

    // ---< initialize random writers sequence >---
    // random select writers
    state.writers_sequence = new Array();
    for (let i=0; i < state.userList.length; i++) {
      state.writers_sequence.push(i);
    }
    // list shuffle
    shuffle(state.writers_sequence);
    state.current_writer = 0;
    assignWriters();

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
