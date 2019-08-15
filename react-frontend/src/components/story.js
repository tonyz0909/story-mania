import React, { Component } from 'react';
import { createUser, addWord, firebaseRef, createGame, getGame } from '../firebase';
import { Button, Container, Divider, Form, Grid, Icon, Input, Segment, Radio } from 'semantic-ui-react';

export default class Story extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inverted: this.props.inverted,
            game: {},
            story: "",
            currentInput: "",
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
            this.setState({ story: storyString }, () => console.log(this.state.story));
        }
    }

    addToStory = () => {
        console.log(this.props.gameId);
        addWord(this.props.gameId, this.props.name, this.state.currentInput); //"-Ll2kMaVAN7LeHFGpO8f"
        this.setState({ currentInput: '' });
    }

    handleInput = (e, data) => this.setState({ currentInput: data.value });
    // startGame = () => this.setState({ started: true });

    render() {
        console.log(this.state);
        return (
            <Segment inverted={this.props.inverted}>
                <Form>
                    <Form.Field fluid>
                        <Input placeholder='Enter a word...' className="margin" onChange={this.handleInput} value={this.state.currentInput} />
                    </Form.Field>
                    <Button animated inverted color='blue' onClick={this.addToStory}>
                        <Button.Content visible>Add</Button.Content>
                        <Button.Content hidden>
                            <Icon name='arrow right' />
                        </Button.Content>
                    </Button>
                </Form>
                <p style={{ marginTop: "1em" }}>
                    {this.state.story}
                </p>
                <Divider />
                <Segment>
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
                        </Grid.Column>
                        <Grid.Column>
                           <p>Game id:</p>
                           <ul>
                               <li>{this.props.gameId}</li>
                           </ul>
                        </Grid.Column>
                    </Grid>

                    <Divider vertical></Divider>
                </Segment>
                {/* <p style={{ marginTop: "1em" }}>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                        Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
                        ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
                        consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
                        In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
                        link mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
                        vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac,
                        enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla
                        ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue.
                        Curabitur ullamcorper ultricies nisi.
                    </p> */}
            </Segment>
        );
    }
}
