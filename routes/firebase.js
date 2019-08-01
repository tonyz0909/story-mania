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

exports.getFirebase = function (req, resp) {
    databaseRef.child("games").once("value").then(function (dataSnapshot) {
        console.log(dataSnapshot.val());
        return resp.json(dataSnapshot);
    }).catch((err) => {
        console.error('Firebase error:', err.message);
    });;
}

exports.pushToFirebase = function (req, res) {
    console.log(req.query);
    databaseRef.child("todos").push().set(req.query.item);
    res.send("success");
}

// create a new game with the specified name and return the id of the game
// params: name
exports.createGame = function (req, res) {
    let game = databaseRef.child("games").push({ name: req.query.name, players: 0, turn: 0 }, (error) => {
        if (error) return res.send("error: " + error);
    });
    return res.send(game.key);
}

// params: gameId, user
exports.createUser = function (req, res) {
    //get number of players currently in game
    let game = "games/" + req.query.gameId;
    databaseRef.child(game + "/players").once("value").then(function (dataSnapshot) {
        console.log(dataSnapshot.val());
        let dataJson = dataSnapshot.val();
        let currentId = parseInt(dataJson) + 1;
        // create user with unique id and increment number of players
        databaseRef.child(game + "/players").set(currentId, (error) => {
            if (error) return res.send("error: " + error);
        });
        databaseRef.child(game + "/users/" + currentId).set({ name: req.query.user }, (error) => {
            if (error) return res.send("error: " + error);
        });
        return res.send("" + currentId);
    }).catch((err) => {
        console.error('Firebase error:', err.message);
    });;
}

// params: gameId, word
exports.addWord = function (req, res) {
    let words = "games/" + req.query.gameId + "/story";
    databaseRef.child(words).push(req.query.word);
    res.send("success");
}

exports.getGame = function (req, res) {
    const databaseRef = firebase.database().ref('games');
    databaseRef.once("value").then(function (dataSnapshot) {
        console.log('data snapshot:');
        console.log(dataSnapshot);
        return res.json(dataSnapshot);
    }).catch((err) => {
        console.error('Firebase error:', err.message);
    });;
}