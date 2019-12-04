import React, { Component } from 'react';

//import AppBar_Component from './../../Components/AppBar_Component/AppBar_Component';
import Horizontal from '../../Components/horizBar/horizBar';
import AppBar from '../../Components/AppBar/AppBar';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import { Grid, ListItem, Typography, List, ListItemText, Paper } from '@material-ui/core';
const { ipcRenderer } = window.require("electron");


export class DragAndDropPage extends Component {
    constructor() {
        super();
        this.state = {
            files: false,
            pacs: false,
        };
    }

    mapper(files) {
        if (files !== false) {

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


    Anonimize(program) {

        ipcRenderer.send('Install_Request', [program.toLowerCase()]);
        ipcRenderer.on('InstallAnswer', (event, arg) => {
            console.log(arg);
            if (arg === false) {
                alert(`Must install ${program} needed`);
            }
            else {
                console.log(arg);
                ipcRenderer.send('Conda_Script', arg, localStorage.getItem('files'));
                ipcRenderer.on('finished_deid', (event, arg) => {
                    console.log('finished');
                });
            }
            ipcRenderer.send('Conda_Script', arg, localStorage.getItem('files'));
            ipcRenderer.on('finished_deid', (event, arg) => {
                console.log('finished');
            })
        });
    }

    sendOrthanc() {
        if (this.state.pacs === false) {
            alert('select pacs');
        }
        else {
            ipcRenderer.send('CondaUpload', localStorage.getItem('files'), this.state.pacs.toString());
            ipcRenderer.on('uploaded', (event, arg) => {
                console.log('uploaded');
            })
            localStorage.removeItem('files');
        }
    }

    pacsValue(value) {
            console.log(value);
            console.log(this.state.pacs);
            this.setState({ pacs: value })
    }


    render() {

        const dragDropStyle = {
            position: 'relative',
            'margin-right': 'auto',
            'margin-left': 'auto',
            height: '200px',
            width: '700px',
            'margin-bottom': '20px',
            'margin-top': '15px',

        }
        return (
            <CssBaseline>

                <AppBar page="Anonimizer" history={this.props.history} />
                <Container fixed>
                    <Container container maxWidth="sm" >
                        <Grid container id="dropbox" >
                            <div style={dragDropStyle} className="draggable">
                                <Paper elevation={4} /* className={classes.paperClone} */ style={{ height: '200px', width: '400px', textAlign: 'center' }}>
                                    drag files here
                                </Paper>
                            </div>
                        </Grid>
                        <Horizontal pacsValue={this.pacsValue.bind(this)} />
                        <div style={{ margin: 'auto' }}>
                            <Button variant="contained" color="primary" className="buttonPrimary" onClick={() => this.Anonimize('conda')}>Anonimize</Button>
                            <Button variant="contained" color="secondary" className="buttonSecondary" onClick={() => this.sendOrthanc()}>Send Orthanc</Button>
                        </div>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography style={{ textAlign: "left", marginTop: '5px' }}>
                                    Selected Files
                                </Typography>
                                <div>
                                    {this.mapper(this.state.files)}
                                </div>
                            </Grid>
                        </Grid>
                    </Container>
                </Container>
            </CssBaseline >
        )
    }
}