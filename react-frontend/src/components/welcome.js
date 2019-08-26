import React, { Component } from 'react';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { getFirebase, addWord, firebaseRef } from '../firebase';
import { Button, Container, Divider, Form, Grid, Header, Icon, Input, Search, Segment, Radio } from 'semantic-ui-react';
import '../animations.css';

export default class Welcome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inverted: this.props.inverted,
            gameId: "",
            name: ""
        };
    }

    handleGameId = (e, data) => this.setState({ gameId: data.value });
    handleName = (e, data) => this.setState({ name: data.value });
    submit = (type) => {
        if (type == "create") {
            if (this.state.name != "") this.props.setGameValues(this.state.gameId, this.state.name);
            else alert("please enter your name");
        } else if (type == "join") {
            if (this.state.name != "" && this.state.gameId != "") this.props.setGameValues(this.state.gameId, this.state.name);
            else alert("Please enter a game id and your name");
        }
    }

    render() {
        return (
            <Segment inverted={this.props.inverted}>
                <Grid columns={2} stackable textAlign='center'>
                    <Divider vertical inverted={this.props.inverted}>Or</Divider>

                    <Grid.Row verticalAlign='middle'>
                        <Grid.Column>
                            <Header icon inverted={this.props.inverted}>
                                <Icon name='search' />
                                Join an Existing Game
                            </Header>
                            <Form>
                                <Form.Field fluid>
                                    <Input placeholder='Enter game id' className="margin" onChange={this.handleGameId} value={this.state.gameId} />
                                </Form.Field>
                                <Form.Field fluid>
                                    <Input placeholder='Enter name' className="margin" onChange={this.handleName} />
                                </Form.Field>
                                <Button animated inverted color='blue' onClick={() => this.submit("join")}>
                                    <Button.Content visible>Join</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='arrow right' />
                                    </Button.Content>
                                </Button>
                            </Form>
                        </Grid.Column>

                        <Grid.Column>
                            <Header icon inverted={this.props.inverted}>
                                <Icon name='world' />
                                Create A New Game
                            </Header>
                            <Form>
                                <Form.Field fluid>
                                    <Input placeholder='Enter name' className="margin" onChange={this.handleName} />
                                </Form.Field>
                                <Button animated inverted color='blue' onClick={() => this.submit("create")}>
                                    <Button.Content visible>Create</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='arrow right' />
                                    </Button.Content>
                                </Button>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
}
