import React, { Component } from 'react';
import { createUser, addWord, firebaseRef, createGame, getGame } from '../firebase';
import { Button, Container, Divider, Form, Grid, Icon, Input, Label, Modal, Header, Segment, Radio, Popup } from 'semantic-ui-react';

export default class Story extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inverted: this.props.inverted,
            game: {},
            story: "",
            currentInput: "",
            modal: false,
            turnBased: false,
            currentTurn: this.props.name
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
            this.setState({ game: json[this.props.gameId] }, this.setStory);
        });
    }

    setStory = () => {
        // append array of words into a single "story" string
        if (this.state.game && this.state.game.story) {
            let story = this.state.game.story;
            let storyString = "";
            for (let word of Object.values(story)) {
                storyString += word.value + " ";
            }
            this.setState({ story: storyString }, this.calculateTurn);
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
    changeTurnMode = (e, { value }) => this.setState(prevState => ({ turnBased: !prevState.turnBased }));
    calculateTurn = () => {
        let game = this.state.game;
        let currentTurn = game.users[game.turn % game.players].name;
        this.setState({currentTurn});
    }
    // startGame = () => this.setState({ started: true });

    render() {
        console.log(this.state);
        return (
            <Segment inverted={this.props.inverted}>
                <Button circular icon='setting' floated="right" onClick={this.openModal} />
                <p style={{ marginTop: "1em" }}>
                    {this.state.story || <span style={{ color: "gray" }}>Enter a word to start the story off!</span>}
                </p>
                <p>{this.state.turnBased ? "turn" : "free-for-all"}</p>
                <Form>
                    <Form.Field fluid>
                        <Input placeholder='Enter a word...' className="margin" onChange={this.handleInput} value={this.state.currentInput} />
                    </Form.Field>
                    <Button animated inverted color='blue' onClick={this.addToStory} disabled={this.state.currentTurn !== this.props.name}>
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
                            {this.state.turnBased ?
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
                        <Radio toggle value={true} checked={this.state.turnBased} onChange={this.changeTurnMode} />
                        <Divider hidden />
                        <Button onClick={this.closeModal}>Ok</Button>
                    </Modal.Content>
                </Modal>
            </Segment>
        );
    }
}
