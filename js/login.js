function init() {
  getSessions().then(
    (sessions) => {
      console.log(sessions);
      // check if user already logged in
      user = utils.getUserName();
      if (user) {
        for (s of sessions) {
          for (u of s.data.users) {
            console.log(u);
            if (u === user) {

              // return to game
              startGame(s.data.game_state);
              return;
            }
          }
        }
        // username exists but no session, fill in username
        document.querySelector("#username_input").value = user;
      }

      // user is not logged in/not part of a session
      sessionDropDown = document.querySelector("#session_dropdown");
      html = "";
      html += `<option value="new">new session ...</option>`;
      for (session of sessions) {
        if (session.data.game_state === "lobby") {
          html += `<option value=${session.id}>${session.data.sessionName}</option>`;
        }
        else {
          html += `<option value=${session.id} disabled>${session.data.sessionName}</option>`;
        }
      }
      sessionDropDown.innerHTML = html;

      // TODO find session for 'user'
      // if not found enable user to join session

      // start listening
      // listenToMessages();
    });


}

function startGame(state) {
  console.log(state);
  // return;
  if (state === "lobby") window.location = 'lobby.html';
  else window.location = 'game.html';
}


async function login() {

  let input = document.querySelector("#username_input");
  let info = document.querySelector("#info");
  if (!input.checkValidity()) {
    info.innerHTML = input.validationMessage;
    return false;
  }
  sessionDropDown = document.querySelector("#session_dropdown");
  if (sessionDropDown.options[sessionDropDown.selectedIndex].value == "new")  {
    // add new session here
    let sessionName = generateName();
    selectedSessionID = await addSession(sessionName);
    selectedSessionName = sessionName;
  } else {
    selectedSessionID = sessionDropDown.options[sessionDropDown.selectedIndex].value;
    selectedSessionName = sessionDropDown.options[sessionDropDown.selectedIndex].innerHTML;
  }
  user = input.value;
  utils.saveToLocalStorage(lsVars.user, user);
  utils.saveToLocalStorage(lsVars.sessionID, selectedSessionID);
  utils.saveToLocalStorage(lsVars.sessionName, selectedSessionName);
  if (selectedSessionID) {
    let session = await getSession(selectedSessionID);
    addUserToSession(selectedSessionID, user).then(
      () => {
        startGame(session.game_state);
      },
      () => {return false;}
    );
  }
  else return false;
}
