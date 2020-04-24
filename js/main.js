// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDtcPabcSL2Az1udi0sfPUykPMyb0HmhiQ",
    authDomain: "dungeonsdemocracy.firebaseapp.com",
    databaseURL: "https://dungeonsdemocracy.firebaseio.com",
    projectId: "dungeonsdemocracy",
    storageBucket: "dungeonsdemocracy.appspot.com",
    messagingSenderId: "64547435849",
    appId: "1:64547435849:web:589a4a4842cefbdaf61698",
    measurementId: "G-XN89FH43FP"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
var db = firebase.firestore();

// here goes the local data ...
var data;

// inits user/session/etc
function init() {
  user = utils.getUserName();
  if (!user) {
    // return to login
    quit();
    return;
  }
  document.querySelector("#usernamegreet").innerHTML = user;
  getLobbySessions().then(
    (sessions) => {
      console.log(sessions);
      sessionDropDown = document.querySelector("#session_dropdown");
      html = "";
      for (session of sessions) {
        html += `<option value=${session.id}>${session.data.sessionID}</option>`
      }
      sessionDropDown.innerHTML = html;

      // TODO find session for 'user'
      // if not found enable user to join session

      // start listening
      listenToMessages();
    });

}

function quit() {
  utils.removeFromLocalStorage(lsVars.user);
  window.location.href = 'index.html';
}

function addMessage(username, myText) {
    console.log(username + ": " + myText);
    db.collection("chat").add({
        text: myText,
        user: username,
        time: new Date(),
        sessionID: "xyz"
    })
}

function addSession(sessionID) {
    console.log("Adding session " + sessionID);
    db.collection("sessions").add({
        sessionID: sessionID,
        state: "lobby"
    })
}

function getLobbySessions() {
  return new Promise( (res, rej) => {
    db.collection("sessions").where("state", "==", "lobby")
        .get()
        .then(function(querySnapshot) {
            sessionList = []
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                sessionList.push({
                    id:  doc.id,
                    data: doc.data()
                })
            });
            res(sessionList);
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
            rej(error);
        });
  });
}



function listenToMessages() {
    db.collection("chat")//.where("sessionID", "==", "--our--session--is--from--local--storage")
        .onSnapshot(function(snapshot) {
            snapshot.docChanges().forEach(function(change) {
                if (change.type === "added") {
                    console.log("New messsage: ", change.doc.data());
                    $("#messages").append("<div class=\"card col-sm-12 \" style=\"margin: 3pt\"><div class=\"card-body\">"
                        + change.doc.data().user + ": "
                        + change.doc.data().text + " <i style='font-size: 6pt'>("
                        + change.doc.data().time.toDate().toLocaleString("de-AT")+")</i></div></div>");
                }
                if (change.type === "modified") {
                    console.log("Modified messsage: ", change.doc.data());
                }
                if (change.type === "removed") {
                    console.log("Removed messsage: ", change.doc.data());
                }
            });
        });
}
