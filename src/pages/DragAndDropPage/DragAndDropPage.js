import React, { Component } from 'react';

//import AppBar_Component from './../../Components/AppBar_Component/AppBar_Component';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import { Grid, ListItem, Typography, List, ListItemText } from '@material-ui/core';
const { ipcRenderer } = window.require("electron");


export class DragAndDropPage extends Component {
    constructor() {
        super();
        this.state = {
            files: false,
            loading: false,
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
                                <ListItem key={idx}>
                                    <ListItemText key={idx} primary={value} />
                                    <img className="ThumbnailStyle" src={value} />
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

            let files = [];

            for (let f of e.dataTransfer.files) {
                console.log('File(s) you dragged here: ', f.path)
                files.push(f.path);
            }
            if (this.state.files !== false) {
                let auxArr = this.state.files;
                auxArr.push(files);
                this.setState({ files: files });
                localStorage.setItem('files', files.toString());
                console.log(localStorage.getItem('files'));
            }
            else {
                this.setState({ files: files });
                localStorage.setItem('files', files.toString());
                console.log(localStorage.getItem('files'));
            }
            ipcRenderer.send('Files_to_Anonimize', this.state.files);

            return false;
        };
    }


    handleState() {

    }

    To_Anonimize() {

            new Promise(resolve => {
                ipcRenderer.send('Miniconda_Request');
                ipcRenderer.on('RequestSol', (event, arg) => {
                    if (arg !== null) {
                    console.log(arg.toString());
                    resolve(arg);
                }
                console.log(localStorage.getItem('files'));
                ipcRenderer.send('Miniconda_Install', arg, localStorage.getItem('files'), () => {
                    this.setState({loading:true});
                });
                ipcRenderer.on('finished_deid', (event, arg) => {
                    console.log(arg.toString());
                })
            })
        })
    }

    render() {
        console.log(this.state.loading);
        return (
                <CssBaseline>

                    <AppBar />
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