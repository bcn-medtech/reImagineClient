import React, { Component } from 'react';

//import AppBar_Component from './../../Components/AppBar_Component/AppBar_Component';
import Horizontal from '../Components/horizBar';
import AppBar from '../Components/TopBar';
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
            )
        }
    }

    
    componentDidMount() {
        console.log("Component did mount");
        //Load files stored in past
        let storage = this.getFilePaths();
        if(storage === null){
            this.saveFilePaths([])
            this.setState({files: false})
        }else{
            this.setState({files: storage})
        }
        
        var holder = document.getElementById('dropbox');
        holder.ondragover = () => {
            console.log("On drag over!");
            return false;
        };
        holder.ondragleave = () => {
            console.log("On drag leave!");
            return false;
        };
        holder.ondragend = () => {
            console.log("On drag end!");
            return false;
        };
        holder.ondrop = (e) => {
            console.log("On Drop!");
            e.preventDefault();
            
            let files = [];

            for (let f of e.dataTransfer.files) {
                console.log('File(s) you dragged here: ', f.path)
                files.push(f.path);
            }
            
            if (this.state.files !== false) {
                let auxArr = this.state.files;
                files.map((file)=>{
                    auxArr.push(file);
                    return true;
                })
                this.setState({ files: auxArr });
                this.saveFilePaths(auxArr)
            } else {
                this.setState({ files: files });
                this.saveFilePaths(files)
            }
            
            console.log("On Storage",this.getFilePaths());
            ipcRenderer.send('Files_to_Anonimize', this.state.files);

            return false;
        };
    }
    saveFilePaths(array){
        let result = ""
        array.map((path)=>{
            if(path !== "") result += path + "//"
            return true;
        })
        localStorage.setItem('files', result);
        console.log("Result",result)
    }
    getFilePaths(){
        let arr = [];
        let storage = localStorage.getItem('files');
        if(storage!==null){
            arr = storage.split("//")
            arr.splice(arr.indexOf(""), 1)
        }
        console.log("Retrieved: ",arr)
        return arr;
    }
    removePendingFiles(){
        localStorage.removeItem('files');
        this.setState({files: []})
    }
    deleteItemFromFiles(idx){
        let list = this.state.files;
        list.splice(idx, 1);
        this.setState({files: list})
        this.saveFilePaths(list)
    }

    Anonimize(program) {
        let msg
        let flag = ipcRenderer.sendSync('Install_Check', [program.toLowerCase()]);
        if (!flag){
            alert(`Must install, ${program} needed`);
        }else{
            msg = ipcRenderer.sendSync('Conda_Script', this.getFilePaths(), this.state.output);
            alert(msg);
        }
    }

    sendOrthanc() {
        if (this.state.files === false) {
            alert('Drag files.');
        }
        else {
            console.log("PACS PreUpload:",this.state.pacs)
            ipcRenderer.send('CondaUpload', this.state.output, this.state.pacs);
            //localStorage.removeItem('files');
        }
    }

    sendMinio() {
        if (this.state.files === false) {
            alert('Drag files.');
        }
        else {
            var files = '/home/gerardgarcia/Documents/Medic_Files/1.2.124.113532.159.237.137.76.20020826.93757.32838/1.3.12.2.1107.5.1.4.24550.2.0.810657717422047';
            console.log("S3 PreUpload:",this.state.files)
            ipcRenderer.send('MinioUpload', files, this.state.output);
            //localStorage.removeItem('files');
        }
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
                            <Typography>Choose a path to store the anonimized files: (else will be stored at Documents/Anonimized_Files)</Typography>
                            <Input placeholder="Output path..." value={this.state.output} fullWidth="true" onChange={(event) => this.outputValue(event)}/>
                            <Button disabled={this.state.files.length === 0} variant="contained" color="primary" className="buttonPrimary" onClick={() => this.Anonimize('conda')}>Anonimize</Button>
                        </Grid>
                        <br/>
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