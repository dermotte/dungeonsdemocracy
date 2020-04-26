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

// add style="display: none" to tpl_vote
const tpl_vote = (text, docid) => `<div class="card vote-card col-sm-4">
    <div class="card-body">
    <p>${text}</p>
    <div class="text-center">
    <a href="javascript:voteFor('${docid}')" class="btn btn-success mx-auto btn-like"><i class="fas fa-thumbs-up"></i></a>
    </div>
    </div>
    </div>`;

const tpl_msg = (user, text, time) => `<div class="col-sm-12" style="margin: 3pt">${user}: ${text} <i style='font-size: 6pt'>(${time})</i></div>`


// inits user/session/etc
async function init() {


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

    // init controller
    let data = await db.collection("sessions").doc(utils.getSessionID()).get();
    init_users(data.data().users);

    if(is_host(data.data().users, getUserData().user)){
      sessionID = utils.getSessionID();
      await start_game(sessionID);
    }

    listenToMessages(sessionID);
    listentoState(sessionID);
}

function listenToMessages(sessionID) {
    console.log(sessionID);
    db.collection("chat").where("sessionID", "==", sessionID)
        .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(async function (change) {
                u = getUserData();
                const data = await db.collection("sessions").doc(utils.getSessionID()).get();
                const users = data.data().users;
                // if (change.doc.data().sessionID === u.sessionID) {
                if (change.type === "added") {
                    // console.log("sessions: " + JSON.stringify(db.collection("sessions")));
                    console.log("sessionID: " + utils.getSessionID());
                    // console.log("doc: " + JSON.stringify(db.collection("sessions").doc(utils.getSessionID())))

                    if(is_host(users, getUserData().user)){

                      // handling new messages explicitely as host in the gamecontroller.js
                      process_message(change.doc.data());
                    }
                    // everybody does that:
                    if (change.doc.data().state != 'submission') {
                        console.log("Got text to display: ", change.doc.data());
                        // display message
                        $("#messages").append(tpl_msg(change.doc.data().user, change.doc.data().text, change.doc.data().time.toDate().toLocaleString("de-AT")));
                    } else {
                        console.log("Got text to vote: ", change.doc.data(), " - ", change.doc.id);
                        data_cache[change.doc.id] = change.doc;
                        // display vote
                        $("#voting").append(tpl_vote(change.doc.data().text, change.doc.id));
                    }
                }
                if (change.type === "modified") {
                    console.log("Modified messsage: ", change.doc.data());
                    if(is_host(users, getUserData().user)){

                      // in gamecontroller.js
                      process_message_update(change.doc.data());
                    }
                }
                if (change.type === "removed") {
                    console.log("Removed messsage: ", change.doc.data());
                }
                // } // session check
            });
        });
}


function listentoState(sessionID) {
    console.log(sessionID);
      db.collection("sessions").doc(sessionID)
          .onSnapshot(function (snapshot) {

            $("#initStory").html(snapshot.data().story[0].text);

            u = getUserData();
            console.log(snapshot.data());
            document.querySelector("body").classList.remove("state_writing");
            document.querySelector("body").classList.remove("state_voting");
            document.querySelector("body").classList.add("state_" + snapshot.data().game_state);

            if(snapshot.data().game_state == "writing") {
                  document.querySelector("#story").innerHTML = "";
                  for(let i = 1; i < snapshot.data().story.length; i++){
                    document.querySelector("#story").innerHTML += `
                        <div class="col-sm-10">${snapshot.data().story[i].text}</div>
                        <div class="col-sm-2">${snapshot.data().story[i].user}</div>`
                    ;
                  }
                $("#voting").html('');
            }

            if(snapshot.data().game_state == "voting") {
                  document.querySelectorAll(".btn-like").forEach((button) => { button.style.display = "block"; });
            }


            document.querySelector("body").classList.remove("is_writer");
            if(snapshot.data().userList) {
              for(let user of snapshot.data().userList) {
                if(user.name == u.user && user.is_writer){
                  document.querySelector("body").classList.add("is_writer");
                }
              }
            }
          });
}
