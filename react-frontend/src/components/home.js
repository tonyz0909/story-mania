import React, { Component } from 'react';
import Story from './story';
import Welcome from './welcome';
import { createGame, createUser, getFirebase, getGame, addWord, firebaseRef } from '../firebase';
import { Container, Radio } from 'semantic-ui-react';

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inverted: false,
            game: null,
            story: "",
            gameId: null,
            name: "",
        };
    }

    // componentDidMount() {
    //     // getFirebase()  -- from ../api, "proxy": "http://localhost:8000"
    //     //     .then((res) => {
    //     //         return res.json();
    //     //     })
    //     //     .then((json) => {
    //     //         this.setState({ game: json["-Ll2kMaVAN7LeHFGpO8f"]}, this.setStory);
    //     //     });

    //     // getFirebase
    //     //     .then((json) => {
    //     //         this.setState({ game: json["-Ll2kMaVAN7LeHFGpO8f"] }, this.setStory);
    //     //     });

    //     firebaseRef.child("games").on('value', (snapshot) => {
    //         let json = snapshot.val();
    //         this.setState({ game: json[this.state.gameId] }, this.setStory);
    //     });
    // }

    toggleTheme = () => this.setState(prevState => ({ inverted: !prevState.inverted }));
    // called from welcome
    setGameValues = (gameId, name) => this.setState({ gameIdUncleaned: gameId, name: name }, this.getGameData);
    // called when creating a new game from story
    setGameId = (gameId) => this.setState({ gameId: gameId});
    // get game data, or create a new game if no game with the gameId exists
    getGameData = () => {
        firebaseRef.child("games").once('value', (snapshot) => {
            let json = snapshot.val();
            console.log(json);
            // console.log(json[this.state.gameIdUncleaned]);
            // if no existing game exists with that name, create a new one
            if (json === null || this.state.gameIdUncleaned === null || json[this.state.gameIdUncleaned] == null) {
                this.createNewGame();
            } else {
                this.setState({ gameId: this.state.gameIdUncleaned }, () => {
                    createUser(this.state.gameId, this.state.name);
                });
            }
        });
    }

    createNewGame = () => {
        createGame(this.state.name)
            .then((gameId) => {
                console.log('got game id: ' + gameId);
                // update state and parent state with new randomly generated game id
                this.setState({ gameId: gameId });
            })
            .catch(err => console.log('error: ' + err));
    }

    render() {
        console.log(this.state);
        return (
            <Container>
                {this.state.gameId === null ? (
                    <Welcome inverted={this.state.inverted} setGameValues={this.setGameValues}/>
                )
                    :
                    (
                        <Story inverted={this.state.inverted} gameId={this.state.gameId} name={this.state.name} setGameId={this.setGameId}/>
                    )}
                <Radio toggle onChange={this.toggleTheme} label="Dark Mode" />
            </Container>
        );
    }
}
