// // Your web app's Firebase configuration
// var firebaseConfig = {
//     apiKey: "AIzaSyDtcPabcSL2Az1udi0sfPUykPMyb0HmhiQ",
//     authDomain: "dungeonsdemocracy.firebaseapp.com",
//     databaseURL: "https://dungeonsdemocracy.firebaseio.com",
//     projectId: "dungeonsdemocracy",
//     storageBucket: "dungeonsdemocracy.appspot.com",
//     messagingSenderId: "64547435849",
//     appId: "1:64547435849:web:589a4a4842cefbdaf61698",
//     measurementId: "G-XN89FH43FP"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// // firebase.analytics();
// var db = firebase.firestore();

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
  sessionName = utils.getSessionName();
  if (!sessionName) {
    // return to login
    quit();
    return;
  }
  document.querySelector("#usernamegreet").innerHTML = user;
  document.querySelector("#sessionname").innerHTML = sessionName;
  // getLobbySessions().then(
  //   (sessions) => {
  //     console.log(sessions);
  //
  //     listenToMessages();
  //   });

  //   $("#inputText").on('keyup', function( e ){
  //       console.log("triggered: "  +e);
  //       if (e.which == 13) {
  //           e.preventDefault();
  //           txt = $('#inputText').val();
  //
  //           addMessage(utils.getUserName(), txt, utils.getSessionName());
  //       }
  //   });

    // finally, start listening to messages ..
    listenToMessages(sessionName);
}

function quit() {
  user = utils.getUserName();
  sessionName = utils.getSessionName();
  sessionID = utils.getSessionID();
  removeUserFromSession(sessionID, user).then(
    () => {
      utils.removeFromLocalStorage(lsVars.user);
      utils.removeFromLocalStorage(lsVars.sessionID);
      utils.removeFromLocalStorage(lsVars.sessionName);
      window.location = 'index.html';
    }
  );
}

function listenToMessages(sessionID) {
    db.collection("chat").where("sessionID", "==", sessionID)
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
