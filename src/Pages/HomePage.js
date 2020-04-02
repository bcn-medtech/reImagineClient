import React, { Component } from 'react';

import AppBar from '../Components/AppBar';
import {CssBaseline, Grid, Paper, Typography, Container, Button} from '@material-ui/core';
import {List, ListItem, ListItemText, ListItemSecondaryAction} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

const { ipcRenderer } = window.require("electron");

const styles = {
    fxb: {
      display: "flex",
      flex_direction: "row",
    }
}

export class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appStatus: [],
            appStatusDescr: [],
            files: []
        };
    }
    
    componentDidMount() {
        ipcRenderer.on('onDirSelection', (event, arg) => this.setState({files: this.state.files.concat([arg])}))
        ipcRenderer.on('onStatusUpdate', (event, arg) => this._changeStatusListener(arg))
        
        //Update status
        ipcRenderer.send('checkStatus')
        let testProcess = ["/home/gerardgarcia/Documents/toAnonimize/1.2.124.113532.159.237.137.76.20020826.93757.32838/1.3.12.2.1107.5.1.4.24550.2.0.810657717422047"]
        this.setState({files: testProcess})
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners()
    }

    _changeStatusListener(arg) {
        
        this.setState({appStatus: arg})

        var data = []

        if (!this.state.appStatus.creds) {
            data.push("No credentials to upload files!");
        }
        if (!this.state.appStatus.logged_in) {
            data.push("Use has not logon on the platform!");
        }
        if (!this.state.appStatus.thirdparty_installed) {
            data.push("Please install 3rd party applications!");
        }
        this.setState({appStatusDescr: data})
        
    }

    isStatusOk() {
        //return this.state.appStatus.thirdparty_installed && this.state.appStatus.logged_in && this.state.appStatus.creds
        return true
    }

    renderStatus() {
        if ( this.isStatusOk() ) return (
            <Grid item xs={12} sm={3}>
                <Typography> All is okay </Typography>
            </Grid>
        );
     
        return this.state.appStatusDescr.map((value, index) => 
                    <Grid item key={index} xs={12} sm={3}>
                        <Typography style={{fontWeight:"bold", color: "red"}}> {value} </Typography>
                    </Grid>
                );
    
    }

    renderFiler() {
        var filer=(
            <Grid item>
                <Typography>File selection is disabled while there are status errors!</Typography>
            </Grid>
        );

        if (this.isStatusOk()) {
            filer = (
                <Grid>
                    <Typography>Choose a directory to load from...</Typography>
                    <Button variant="contained" color="secondary" className="buttonSecondary" onClick={
                            () => ipcRenderer.send("select-dirs")
                            }>Add directory</Button>
                </Grid>
            );
        }

        return filer;
        
    }

    deleteItemFromFiles(idx){
        let list = this.state.files;
        list.splice(idx, 1);
        this.setState({files: list})
    }

    renderSelectedFiles() {

        return (
            <List dense={true}>
            {
                this.state.files.map((value, idx) => {
                    return (
                        <ListItem key={idx}>
                            <ListItemText
                                primary={<Typography>{idx+1}:&nbsp;{value}</Typography>}
                                style={{wordBreak: 'break-all'}}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => this.deleteItemFromFiles(idx)}>
                                <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                })
            }
        </List>
        );
    }

    saveAndTransition(newRoute) {
        //ipcRenderer.send("onFilesUpdate", this.state.files)
        this.props.history.push(newRoute, {selectedFiles: this.state.files})
    }

    renderNavigationButtons() {
        let nav = {
            next: "/Anonimizer",
            prev: null
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
                <AppBar page="Data selection" history={this.props.history} />
                <Container>
                    <Grid container id="status_board">                
                        <Grid item key={0} xs={12} sm={3}>
                            <Typography style={{fontWeight:"bold", color: "black"}}> STATUS: </Typography> 
                        </Grid> 
                            {this.renderStatus()}
                    </Grid>                
                    <Grid container id="select_files">
                        {this.renderFiler()}
                    </Grid>
                    <Grid container id="file_list">
                        <Typography style={{fontWeight:"bold"}}>Selected files</Typography>                            
                        {this.renderSelectedFiles()}
                    </Grid>
                    {this.renderNavigationButtons()}
               
                </Container>                                        
            </CssBaseline>                    
        )
       
    }
}
