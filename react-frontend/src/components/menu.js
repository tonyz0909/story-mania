import React, { Component } from 'react';
import { Header, Icon, Menu, Modal } from 'semantic-ui-react';

export default class MenuBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inverted: false,
            visible: false,
            modal: false
        };
    }

    componentDidMount() {
    }

    refreshPage = () => window.location.reload();
    openModal = () => this.setState({ modal: true });
    closeModal = () => this.setState({ modal: false });

    render() {
        const { visible } = this.state;

        return (
            <div>
                <Menu inverted={this.state.inverted} size='massive'>
                    <Menu.Item name='Story Mania' onClick={this.refreshPage}/>
                    <Menu.Menu position='right'>
                        <Menu.Item name='About' onClick={this.openModal} ><Icon name='info circle' /></Menu.Item>
                    </Menu.Menu>
                </Menu>
                <Modal open={this.state.modal} onClose={this.closeModal} >
                    <Modal.Header>About this game</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Header>Story Mania</Header>
                            <p>asdfasdfadsf</p>
                        </Modal.Description>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}
