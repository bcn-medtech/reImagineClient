import React, { Component } from 'react';

import {Grid, Typography, Container, Button} from '@material-ui/core';
import {List, ListItem, ListItemText, ListItemSecondaryAction} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

const { ipcRenderer } = window.require("electron");

const statusMessages = [
    ["No credentials to upload files!","Credentials are ok"],
    ["User is not logged in the ReImage platform!", "Logged into the ReImage platform"],
    ["Please install 3rd party applications!", "All external programs correctly installed"]
]

const messageColors = [
    ["red","green"],["red","green"],["red","green"]]

export class Filer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appStatus: [],
            statusCodes: []
        };
    }
    
    componentDidMount() {
        //ipcRenderer.on('onDirSelection', (event, arg) => this.setState({files: this.state.files.concat([arg])}))
        ipcRenderer.on('onDirSelection', (event, arg) => this.props.onFilesChange(this.props.files.concat([arg])))
        ipcRenderer.on('onStatusUpdate', (event, arg) => this._changeStatusListener(arg))
        
        //Update status
        ipcRenderer.send('checkStatus')
        let testProcess = ["/home/gerardgarcia/Documents/toAnonimize/1.2.124.113532.159.237.137.76.20020826.93757.32838/1.3.12.2.1107.5.1.4.24550.2.0.810657717422047"]
        this.props.onFilesChange(testProcess)

    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners()
    }

    _changeStatusListener(arg) {
        
        this.setState({appStatus: arg})

        var data = []

        data.push(this.state.appStatus.creds? 1: 0);
        data.push(this.state.appStatus.logged_in? 1: 0);
        data.push(this.state.appStatus.thirdparty_installed? 1: 0);
        
        this.setState({statusCodes: data})
        
    }

    isStatusOk() {
        return this.state.appStatus.thirdparty_installed && this.state.appStatus.logged_in && this.state.appStatus.creds
    }

    renderStatus() {
        return this.state.statusCodes.map((value, index) => 
                    <Grid item key={index} xs={12} sm={3}>
                        <Typography style={{fontWeight:"bold", color: messageColors[index][value? 1: 0]}}> 
                            {statusMessages[index][value? 1: 0]} 
                        </Typography>
                    </Grid>
                );
    
    }

    renderFiler() {
      
        var filer = (
            <Grid>
                <Typography>Choose a directory to load from...</Typography>
                <Button variant="contained" color="secondary" className="buttonSecondary" onClick={
                        () => ipcRenderer.send("select-dirs")
                        }>Add directory</Button>
            </Grid>
        );

        return filer;
        
    }

    deleteItemFromFiles(idx){
        let list = this.props.files;
        list.splice(idx, 1);
        this.props.onFilesChange(list)
    }

    renderSelectedFiles() {
        const files = this.props.files
        if (!files) return null

        return (
            <List dense={true}>
            {
                files.map((value, idx) => {
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
        
        </Container>                                        
         )
       
        }    

}
