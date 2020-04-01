import React, { Component } from 'react';

import AppBar from '../Components/AppBar';
import {CssBaseline, Container, Button } from '@material-ui/core';

const styles = {
    fxb: {
      display: "flex",
      flex_direction: "row",
    }
}

export class AnonimizerPage extends Component {
    constructor() {
        super();
        this.state = {
            files: [],
            pacs: '',
            output: "",
        };
    }

    saveAndTransition(newRoute) {
        this.props.history.push(newRoute)
    }

    renderNavigationButtons() {
        let nav = {
            next: "/Uploader",
            prev: "/"
        }
        let prevB = null
        let nextB = null
        if (nav.next) {
            nextB = (
                <Button variant="contained" color="secondary" className="buttonSecondary" onClick={() => this.saveAndTransition(nav.next) }>
                NEXT
                </Button>
            )
        }
        if (nav.prev) {
            prevB = (
                <Button variant="contained" color="secondary" className="buttonSecondary" onClick={() => this.saveAndTransition(nav.prev) }>
                PREV
                </Button>
            )
        }        
        return (
            <div style={styles.fxb}>
            <div>{prevB}</div>
            <div>{nextB}</div>
            </div>                            
        )
    }

    render() {
        return (
            <CssBaseline>
                <AppBar page="Anonimization" history={this.props.history} />
                <Container>This is the anonimizer</Container>
                {this.renderNavigationButtons()}                
            </CssBaseline>                
        )
    }
}