import React, { Component } from 'react';
import {Container, Button, Typography } from '@material-ui/core';

const { ipcRenderer } = window.require("electron");

export class Anonimizer extends Component {

    doAnonimization() {
        
        let [res, resOut, anonDir] = ipcRenderer.sendSync('condaAnonimizeRequest', this.props.files, null);
        this.props.onAnonDirChange(anonDir)
    }



    render() {
        return (
            <Container>
                <Button variant="contained" color="secondary" className="buttonSecondary" onClick={() => this.doAnonimization() }>
                    Perform anonimization
                </Button>                    
                <Typography>Anonimized files are in: {this.props.anonDir}</Typography>
            </Container>
  
        )
    }

}