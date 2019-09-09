import React, { Component } from 'react';
import { createUser, addWord, firebaseRef, createGame, changeTurnMode, getGame } from '../firebase';
import { Button, Container, Divider, Form, Grid, Icon, Input, Label, Message, Modal, Header, Segment, Radio, Popup } from 'semantic-ui-react';

export default class Story extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inverted: this.props.inverted,
            game: {},
            story: "",
            currentInput: "",
            modal: false,
            currentTurn: ""
        };

        this.creating = false; // game creation in progress
    }

    componentDidMount() {
        // listen to database updates and update state accordingly
        firebaseRef.child("games").on('value', (snapshot) => {
            let json = snapshot.val();
            console.log(json);
            console.log(this.props.gameId);
            console.log(json[this.props.gameId]);
            //TODO: convert to promise chain
            let game = json[this.props.gameId];
            let story = this.buildStory(game.story);
            let currentTurn = this.calculateTurn(game);
            this.setState({ game, story, currentTurn }, this.setStory);
        });
    }

    // returns string containing story
    buildStory = (story) => {
        // append array of words into a single "story" string
        if (story) {
            let storyString = "";
            for (let word of Object.values(story)) {
                storyString += word.value + " ";
            }
            return storyString;
        }
    }

    addToStory = () => {
        console.log(this.props.gameId);
        addWord(this.props.gameId, this.props.name, this.state.currentInput); //"-Ll2kMaVAN7LeHFGpO8f"
        this.setState({ currentInput: '' });
    }

    handleInput = (e, data) => this.setState({ currentInput: data.value });
    openModal = () => this.setState({ modal: true });
    closeModal = () => this.setState({ modal: false });
    calculateTurn = (game) => {
        console.log("player's turn: " + game.turn % game.players);
        let currentTurn = game.users[game.turn % game.players].name;
        return currentTurn;
    }
    copyToClipboard = (stringToCopy) => {
        // create temporary text area from which to copy text
        let textArea = document.createElement("textarea");
        textArea.value = stringToCopy;
        textArea.style = {position: 'absolute', left: '-9999px'};
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        // remove temporary text area
        document.body.removeChild(textArea);
        this.setState({ message: "Copied to clipboard!" });
    };
    // startGame = () => this.setState({ started: true });

    render() {
        console.log(this.state);
        let turnBased = this.state.game.turnBased;
        console.log(turnBased);
        return (
            <Segment inverted={this.props.inverted}>
                <Button circular icon='setting' floated="right" onClick={this.openModal} />
                <p style={{ marginTop: "1em" }}>
                    {this.state.story || <span style={{ color: "gray" }}>Enter a word to start the story off!</span>}
                </p>
                <Form>
                    <Form.Field fluid>
                        <Input placeholder='Enter a word...' className="margin" onChange={this.handleInput} value={this.state.currentInput} />
                    </Form.Field>
                    <Button animated inverted color='blue' onClick={this.addToStory} disabled={turnBased && this.state.currentTurn !== this.props.name}>
                        <Button.Content visible>Add</Button.Content>
                        <Button.Content hidden>
                            <Icon name='arrow right' />
                        </Button.Content>
                    </Button>
                </Form>
                <Divider hidden />
                <Segment raised>
                    <Grid columns={2} relaxed='very'>
                        <Grid.Column>
                            <p>Players: </p>
                            <ul>
                                {this.state.game && this.state.game.users ?
                                    this.state.game.users.map((value, index) => {
                                        return <li key={index}>{value.name === this.props.name ? value.name + " (You)" : value.name}</li>
                                    })
                                    :
                                    <li>None</li>
                                }
                            </ul>
                            {turnBased ?
                                <p style={{ color: "gray" }}>It is {this.state.currentTurn}'s turn</p>
                                :
                                <span />
                            }
                        </Grid.Column>
                        <Grid.Column>
                            <p>Game id:</p>
                            <ul>
                                <li>{this.props.gameId}</li>
                            </ul>
                            {this.state.message && <p style={{ color: "gray", fontSize: "18px" }}>{this.state.message}</p>}
                            {document.queryCommandSupported('copy') &&
                                <Button basic color='blue' onClick={() => this.copyToClipboard(this.props.gameId)}>
                                    <Button.Content>Copy to Clipboard</Button.Content>
                                </Button>
                            }
                            <form style={{ visibility: "hidden" }}>
                                <textarea
                                    ref={(textarea) => this.textArea = textarea}
                                    value={this.props.gameId}
                                />
                            </form>
                        </Grid.Column>
                    </Grid>

                    <Divider vertical hidden />
                </Segment>
                <Modal open={this.state.modal} onClose={this.closeModal} dimmer="inverted">
                    <Modal.Header>Settings</Modal.Header>
                    <Modal.Content>
                        <Popup
                            trigger={<span style={{ marginRight: "2em", position: "relative", bottom: ".25em" }}>Enforce turn-taking</span>}
                            content="When on, players must take turns typing in words."
                            basic
                        />
                        <Radio toggle checked={turnBased} onChange={() => changeTurnMode(this.props.gameId, turnBased)} />
                        <Divider hidden />
                        <Button onClick={this.closeModal}>Ok</Button>
                    </Modal.Content>
                </Modal>
            </Segment>
        );
    }
}
