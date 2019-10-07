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
    const [installed, setInstalled] = React.useState(false);
    var arr = [['Miniconda3', true], ['gdmscu', false], ['program', false]];


    React.useEffect(() => {

        ipcRenderer.send('Install_Request', arr[0]);
        ipcRenderer.on('InstallAnswer', (event, arg) => {
            if (arg === false) {
                arr[0][1] = false;
            }
        })
    }),[];

    console.log(arr, 'state arr');

    

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    function handleChangeIndex(index) {
        setValue(index);
    }

    function imageRel(element) {
        if (element === 'Miniconda') return MinicondaPng;
    }

    function Install(program) {
        console.log(program);

        new Promise(resolve => {
    
            ipcRenderer.send('Install_Request', [program.toLowerCase()]);
            ipcRenderer.on('InstallAnswer', (event, arg) => {
                if (arg !== null) {
                    resolve(arg);
                    ipcRenderer.send('Program_Install', [program]);
                }
                ipcRenderer.send('Miniconda_Install', arg, localStorage.getItem('files'));
                ipcRenderer.on('finished_deid', (event, arg) => {
                    console.log(arg.toString());
                })
            })
        })
    }

    function NotInstalledList() {
        console.log(arr);
        return (
            <div>
                {
                    arr.map((element, idx) => {
                        console.log(element, 'before test');
                        if (element[1] === false) {
                            console.log(element), 'after test';
                            return (
                                <div>
                                    <Button key={idx} onClick={() => Install(element[0])}>{element}</Button>
                                    <img className={classes.imgTam} src={imageRel(element[0])} />
                                </div>
                            )
                        }
                    })
                }
            </div>
        )
    }

    function InstalledList(arr) {
        console.log(arr, 'installed list');
        return (
            <div>
                {
                    arr.map((element, idx) => {
                        if (element[1] === true) {

                            return (
                                <div>
                                    <Button key={idx}>{element}</Button>
                                    <img className={classes.imgTam} src={imageRel(element[0])} />
                                </div>
                            )
                        }
                    })
                }
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
                <TabContainer dir={theme.direction}>{InstalledList(arr)}</TabContainer>
                <TabContainer dir={theme.direction}>{NotInstalledList(arr)}</TabContainer>
            </SwipeableViews>
        </div>
    );
}
