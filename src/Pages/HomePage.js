import React, { Component } from 'react';

import AppBar from '../Components/AppBar';
import {CssBaseline, Grid, Paper, Typography, Input, Button} from '@material-ui/core';

const { ipcRenderer } = window.require("electron");

export class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            appStatus: [],
            appStatusDescr: [],
            files: []
        };
    }
    
    componentDidMount() {
        console.log("Home page mounted");
        //Update status
        this.checkStatus()

    }

    checkStatus() {
        this.setState({appStatus: ipcRenderer.sendSync('checkStatus')})
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
        return this.state.thirdparty_installed && this.state.logged_in && this.state.creds
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
                    <Typography style={{fontWeight:"bold"}}>Add files for processing</Typography>
                    <Typography>Choose a directory to load</Typography>
                    <Input webkitdirectory="true" type="file"/>
                </Grid>
            );
        }

        return filer;
        
    }

    renderSelectedFiled() {
        return null;
        /*
        return (
            <Grid fullWidth="true" style={{borderTop:"2px"}}>
            <Typography style={{fontWeight:"bold"}}>Step 2</Typography>
            <Horizontal pacsValue={this.pacsValue.bind(this)} />
            <Button variant="contained" color="secondary" className="buttonSecondary" onClick={() => this.sendOrthanc()}>Send Orthanc</Button>
            <Button variant="contained" color="secondary" className="buttonSecondary" onClick={() => this.sendMinio()}>Send to S3 bucket</Button>
        
            <Grid style={{marginTop: '30px' }} item xs={12} md={6}>
                <Typography style={{ textAlign: "left"}}>
                    Selected Files
                </Typography>
                <div>
                    {this.mapper(this.state.files)}
                </div>
            </Grid>
            </Grid>                
        );*/
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
                    {this.renderSelectedFiled()}
                </Grid>                
                    
                                        
            </CssBaseline>                    
        )
       
    }
}
