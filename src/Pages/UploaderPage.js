import React, { Component } from 'react';

import TopBar from '../Components/TopBar';
import {CssBaseline} from '@material-ui/core';
import  { Filer } from '../Components/Filer';
import  { Anonimizer }  from '../Components/Anonimizer';
import  { Uploader }  from '../Components/Uploader';

export class UploaderPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFiles: [],
            anonDir: "",
        }
    }
    
    componentDidMount() {

    }

    componentWillUnmount() {
        
    }

    render() {
        const selectedFiles = this.state.selectedFiles
        const anonDir = this.state.anonDir

        return (
            <CssBaseline>
                <TopBar page="Image anonimization and upload" history={this.props.history} />
                <Filer
                    files={selectedFiles}
                    onFilesChange={(newFiles) => this.setState({selectedFiles: newFiles})}
                />
                <Anonimizer
                    files={selectedFiles}
                    anonDir={anonDir}
                    onAnonDirChange={(newDir) => this.setState({anonDir: newDir})}
                />
                <Uploader
                    anonDir={anonDir}
                />

            </CssBaseline>                    
        )
       
    }
}
