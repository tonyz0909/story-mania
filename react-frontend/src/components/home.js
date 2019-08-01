import React, { Component } from 'react';
import Story from './story';
import Welcome from './welcome';
import { getFirebase, addWord, firebaseRef } from '../firebase';
import { Container, Radio } from 'semantic-ui-react';

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inverted: false,
            game: {},
            story: "",
            gameId: "",
            name: ""
        };
    }

    componentDidMount() {
        // getFirebase()  -- from ../api, "proxy": "http://localhost:8000"
        //     .then((res) => {
        //         return res.json();
        //     })
        //     .then((json) => {
        //         this.setState({ game: json["-Ll2kMaVAN7LeHFGpO8f"]}, this.setStory);
        //     });

        // getFirebase
        //     .then((json) => {
        //         this.setState({ game: json["-Ll2kMaVAN7LeHFGpO8f"] }, this.setStory);
        //     });

        firebaseRef.child("games").on('value', (snapshot) => {
            let json = snapshot.val();
            this.setState({ game: json[this.state.gameId] }, this.setStory);
        });
    }

    setStory = () => {
        if (this.state.game && this.state.game.story) {
            let story = this.state.game.story;
            let storyString = "";
            for (let word of Object.values(story)) {
                storyString += word + " ";
            }
            this.setState({ story: storyString }, () => console.log(this.state.story));
        }
    }

    addToStory = () => {
        addWord(this.state.gameId, this.state.currentInput); //"-Ll2kMaVAN7LeHFGpO8f"
        this.setState({ currentInput: '' });
    }

    toggleTheme = () => this.setState(prevState => ({ inverted: !prevState.inverted }));
    setGameId = (gameId) => this.setState({ gameId: gameId }, () => console.log(this.state.gameId));

    render() {
        return (
            <Container>
                {this.state.gameId === "" ? (
                    <Welcome inverted={this.state.inverted} setGameId={this.setGameId}/>
                )
                    :
                    (
                        <Story inverted={this.state.inverted} gameId={this.state.gameId}/>
                    )}
                <Radio toggle onChange={this.toggleTheme} label="Dark Mode" />
            </Container>
        );
    }
}
