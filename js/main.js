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

function addMessage(username, myText) {
    console.log(username + ": " + myText);
    db.collection("chat").add({
        text: myText,
        user: username,
        time: new Date(),
        sessionID: "xyz"
    })
}

function listenToMessages() {
    db.collection("chat")//.where("state", "==", "CA")
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