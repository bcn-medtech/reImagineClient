import React, {Component} from 'react';
import TopBar from '../Components/TopBar';
import {Tabs, Tab} from '@material-ui/core';
import {CssBaseline, Container, Typography, Box, Chip, Avatar } from '@material-ui/core';
import config from "../conf/config"

// import logos

import GetAppIcon from '@material-ui/icons/GetApp';

const { ipcRenderer } = window.require("electron");

const styles = {
    fxb: {
      display: "flex",
      flex_direction: "row",
    },
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  }

export class InstallersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleTab: 0,
            pInst: [],
            pNotInst: []
        }
    }

    componentDidMount() {
        ipcRenderer.on("installedCheckRes", (event, program, status, errs) => this._onInstalledCheck(program, status, errs));
        this.checkInstallStatus();
    }

    _onInstalledCheck(program, status, errs) {

        if (status) {
            this.setState({pInst: this.state.pInst.concat([program])})
        } else {
            this.setState({pNotInst: this.state.pNotInst.concat([program])})
        }

    }

    checkInstallStatus() {
        for (var _p of config.requiredPrograms) {
            ipcRenderer.send('checkInstalled', _p);
        }
    }

    doInstallApp(app) {
        console.log("Received Install request! "+app)

        /*
        if(arg === false) {
            let arg2 = ipcRenderer.sendSync('Install_Request', [app.toLowerCase()]);
        }
        */

    }

    render() {
    
        return (
            <CssBaseline>
                <TopBar page="Installers" history={this.props.history} />
                <Container>
                    <Tabs
                        value={this.state.visibleTab}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        onChange={(event, newVal) => this.setState({visibleTab: newVal})}
                    >
                        <Tab label="Installed"/>
                        <Tab label="Not Installed"/>
                    </Tabs>  
                    <TabPanel value={this.state.visibleTab} index={0}>
                        {
                            this.state.pInst.map((value, idx) => {
                                return (
                                    <Chip key={idx}
                                        avatar={<Avatar alt={value.name} src={value.icon}/>}
                                        label={value.name}
                                    />
                                )})
                        }                        
                    </TabPanel>
                    <TabPanel value={this.state.visibleTab} index={1}>
                    {
                            this.state.pNotInst.map((value, idx) => {
                                return (
                                    <Chip key={idx}
                                        avatar={<Avatar alt={value.name} src={value.icon}/>}
                                        label={value.name}
                                        onClick={() => this.doInstallApp(value)}
                                    />
                                )})
                    }                    
                    </TabPanel>                    
                </Container>            
            </CssBaseline>                
        )
    }
}