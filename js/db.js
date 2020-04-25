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


function getUserData() {
  return {
    user: utils.getUserName(),
    sessionID: utils.getSessionID(),
    sessionName: utils.getSessionName()
  }
}

function addMessage(myText) {
    u = getUserData();
    console.log(u.user + ": " + myText);
    db.collection("chat").add({
        text: myText,
        user: u.user,
        time: new Date(),
        sessionID: u.sessionID,
        state: "submission",
        votes: []
    });
    $('#inputText').val("");
}

function voteFor(docID) {
    u = getUserData();
    console.log("Voting for ", docID);
    newVotes = data_cache[docID].data().votes;
    newVotes.push(u.user);
    var merger = data_cache[docID].ref.set({votes: newVotes}, {merge : true});
}

function addSession(sessionName) {
    console.log("Adding session " + sessionName);
    db.collection("sessions").add({
        sessionName: sessionName,
        users: [],
        state: "lobby"
    })
}

function removeUserFromSession(sessionID, user) {
  return new Promise( (res, rej) => {
    var sDocRef = db.collection("sessions").doc(sessionID);

    db.runTransaction(function(transaction) {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(sDocRef).then(function(sDoc) {
        if (!sDoc.exists) {
          throw "Session does not exist!";
        }

        // Add one person to the session
        // Note: this could be done without a transaction
        //       by updating the population using FieldValue.increment()
        var users = sDoc.data().users;
        var index = users.indexOf(user);
        if (index !== -1) users.splice(index, 1);
        transaction.update(sDocRef, {
          users: users
        });
      });
    }).then(function() {
      console.log("Transaction successfully committed!");
      res();
    }).catch(function(error) {
      console.log("Transaction failed: ", error);
      rej();
    });
  });
}

function addUserToSession(sessionID, user) {
  return new Promise( (res, rej) => {
    var sDocRef = db.collection("sessions").doc(sessionID);

    db.runTransaction(function(transaction) {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(sDocRef).then(function(sDoc) {
        if (!sDoc.exists) {
          throw "Session does not exist!";
        }

        // Add one person to the session
        // Note: this could be done without a transaction
        //       by updating the population using FieldValue.increment()
        var users = sDoc.data().users;
        if (!users.includes(user)) {
          users.push(user);
        }
        else return;
        transaction.update(sDocRef, {
          users: users
        });
      });
    }).then(function() {
      console.log("Transaction successfully committed!");
      res();
    }).catch(function(error) {
      console.log("Transaction failed: ", error);
      rej();
    });
  });
}

function getLobbySessions() {
  return new Promise( (res, rej) => {
    db.collection("sessions").where("state", "==", "lobby")
        .get()
        .then(function(querySnapshot) {
            sessionList = []
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
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
