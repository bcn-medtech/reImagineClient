import React, { Component } from 'react';

//import AppBar_Component from './../../Components/AppBar_Component/AppBar_Component';
import Horizontal from '../Components/horizBar';
import AppBar from '../Components/AppBar';
import {CssBaseline, Container, Grid, ListItem, Typography, Paper, Button, Input } from '@material-ui/core';
import {List, ListItemText, Avatar, ListItemAvatar, ListItemSecondaryAction} from '@material-ui/core';

import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const { ipcRenderer } = window.require("electron");


export class UploaderPage extends Component {
    constructor() {
        super();
        this.state = {
            files: [],
            serverType: "minio"
        };
        this._changeFilesListener = this._changeFilesListener.bind(this)        
    }

    componentWillUnmount() {
        ipcRenderer.removeListener('onFilesChanged', this._changeFilesListener)  
    }

    componentDidMount() {
        ipcRenderer.on('onFilesChanged', this._changeFilesListener)                
        ipcRenderer.send('getFiles')                
    }

    _changeFilesListener(event, arg) {
        console.log("Files changed!"+arg)
    }


    onServerTypeChanged(event) {
        this.setState({serverType: event.target.value})
    }

    render() {
        return (
            <CssBaseline>
                <AppBar page="Uploader" history={this.props.history} />
                <FormControl component="fieldset">
                    <FormLabel component="legend"> Select server type for upload </FormLabel>
                    <RadioGroup value={this.state.serverType} onChange={(event) => this.onServerTypeChanged(event)}>
                        <FormControlLabel value="pacs" control={<Radio/>} label="PACS" />
                        <FormControlLabel value="minio" control={<Radio/>} label="MINIO" />
                    </RadioGroup>
                </FormControl>   
                <Button variant="contained" color="secondary" className="buttonSecondary" onClick={() => this.props.history.push('/')}>  HOME </Button>                                                      
            </CssBaseline >
        )
    }
}
