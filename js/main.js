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
firebase.analytics();
var db = firebase.firestore();

function addMessage(myText) {
    console.log("vote: " + $('input[name=vote]:checked').val());
    db.collection("chat").add({
        vote: myText,
        // user: username,
        time: new Date()
    })
}