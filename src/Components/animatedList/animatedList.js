import React from 'react';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import Zoom from '@material-ui/core/Zoom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import Button from '@material-ui/core/Button';



const useStyles = makeStyles(theme => ({
    root: {
        height: 180,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        marginLeft: '45px'
    },

    paperClone: {
        margin: theme.spacing(1),
        padding: '3px',
        minWidth: '100px',
        maxWidth: '200px'
    },

    paper: {
        margin: theme.spacing(1),
        padding: '3px',
        
    },
    svg: {
        width: 100,
        height: 100,
    },
    polygon: {
        fill: theme.palette.common.white,
        stroke: theme.palette.divider,
        strokeWidth: 1,
    },
    div: {
        textAlign: 'center'
    }
}));

export default function SimpleZoom(props) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState(true);
    console.log(props);

    function setPage(item) {
        console.log(item);
        var browserHistory = props.history;
        browserHistory.push(item);
    }

    return (
        <div className={classes.root}>
            <Zoom in={checked}>
                <Paper elevation={4} className={classes.paper}>
                    <div className={classes.div}>
                        Hi, Welcome to deid app, let us show you a liitle brief about how is going the app
                    </div>
                </Paper>
            </Zoom>

            <div className={classes.container}>
                <Zoom in={checked} style={{ transitionDelay: checked ? '3000ms' : '0ms' }}>
                    <Paper elevation={4} className={classes.paperClone}>
                        <div className={classes.div}>
                            first of all, you have in here two principal pages, first one,
                            when this tips are over, you will be able to click one button that
                            sends you there
                        </div>
                    </Paper>
                </Zoom>
                <Zoom in={checked} style={{ transitionDelay: checked ? '6000ms' : '0ms' }}>
                    <Paper elevation={4} className={classes.paperClone}>
                        <div className={classes.div}>
                            First page, is just a drag and drop component, let you drop the data
                            to deid and do it automatically when the deid button is pressed and let
                            you update it to orthanc db
                        </div>
                    </Paper>
                </Zoom>
                <Zoom in={checked} style={{ transitionDelay: checked ? '9000ms' : '0ms' }}>
                    <Paper elevation={4} className={classes.paperClone}>
                        <div className={classes.div}>
                            Second page is allocated in settings tray, setted right clicking on 
                            tray image named '3rd part installers', Used to know what dependencies 
                            we have installed in our computer and what does not
                        </div>
                    </Paper>
                </Zoom>
                <Zoom in={checked} style={{ transitionDelay: checked ? '12000ms' : '0ms' }}>
                    <Paper elevation={4} className={classes.paperClone}>
                        <div className={classes.div}>
                            On second page we will be able to install dependencies we need or want to if
                            it's necessary for the program
                        </div>
                    </Paper>
                </Zoom>
                <Zoom in={checked} style={{ transitionDelay: checked ? '14000ms' : '0ms' }}>
                    <Button variant="outlined"  style={{'margin': 'auto', 'margin-top': '5px'}} onClick={() => setPage('/Anonimizer')}>
                        Go to first Page
                    </Button>
                </Zoom>
            </div>
        </div>
    );
}