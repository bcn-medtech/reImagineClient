import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
//Components
//Electron 


const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#1B1C1E"
    },
    label1: {
        color: "white",
        fontSize: "18pt"
    },
    label2: {
        color: "#979797",
        fontSize: "13pt",
        paddingTop: "14px"
    },
    stepers: {},
    list:{
        width: "50%"
    }
}));

export const ExcelComponent = (props) => {

    const classes = useStyles();

    return (
        <div className={"grid-block vertical " + classes.root}>
            <div className="grid-block align-center"></div>
            <div className="grid-block vertical ">
                <div className={"grid-block align-center shrink " + classes.label1}>View of ExcelFile</div>
                <div className={"grid-block align-center shrink " + classes.label2}>.....</div>
                <div className={"grid-block align-center shrink " + classes.stepers}></div>
            </div>
        </div>
    );
}