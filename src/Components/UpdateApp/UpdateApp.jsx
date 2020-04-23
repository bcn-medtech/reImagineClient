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

    function renderVersion() {
        console.log("Update status:",props.status)
        if (props.status.updateFound) {
            return (
                <div className="grid-block vertical ">
                    <div className={"grid-block align-center shrink " + classes.label1}> 
                        An upgrade from {props.status.curVersion} to {props.status.info.version} is available!
                    </div>
                    <div className={"grid-block align-center shrink " + classes.label2}> 
                        Click on the big circle to complete install and relaunch
                    </div>
                    <div className={"grid-block align-center shrink"}>
                        <Button variant="contained" color="primary" className={classes.updatelaterbutton} onClick={()=>{props.onactiontoperform({action:"GO TO FILER"})}}>
                            Update later
                        </Button>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="grid-block vertical ">
                    <div className={"grid-block align-center shrink " + classes.label1}> 
                        You are running the last version ({props.status.curVersion})
                    </div>
                    <div className={"grid-block align-center shrink"}>
                        <Button variant="contained" color="primary" className={classes.updatelaterbutton} onClick={()=>{props.onactiontoperform({action:"GO TO FILER"})}}>
                            Back to file selection
                        </Button>
                    </div>
                </div>                
            )
        }

    }

    return (
        <div className={"grid-block vertical " + classes.root}>
            <div className="grid-block align-center">
                <UpdateAppSVG onclickcomponent={() => { 
                    if ((props.status.updateFound) && (props.status.downloadCompleted)) {
                        ipcRenderer.send('quitapp') 
                    } 
                    }} 
                    disabled={((!props.status.updateFound) || (!props.status.downloadCompleted))}
                    />
            </div>
            {renderVersion()}
        </div>
    );
}