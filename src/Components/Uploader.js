import React, { Component } from 'react';

import {Container, Typography} from '@material-ui/core';
import {Card, CardActions, CardContent} from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';
import PublishIcon from '@material-ui/icons/Publish';

const { ipcRenderer } = window.require("electron");

const styles = {
    fxb: {
      display: "flex",
      flex_direction: "row",
    },
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  }; 

export class Uploader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lastUploadInfo: {
                method: "",
                status: ""
            }
        };
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners()
    }

    componentDidMount() {
        //Register handler to receive files from main process

        //Store last upload results
        ipcRenderer.on("uploadResult", (event, result) => {
            var upStatus = this.state.lastUploadInfo
            upStatus.status = result
            this.setState({lastUploadInfo: upStatus})
        })
    }

    onServerTypeChanged(event) {
        this.setState({serverType: event.target.value})
    }

    selectServer(name) {

        if (!this.props.anonDir) return;
        
        var upInfo = this.state.lastUploadInfo
        upInfo.method = name
        upInfo.status = "Pending"
        this.setState({lastUploadInfo: upInfo})
        ipcRenderer.send('MinioUpload', this.props.anonDir, null);
        
    }

    renderServers() {
        var servers = [{name: "pacs-upf", endpoints: "orthanc"}, {name: "S3-upf", endpoints: "minio"}, {name: "S3-aws", endpoints: "aws"}]
        return (
            <div style={styles.fxb}>
            { 
                servers.map((server, idx) => {
                return (
                <div key={idx}>
                <Card style={styles.root}>
                    <CardContent>
                        <Typography style={styles.title} color="textSecondary" gutterBottom>
                            {server.name}
                        </Typography>
                        <Typography style={styles.pos} color="textSecondary">
                            {server.endpoints}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <IconButton onClick={() => this.selectServer(server.name)}><PublishIcon/></IconButton>
                    </CardActions>                        
                </Card>
                </div>
                )
            })
            }
            </div>                     
        )
    }

    renderStatus() {
        if (!this.state.lastUploadInfo.method) {
            return <Typography>No upload pending</Typography>
        }

        if ((this.state.lastUploadInfo.method) && (this.state.lastUploadInfo.status === "Pending")) {
            return <Typography>Uploading...</Typography>
        }
            
        return <Typography>Upload on {this.state.lastUploadInfo.method} is: {this.state.lastUploadInfo.status}</Typography>
        
    }

    render() {
        return (
                <Container>
                    {this.renderServers()}
                    {this.renderStatus()}
                </Container>

        )
    }    

}
