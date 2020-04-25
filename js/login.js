function init() {
  getLobbySessions().then(
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
              startGame();
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
      for (session of sessions) {
        if (session.data.state === "lobby") {
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

function startGame() {
  window.location = 'game.html';
}


function login() {

  let input = document.querySelector("#username_input");
  let info = document.querySelector("#info");
  if (!input.checkValidity()) {
    info.innerHTML = input.validationMessage;
    return false;
  }
  sessionDropDown = document.querySelector("#session_dropdown");
  selectedSessionID = sessionDropDown.options[sessionDropDown.selectedIndex].value;
  selectedSessionName = sessionDropDown.options[sessionDropDown.selectedIndex].innerHTML;
  user = input.value;
  utils.saveToLocalStorage(lsVars.user, user);
  utils.saveToLocalStorage(lsVars.sessionID, selectedSessionID);
  utils.saveToLocalStorage(lsVars.sessionName, selectedSessionName);
  if (selectedSessionID) {
    addUserToSession(selectedSessionID, user).then(
      () => {startGame();},
      () => {return false;}
    );
  }
  else return false;
}
