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

    handleGameId = (e, data) => this.setState({ gameId: data.value });
    handleName = (e, data) => this.setState({ name: data.value });

    render() {
        return (
            <Segment inverted={this.props.inverted}>
                <Form>
                    <Form.Field fluid>
                        <Input placeholder='Enter game id...' className="margin" onChange={this.handleGameId} value={this.state.gameId} />
                    </Form.Field>
                    <Form.Field fluid>
                        <Input placeholder='Enter name' className="margin" onChange={this.handleName} value={this.state.name} />
                    </Form.Field>
                    <Button animated inverted color='blue' onClick={() => this.props.setGameValues(this.state.gameId, this.state.name)}>
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
