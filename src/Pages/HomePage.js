import React, { Component } from 'react';

import AppBar from '../Components/AppBar';
import {CssBaseline, Grid, Paper, Typography} from '@material-ui/core';

const { ipcRenderer } = window.require("electron");

export class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            thirdparty_installed: false,
            logged_in: false,  
            creds: false,              
            files: []
        };
    }
    
    componentDidMount() {
        console.log("Home page mounted");
        //Update status

    }

    isStatusOk() {
        var clean=true;
        console.log("Checking app status");
        if (!this.state.creds) clean = false;
        if (!this.state.logged_in) clean = false;
        if (!this.state.thirdparty_installed) clean = false;        

        return clean;
    }

    renderStatus() {
        var data = [];

        if (!this.state.thirdparty_installed) data.push("Please install 3rd party applications!");
        if (!this.state.logged_in) data.push("Use has not logon on the platform!");
        if (!this.state.creds) data.push("No credentials to upload files!");
    
        if ( this.isStatusOk() && (data.length == 0) ) return (
            <Grid item xs={12} sm={3}>
                <Typography> All is okay </Typography>
            </Grid>
        );
     
        return data.map((value, index) => 
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
            filer = "";
        }

        return filer;
        
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
                    
                                        
            </CssBaseline>                    
        )
       
    }
}
