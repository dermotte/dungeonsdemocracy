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
var data_cache = new Array();

var tpl_vote = "<div class=\"card vote-card col-sm-4\">\n" +
    "<div class=\"card-body\">\n" +
    "<p>@@text@@</p>\n" +
    "<div class=\"text-center\">\n" +
    "<a href=\"javascript:voteFor('@@docid@@')\" class=\"btn btn-success mx-auto btn-like\"><i class=\"fas fa-thumbs-up\"></i></a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n";

// inits user/session/etc
function init() {
    userData = getUserData();
    user = userData.user;
    if (!user) {
        // return to login
        quit();
        return;
    }
    sessionID = userData.sessionID;
    sessionName = userData.sessionName;
    if (!sessionID) {
        // return to login
        quit();
        return;
    }
    document.querySelector("#usernamegreet").innerHTML = user;
    document.querySelector("#sessionname").innerHTML = sessionName;
    listenToMessages(sessionID);
}

function quit() {
    user = utils.getUserName();
    sessionName = utils.getSessionName();
    sessionID = utils.getSessionID();
    removeUserFromSession(sessionID, user).then(
        () => {
            // utils.removeFromLocalStorage(lsVars.user);
            utils.removeFromLocalStorage(lsVars.sessionID);
            utils.removeFromLocalStorage(lsVars.sessionName);
            window.location = 'index.html';
        }
    );
}

function listenToMessages(sessionID) {
    console.log(sessionID);
    db.collection("chat").where("sessionID", "==", sessionID)
        .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {
                u = getUserData();
                // if (change.doc.data().sessionID === u.sessionID) {
                if (change.type === "added") {
                    if (change.doc.data().state != 'submission') {
                        console.log("Got text to display: ", change.doc.data());
                        // display message
                        $("#messages").append("<div class=\"col-sm-12 \" style=\"margin: 3pt\">"
                            + change.doc.data().user + ": "
                            + change.doc.data().text + " <i style='font-size: 6pt'>("
                            + change.doc.data().time.toDate().toLocaleString("de-AT") + ")</i></div>");
                    } else {
                        console.log("Got text to vote: ", change.doc.data(), " - ", change.doc.id);
                        data_cache[change.doc.id] = change.doc;
                        // display vote
                        $("#voting").append(tpl_vote.replace("@@text@@", change.doc.data().text).replace("@@docid@@", change.doc.id));
                    }
                }
                if (change.type === "modified") {
                    console.log("Modified messsage: ", change.doc.data());
                }
                if (change.type === "removed") {
                    console.log("Removed messsage: ", change.doc.data());
                }
                // } // session check
            });
        });
}
