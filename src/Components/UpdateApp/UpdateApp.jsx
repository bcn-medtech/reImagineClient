import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { UpdateAppSVG } from './../svgs/UpdateAppSVG';
import { NavigateToFilerLeftSVG } from './../svgs/NavigateToFilerLeftSVG';
import Button from '@material-ui/core/Button';

//Electron 
const { ipcRenderer } = window.require("electron");

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#1B1C1E"
    },
    label1: {
        color: "white",
        fontSize: "18pt",
        textAlign: "center"
    },
    label2: {
        color: "#979797",
        fontSize: "13pt",
        paddingTop: "14px"
    },
    stepers: {},
    updatelaterbutton:{
        marginTop: "20px"
    }
}));

export const UpdateApp = (props) => {

    const classes = useStyles();

    return (
        <div className={"grid-block vertical " + classes.root}>
            <div className="grid-block align-center">
                <UpdateAppSVG onclickcomponent={() => { ipcRenderer.send('quitapp') }} />
            </div>
            <div className="grid-block vertical ">
                <div className={"grid-block align-center shrink " + classes.label1}> There are some updates available</div>
                <div className={"grid-block align-center shrink " + classes.label2}> Please click the big circle button to be able to use the latest version of the platform</div>
                <div className={"grid-block align-center shrink"}>
                    <Button variant="contained" color="primary" className={classes.updatelaterbutton} onClick={()=>{props.onactiontoperform({action:"GO TO FILER"})}}>
                        Update later
                    </Button>
                </div>
            </div>
        </div>
    );
}