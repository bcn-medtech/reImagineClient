import React, { Component } from 'react';

//import AppBar_Component from './../../Components/AppBar_Component/AppBar_Component';
import Horizontal from '../Components/horizBar';
import AppBar from '../Components/AppBar';
import {CssBaseline, Container, Grid, ListItem, Typography, Paper, Button, Input } from '@material-ui/core';
import {List, ListItemText, Avatar, ListItemAvatar, ListItemSecondaryAction} from '@material-ui/core';

import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

const { ipcRenderer } = window.require("electron");


export class DragAndDropPage extends Component {
    constructor() {
        super();
        this.state = {
            files: [],
            pacs: '',
            output: "",
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
                                    <ListItemAvatar>
                                        <Avatar>
                                        <FolderIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography>{idx+1}:&nbsp;{value}</Typography>}
                                        style={{'word-break': 'break-all'}}
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
            )
        }
    }

    deleteItemFromFiles(idx){
        let list = this.state.files;
        list.splice(idx, 1);
        this.setState({files: list})
        localStorage.setItem('files', list);
    }
    componentDidMount() {
        //Load files stored in past
        let storage = localStorage.getItem('files');
        console.log("Storage", storage)
        if(storage === null){
            localStorage.setItem('files', "");
            this.setState({files: false})
        }else{
            let arr = storage.split(",");
            if(arr[0] === ""){
                arr.splice(0,1);
            }
            this.setState({files: arr})
        }
        
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
                this.setState({ files: auxArr });
                localStorage.setItem('files', auxArr.toString());
            }
            else {
                this.setState({ files: files });
                localStorage.setItem('files', files.toString());
            }
            
            console.log("On Storage",localStorage.getItem('files'));
            ipcRenderer.send('Files_to_Anonimize', this.state.files);

            return false;
        };
    }
    
    Anonimize(program) {
        let msg
        let flag = ipcRenderer.sendSync('Install_Check', [program.toLowerCase()]);
        if (!flag){
            alert(`Must install, ${program} needed`);
        }else{
            msg = ipcRenderer.sendSync('Conda_Script', flag, localStorage.getItem('files'), this.state.output);
            alert(msg);
        }
    }

    sendOrthanc() {
        if (this.state.files === false) {
            alert('Drag files.');
        }
        else {
            console.log("PreUpload:",this.state.pacs)
            ipcRenderer.send('CondaUpload', localStorage.getItem('files')+"output", this.state.pacs);
            ipcRenderer.on('uploaded', (event, arg) => {
                console.log('uploaded');
            })
            localStorage.removeItem('files');
        }
    }
    removePendingFiles(){
        localStorage.removeItem('files');
        this.setState({files: []})
    }
    pacsValue(value) {
            console.log("On drag",value);
            //console.log(this.state.pacs);
            this.setState({ pacs: value })
    }

    outputValue(event) {
        console.log("On fill",event.target.value );
        this.setState({ output: event.target.value })
}

    render() {
        return (
            <CssBaseline>
                <AppBar page="Anonimizer" history={this.props.history} />
                <Container fixed>
                    <Container container maxWidth="sm" >
                        <Grid container id="dropbox" >
                            <div style={styles.dragDropStyle} className="draggable">
                                <Paper elevation={4} /* className={classes.paperClone} */ style={{ height: '200px', textAlign: 'center', paddingTop: '80px'}}>
                                    DRAG .dcm FILES HERE
                                </Paper>
                            </div>
                        </Grid>
                        <Grid>
                            <Typography style={{fontWeight:"bold"}}>Step 1</Typography>
                            <Typography>Choose a path to store the anonimized files:</Typography>
                            <Input placeholder="Output path..." fullWidth="true" onChange={(event) => this.outputValue(event)}/>
                            <Button disabled={this.state.output.length === 0 || this.state.files.length === 0} variant="contained" color="primary" className="buttonPrimary" onClick={() => this.Anonimize('conda')}>Anonimize</Button>
                        </Grid>
                        <br/>
                        <Grid fullWidth="true" style={{borderTop:"2px"}}>
                            <Typography style={{fontWeight:"bold"}}>Step 2</Typography>
                            <Horizontal pacsValue={this.pacsValue.bind(this)} />
                            <Button variant="contained" color="secondary" className="buttonSecondary" onClick={() => this.sendOrthanc()}>Send Orthanc</Button>
                            
                            <Grid style={{marginTop: '30px' }} item xs={12} md={6}>
                                <Typography style={{ textAlign: "left"}}>
                                    Selected Files
                                </Typography>
                                <div>
                                    {this.mapper(this.state.files)}
                                </div>
                            </Grid>
                        </Grid>
                    </Container>
                    <Button variant="contained" color="secondary" className="buttonSecondary" onClick={() => this.removePendingFiles()}>Remove Pending Files</Button>
                </Container>
            </CssBaseline >
        )
    }
}
const styles = {
    dragDropStyle: {
        position: 'relative',
        'margin-right': 'auto',
        'margin-left': 'auto',
        width: '100%',
        'margin-bottom': '20px',
        'margin-top': '15px',
    },
}