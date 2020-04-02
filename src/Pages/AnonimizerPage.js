import React, { Component } from 'react';
import AppBar from '../Components/AppBar';
import {CssBaseline, Container, Button, Typography } from '@material-ui/core';

const { ipcRenderer } = window.require("electron");

const styles = {
    fxb: {
      display: "flex",
      flex_direction: "row",
    }
}

export class AnonimizerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            anonResultDir: null
        };
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners()
    }

    componentDidMount() {
               
        //console.log(callerState.selectedFiles)
        //Register handler to receive files from main process
        //ipcRenderer.on('onFilesChanged', (event, result) => {
        //    this.setState({files: result})
        //})
        
        //Ask main process to send files
        //ipcRenderer.send('getFiles')

        this.setState({files: this.props.location.state.selectedFiles})
    }

    saveAndTransition(newRoute) {
        this.props.history.push(newRoute, {anonResultDir: this.state.anonResultDir})
    }

    doAnonimization() {
        
        let errs = ipcRenderer.sendSync('Install_Check', ["conda"]);
        if (errs){
            console.log(errs)
            alert("Could not find thirdparty software conda. Plase reinstall it!");
        }
        let [res, resOut, anonDir] = ipcRenderer.sendSync('condaAnonimizeRequest', this.state.files, null);
        console.log(resOut);
        this.setState({anonResultDir :anonDir})
    }


    renderFiles() {
        if (!this.state.files) {
            return null
        }

        return (
            <div>
                <Typography>Files to anonimize:</Typography>
                {
                this.state.files.map((value, idx) => {
                    return <Typography key={idx}>{value}</Typography>
                })
                }        
            </div>                    
        )
                
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
                <Container>
                    {this.renderFiles()}
                    <Button variant="contained" color="secondary" className="buttonSecondary" onClick={() => this.doAnonimization() }>
                        Perform anonimization
                    </Button>                    
                </Container>
                {this.renderNavigationButtons()}                
            </CssBaseline>                
        )
    }
}