var MIN_USERS = 3;

async function init() {

  userData = getUserData();
  user = userData.user;
  sessionID = userData.sessionID;
  sessionName = userData.sessionName;

  let session = await getSession(sessionID);
  console.log(session);
  update_display(session);

  listentoSession(userData.sessionID);
}

function update_display(session) {
  userData = getUserData();
  let i_am_host = is_host(session.users, userData.user);
  host = i_am_host ? "(host)": "";
  num_users = session.users.length;
  document.querySelector("#session_name").innerHTML = userData.sessionName;
  document.querySelector("#user_name").innerHTML = userData.user + ` ${host}`;
  document.querySelector("#num_users").innerHTML = num_users;
  butt = document.querySelector("#start_butt");
  if (num_users >= MIN_USERS && i_am_host) {
    butt.disabled = false;
  }
}

async function start() {
  sessionID = utils.getSessionID();
  await update_state(session_states.writing);
}

function listentoSession(sessionID) {
    console.log(sessionID);
    num_users_field = document.querySelector("#num_users");
    db.collection("sessions").doc(sessionID)
        .onSnapshot(function (snapshot) {
            console.log(snapshot.data());
            num_users_field.innerHTML = snapshot.data().users.length;
            if(snapshot.data().game_state == "writing") {
              window.location = 'game.html';
            }
            update_display();
        });
}
