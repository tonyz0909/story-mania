const firebase = require('firebase');

const FirebaseConfig = {
    apiKey: "AIzaSyBVvoERxcerBb6M4lh2C3D-rZeYIKZUvjw",
    authDomain: "react-game-78498.firebaseapp.com",
    databaseURL: "https://react-game-78498.firebaseio.com",
    projectId: "react-game-78498",
    storageBucket: "react-game-78498.appspot.com",
    messagingSenderId: "976787720562",
    appId: "1:976787720562:web:2371c16988082bed"
}

firebase.initializeApp(FirebaseConfig);
const databaseRef = firebase.database().ref();

// exports.getFirebase = new Promise((resolve, reject) => {
//     databaseRef.child("games").once("value").then(function (dataSnapshot) {
//         console.log(dataSnapshot.val());
//         return resolve(dataSnapshot.val());
//     }).catch((err) => {
//         console.error('Firebase error:', err.message);
//         reject('error occured');
//     });
// });

exports.firebaseRef = databaseRef;

exports.pushToFirebase = function (req, res) {
    console.log(req.query);
    databaseRef.child("todos").push().set(req.query.item);
    res.send("success");
}

// create a new game with the specified name and return the id of the game
// params: name
exports.createGame = function (name) {
    return new Promise(function (resolve, reject) {
        let game = databaseRef.child("games").push({ players: 1, turn: 0, users: { 0: { name: name }}}, (error) => {
            if (error) reject("error: " + error);
        });
        return resolve(game.key);
    })
};

// params: gameId, user
exports.createUser = function (gameId, user) {
    //get number of players currently in game
    let game = "games/" + gameId;
    databaseRef.child(game + "/players").once("value").then(function (dataSnapshot) {
        console.log(dataSnapshot.val());
        let dataJson = dataSnapshot.val();
        let currentPlayers = parseInt(dataJson) + 1;
        // create user with unique id and increment number of players
        databaseRef.child(game + "/players").set(currentPlayers, (error) => {
            if (error) return "error: " + error;
        });
        databaseRef.child(game + "/users/" + (currentPlayers-1)).set({ name: user }, (error) => {
            if (error) return "error: " + error;
        });
        return "" + currentPlayers-1;
    }).catch((err) => {
        console.error('Firebase error:', err.message);
    });;
}

// params: gameId, word
exports.addWord = function (gameId, user, word) {
    // add word
    let words = "games/" + gameId + "/story";
    databaseRef.child(words).push({ value: word, user: user });
    // increment turn
    let turn = "games/" + gameId + "/turn";
    databaseRef.child(turn).transaction(currentRank => currentRank + 1);
    return "success";
}

exports.getGame = function (gameId) {
    return new Promise(function (resolve, reject) {
        let gamePath = "games/" + gameId;
        const databaseRef = firebase.database().ref(gamePath);
        databaseRef.once("value").then(function (dataSnapshot) {
            resolve(dataSnapshot.val());
        }).catch((err) => {
            console.error('Firebase error:', err.message);
            reject(err);
        });
    });

// exports.changeGameMode = function()
}