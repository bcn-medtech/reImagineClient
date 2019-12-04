import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';

// import logos
import MinicondaPng from '../../assets/logo_anaconda.png';

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
    const [value, setValue] = React.useState(0);
    var arr = {'conda': false,
                'gdmscu': false,
                'program': false};
    const [installed, setInstalled] = React.useState(arr);

    // React.useEffect(() => {
    //     if(!componentMounted){
    //         arr.map((el, idx) => {
    //             //console.log(el[0].toString());
    //             ipcRenderer.send('Install_Request', el[0].toString());
    //             ipcRenderer.on('InstallAnswer', (event, arg) => {
    //                 console.log("Answer: ", event, arg)
    //                 if (arg === false) {
    //                     //console.log(installed[idx], 'bchange');
    //                     setInstalled(installed[idx] = [el[0], false])
    //                     //console.log(installed[idx], 'achange');
    //                 }
    //             })
    //         })
    //     }
    //     componentMounted = true
    // }), 100;




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
        ipcRenderer.send('Install_Request', [program.toLowerCase()]);
        ipcRenderer.on('InstallAnswerButton', (event, arg) => {
            //if (arg !== null) {
                //resolve(arg);
                //ipcRenderer.send('Program_Install', [program]);
            //}
            //ipcRenderer.send('Miniconda_Install', arg, localStorage.getItem('files'));
            if(arg === false){
                ipcRenderer.sendSync('console-log', "Installation failed, missing program argument");
                installed[program] = false
                setInstalled(installed);
            } else{
                ipcRenderer.sendSync('console-log', "Installed");
                installed[program] = true
                setInstalled(installed);
                ipcRenderer.sendSync('console-log', installed);
            }
            ipcRenderer.on('finished_deid', (event, arg) => {
                 console.log(arg.toString());
            })
        });
    }

    function NotInstalledList() {
        return (
            <div>
                {Object.keys(installed).map((key, idx) => {
                    if (installed[key] == false) {
                        return (
                            <div>
                                <Button key={idx} onClick={() => Install(key)}>{key}</Button>
                                <img className={classes.imgTam} src={imageRel(key)} />
                            </div>
                        )
                    }
                })}
            </div>
        )
    }

    function InstalledList(arr) {
        return (
            <div>
                {Object.keys(installed).map((key,idx) => {
                    if (installed[key] == true) {
                        return (
                            <div>
                                <Button key={idx} onClick={() => Install(key)}>{key}</Button>
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
        </div>
    );
}
