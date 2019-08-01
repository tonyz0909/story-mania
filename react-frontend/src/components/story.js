import React, { Component } from 'react';
import { getFirebase, addWord, firebaseRef } from '../firebase';
import { Button, Container, Form, Icon, Input, Segment, Radio } from 'semantic-ui-react';

export default class Story extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inverted: this.props.inverted,
            game: {},
            story: "",
            currentInput: "",
            gameId: this.props.gameId,
            name: ""
        };
    }

    componentDidMount() {
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

    handleInput = (e, data) => this.setState({ currentInput: data.value });
    startGame = () => this.setState({ started: true });

    render() {
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
