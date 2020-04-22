import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
//Components
import { AddFolderEmptySVG } from './../svgs/AddFolderEmptySVG';
import { AddFolderNoEmptySVG } from './../svgs/AddFolderNoEmptySVG';
import { Step1SVG } from './../svgs/Step1SVG';
import { Step2SVG } from './../svgs/Step2SVG';
import { Step3SVG } from './../svgs/Step3SVG';
import {NavigateToAnonimizerRightSVG} from './../svgs/NavigateToAnonimizerRightSVG';
import { FilerList } from './FilerList';
//Electron 
const { ipcRenderer } = window.require("electron");

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

export const Filer = (props) => {

    const classes = useStyles();

    const onDirSelection=(event,args)=>{
        props.onactiontoperform({ action: "ADD FOLDER", values: args}) 
    }

    //Component did unmount
    useEffect(() => {
        ipcRenderer.on('onDirSelection', (event, args) => onDirSelection(event,args));
        return () => {
            ipcRenderer.removeListener('onDirSelection', onDirSelection)
        }
    }, []);

    const renderAddFolderBody = (files) => {

        if (files.length === 0) {
            return (
                <AddFolderEmptySVG onclickcomponent={() => {ipcRenderer.send("select-dirs") }} />
            );
        } else {
            return (
                <div className={"grid-block align-center "+classes.list}>
                    <div className="grid-block shrink"><AddFolderNoEmptySVG onclickcomponent={() => { ipcRenderer.send("select-dirs") }} /></div>
                    <div className="grid-block shrink vertical">
                        <div className="grid-block">&nbsp;</div>
                        <div className="grid-block shrink">
                            <FilerList
                                files={files}
                                onactiontoperform={props.onactiontoperform}
                            />
                        </div>
                        <div className="grid-block">&nbsp;</div>
                    </div>
                </div>
            );
        }
    }

    const renderAnonimizationNavigator = (files)=>{
        
        if(files.length>0){
            
            return (<NavigateToAnonimizerRightSVG onclickcomponent={()=>props.onactiontoperform({action:"GO TO ANONIMIZATION","values":false})}/>)
        }
    }

    return (
        <div className={"grid-block vertical " + classes.root}>
            <div className="grid-block align-center">
                {renderAddFolderBody(props.files)}
            </div>
            <div className="grid-block vertical ">
                <div className={"grid-block align-center shrink " + classes.label1}>Upload your data</div>
                <div className={"grid-block align-center shrink " + classes.label2}>Import folder from your system</div>
                <div className={"grid-block align-center shrink " + classes.stepers}>
                    <Step1SVG done={true}/>
                    <Step2SVG done={false}/>
                    <Step3SVG done={false}/>
                    {renderAnonimizationNavigator(props.files)}
                </div>
            </div>
        </div>
    );
}