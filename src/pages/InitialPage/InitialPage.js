import React, { Component } from 'react';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

// Components
import AppBar from './../../Components/AppBar/AppBar';
import ReactReveal from './../../Components/animatedList/animatedList';

const { ipcRenderer } = window.require("electron");

export class InitialPage extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        localStorage.setItem('started', true);
    }

    render() {
        console.log(this.props);
        console.log(this.props.history);
        return (
            <CssBaseline>
                <AppBar page="Deid App" history={this.props.history} />
                <Container fixed>
                    <Container container maxWidth="sm">
                        <ReactReveal history={this.props.history}/>
                    </Container>
                </Container>
            </CssBaseline>
        )
    }
}

const style = {
    reveal: {
        maxWidth: '100px',
        maxHeight: '100px',
    }
}