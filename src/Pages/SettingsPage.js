import React, { Component } from 'react';

import AppBar from '../Components/AppBar';
import {CssBaseline, Container } from '@material-ui/core';

export class SettingsPage extends Component {
    constructor() {
        super();
        this.state = {
            files: [],
            pacs: '',
            output: "",
        };
    }

    render() {
        return (
            <CssBaseline>
                <AppBar page="Data selection" history={this.props.history} />
                <Container></Container>            
            </CssBaseline>                
        )
    }
}