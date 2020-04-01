import React, { Component } from 'react';

import AppBar from '../Components/AppBar';
import {CssBaseline, Grid, Paper, Typography, Input, Button} from '@material-ui/core';
import {List, ListItem, ListItemText, ListItemSecondaryAction} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

const { ipcRenderer } = window.require("electron");

export class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            appStatus: [],
            appStatusDescr: [],
            files: []
        };
        this._userSelectedDirListener = this._userSelectedDirListener.bind(this)
        this._changeStatusListener = this._changeStatusListener.bind(this)        
        this._changeFilesListener = this._changeFilesListener.bind(this)
    }
    
    componentDidMount() {
        console.log("Home page mounted");
        ipcRenderer.on('onDirSelection', this._userSelectedDirListener)
        ipcRenderer.on('onStatusUpdate', this._changeStatusListener)        
        ipcRenderer.on('onFilesChanged', this._changeFilesListener)                
        
        //Update status
        ipcRenderer.send('checkStatus')
        ipcRenderer.send('getFiles')        
    }

    componentWillUnmount() {
        ipcRenderer.removeListener('onDirSelection', this._userSelectedDirListener)
        ipcRenderer.removeListener('onStatusUpdate', this._changeStatusListener)
        ipcRenderer.removeListener('onFilesChanged', this._changeFilesListener)        

    }

    _changeFilesListener(event, arg) {
        this.setState({files: arg})
    }


    _userSelectedDirListener(event, arg) {
        this.setState({files: this.state.files.concat([arg])})
    }

    _changeStatusListener(event, arg) {
        
        this.setState({appStatus: arg})

        var data = []
        var clean = true

        if (!this.state.appStatus.creds) {
            clean = false; 
            data.push("No credentials to upload files!");
        }
        if (!this.state.appStatus.logged_in) {
            clean = false;
            data.push("Use has not logon on the platform!");
        }
        if (!this.state.appStatus.thirdparty_installed) {
            clean = false; 
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

    render() {
        return (
            <CssBaseline>
                <AppBar page="Data selection" history={this.props.history} />
                <h1>Welcome to ReImagine client!</h1> 
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
                <Button variant="contained" color="secondary" className="buttonSecondary" onClick={() => {
                                    ipcRenderer.send("onFilesUpdate", this.state.files)
                                    this.props.history.push('/Uploader')
                                    }
                    }>
                    NEXT>></Button>                                
                    
                                        
            </CssBaseline>                    
        )
       
    }
}
