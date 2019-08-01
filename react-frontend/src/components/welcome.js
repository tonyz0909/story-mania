import React, { Component } from 'react';
import { getFirebase, addWord, firebaseRef } from '../firebase';
import { Button, Container, Form, Icon, Input, Segment, Radio } from 'semantic-ui-react';

export default class Welcome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inverted: this.props.inverted,
            gameId: "",
            name: ""
        };
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
    handleInput = (e, data) => this.setState({ currentInput: data.value });
    handleGameId = (e, data) => this.setState({ gameId: data.value });
    startGame = () => this.setState({ started: true });

    render() {
        return (
            <Segment inverted={this.props.inverted}>
                <Form>
                    <Form.Field fluid>
                        <Input placeholder='Enter game id...' className="margin" onChange={this.handleGameId} value={this.state.gameId} />
                    </Form.Field>
                    <Button animated inverted color='blue' onClick={() => this.props.setGameId(this.state.gameId)}>
                        <Button.Content visible>Join</Button.Content>
                        <Button.Content hidden>
                            <Icon name='arrow right' />
                        </Button.Content>
                    </Button>
                </Form>
            </Segment>
        );
    }
}
