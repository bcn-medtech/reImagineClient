import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';

// import logos
import MinicondaPng from '../assets/logo_anaconda.png';

const { ipcRenderer } = window.require("electron");

let componentMounted=false;


function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 400,
        margin: 'auto',
        marginTop: theme.spacing(2),
    },
    imgTam: {
        width: 30
    }
}));

export default function FullWidthTabs() {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = useState(0);
    var arr = {'conda': false,
                'gdmscu': false,
                'program': false};
    const [installed, setInstalled] = useState(arr);
    const [logText, setLogText] = useState('');


    useEffect(() => {
        if(!componentMounted){
            ipcRenderer.sendSync('console-log',"DidMount");
            Object.keys(installed).map((key,idx) => {
                let flag = ipcRenderer.sendSync('Install_Check', [key.toLowerCase()]);
                //ipcRenderer.sendSync('console-log', "Flag: "+flag);
                console.log("Flag " + key +": ", flag)
                installed[key] = flag;
                if(flag){
                    setLogText(key.toUpperCase() + ' already installed.');
                }
            });
        }
        setInstalled(installed);
        componentMounted = true
    });

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    function handleChangeIndex(index) {
        setValue(index);
    }

    function imageRel(element) {
        if (element === 'conda') return MinicondaPng;
    }

    function Install(program) {
        let arg = ipcRenderer.sendSync('Install_Request', [program.toLowerCase()]);
        if(arg === false){
            ipcRenderer.sendSync('console-log', "Installation failed");
            installed[program] = false
            setInstalled(installed);
            setLogText(program.toUpperCase() + ' not installed.');

        } else{
            ipcRenderer.sendSync('console-log', "Installed");
            installed[program] = true
            setInstalled(installed);
            //ipcRenderer.sendSync('console-log', installed);
            setLogText(program.toUpperCase() + ' installed.');
        }
        console.log("Install")
    }

    function NotInstalledList() {
        return (
            <div>
                {Object.keys(installed).map((key, idx) => {
                    if (installed[key] == false) {
                        return (
                            <div>
                                <Button key={"Yep"+idx} onClick={() => Install(key)}>{key}</Button>
                                <img className={classes.imgTam} src={imageRel(key)} />
                            </div>
                        )
                    }
                })}
            </div>
        )
    }

    function InstalledList() {
        return (
            <div>
                {Object.keys(installed).map((key,idx) => {
                    if (installed[key] == true) {
                        return (
                            <div>
                                <Button key={"Not"+idx} onClick={() => Install(key)}>{key}</Button>
                                <img className={classes.imgTam} src={imageRel(key)} />
                            </div>
                        )
                    }
                })}
            </div>
        )
    }
    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Installed" />
                    <Tab label="Not Installed" />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabContainer dir={theme.direction}>{InstalledList()}</TabContainer>
                <TabContainer dir={theme.direction}>{NotInstalledList()}</TabContainer>
            </SwipeableViews>
            <p>Info: {logText}</p>
        </div>
    );
}
