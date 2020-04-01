import React, {Component} from 'react';
//import { Container, makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box'
import Tabs from '../Components/Tabs';
import AppBar from '../Components/AppBar';
import {CssBaseline, Container } from '@material-ui/core';

export class InstallersPage extends Component {
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
                <AppBar page="Installers" history={this.props.history} />
                <Container></Container>            
            </CssBaseline>                
        )
    }
}