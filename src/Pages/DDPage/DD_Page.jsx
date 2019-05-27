import React, { Component } from 'react';
import './DD_Page.css';
const { ipcRenderer } = window.require("electron");


export class DDPage extends Component {
    constructor() {
        super();
        this.state = {
            files: false
        };
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
  
            this.setState({files:files});
  
            return false;
        }; 
    }

    To_Anonimize() {
        ipcRenderer.send('execute-python','hello');
        ipcRenderer.on('executed-response',(event,arg) => {
        console.log(arg.toString());
        });
    }

    render() {
        return(
            <div className="grid-frame pageStyle">
            <div id="dropbox" className="grid-block vertical draggable">Hello</div>
            <div className="grid-block shrink">
                <button className=" anon" onClick={this.To_Anonimize}>Anonimize</button>
                <button className="send">Send Orthanc</button>
            </div>
            </div>
        )
    }
}