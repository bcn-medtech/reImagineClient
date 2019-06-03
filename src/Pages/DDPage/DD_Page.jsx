import React, { Component } from 'react';
import './DD_Page.css';
import AppBar_Component from './../../Components/AppBar_Component/AppBar_Component';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Grid, ListItem, Typography, List, ListItemText } from '@material-ui/core';
const { ipcRenderer } = window.require("electron");
/* 
grid
list
typografy
ListItem

*/


export class DDPage extends Component {
    constructor() {
        super();
        this.state = {
            files: false
        };
    }

    mapper(files) {
        if (files != false) {

            console.log(files);
            return (
                <List dense={true}>
                {
                    files.map((value, idx) => {
                        console.log(value);
                        return (
                            <ListItem >
                                <ListItemText key={idx} primary={value} />
                                <img className="ThumbnailStyle" src={value}/>
                            </ListItem>
                        )   
                    })
                }
                </List>
            )
        }   
    }

    componentDidMount() {

        var holder = document.getElementById('dropbox');

        holder.ondragover = () => {
            return false;
        };
  
        holder.ondragleave = () => {
            return false;
        };
  
        holder.ondragend = () => {
            return false;
        };
  
        holder.ondrop = (e) => {
            e.preventDefault();
  
            let files=[];
  
            for (let f of e.dataTransfer.files) {
                console.log('File(s) you dragged here: ', f.path)
                files.push(f.path);
            }
            if (this.state.files != false) {
                let auxArr = this.state.files;
                auxArr.push(files);
                this.setState({files:files});
            }
            else this.setState({files:files});
  
            return false;
        }; 
    }

    To_Anonimize() {
        ipcRenderer.send('execute-python','hello');
        ipcRenderer.on('executed-response',(event,arg) => {
            alert(`response of python script: ${arg.toString()}`);
        });
    }

    render() {
        return(
            <CssBaseline>
                <AppBar_Component/>
                    <Container fixed>
                        <Container container maxWidth="sm" >
                            <Grid container id="dropbox" >
                                <div className="draggable">drag files here</div>
                            </Grid>
                        </Container>
                        <Button variant="contained" color="primary" className="buttonPrimary" onClick={this.To_Anonimize}>Anonimize</Button>
                        <Button variant="contained" color="secondary" className="buttonSecondary">Send Orthanc</Button>
                    </Container>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography>
                                Selected Files
                            </Typography>
                            <div>
                                {this.mapper(this.state.files)}
                            </div>
                        </Grid>
                    </Grid>
            </CssBaseline>
        )
    }
}