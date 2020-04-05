import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
//Components
import { Step1SVG } from './../svgs/Step1SVG';
import { Step2SVG } from './../svgs/Step2SVG';
import { Step2RunningSVG } from './../svgs/Step2RunningSVG';
import { Step3SVG } from './../svgs/Step3SVG';
import {NavigateToAnonimizerRightSVG} from './../svgs/NavigateToAnonimizerRightSVG';
import {NavigateToUploaderRightSVG} from './../svgs/NavigateToUploaderRightSVG';
import {NavigateToAnonimizerLeftSVG} from './../svgs/NavigateToAnonimizerLeftSVG';
import {UploaderList } from './UploaderList';
import {RunAnonimizerSVG} from './../svgs/RunAnonimizerSVG';
import {UploadToCloudSVG} from './../svgs/UploadToCloudSVG';
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
    stepers: {}
}));

export const Uploader = (props) => {

    const classes = useStyles();
    
    ipcRenderer.on('condaAnonimizeRequestFinished', (event, args) => { 
        console.log(args);
        props.onactiontoperform({action:"FINISH ANONIMIZATION", values:args});  
    });
    
     //Component did unmount
     useEffect(() => {
        return () => {
            ipcRenderer.removeAllListeners();
        }
    }, []);

    const runAnonimization=()=>{
        props.onactiontoperform({action:"RUN ANONIMIZATION", values:"false"});
        ipcRenderer.send('condaAnonimizeRequest', props.files, null);
    }


    const renderSteps = (files,uploadingImages,runningAnonimization,anonimizationdir)=>{

        /*if(runningAnonimization){
            return(
                <div className="grid-block vertical ">
                <div className={"grid-block align-center shrink " + classes.label1}>Anonimizing Images</div>
                <div className={"grid-block align-center shrink " + classes.label2}>Please wait upto the anonimization process finish</div>
                <div className={"grid-block align-center shrink " + classes.stepers}>
                    <NavigateToAnonimizerLeftSVG onclickcomponent={()=>props.onactiontoperform({action:"GO TO FILER","values":false})}/>
                    <Step1SVG done={true}/>
                    <Step2RunningSVG done={true}/>
                    <Step3SVG done={false}/>
                </div>
            </div>
            )
        }if(anonimizationdir!==false){
            return(
                <div className="grid-block vertical ">
                <div className={"grid-block align-center shrink " + classes.label1}>Anonimization done</div>
                <div className={"grid-block align-center shrink " + classes.label2}>Data has been anonimized succesfully</div>
                <div className={"grid-block align-center shrink " + classes.stepers}>
                    <NavigateToAnonimizerLeftSVG onclickcomponent={()=>props.onactiontoperform({action:"GO TO FILER","values":false})}/>
                    <Step1SVG done={true}/>
                    <Step2SVG done={true}/>
                    <Step3SVG done={false}/>
                    <NavigateToUploaderRightSVG onclickcomponent={()=>props.onactiontoperform({action:"GO TO UPLOADER","values":false})}/>
                </div>
            </div>);
        }else{*/
            return(
                <div className="grid-block vertical ">
                <div className={"grid-block align-center shrink " + classes.label1}>Upload Images</div>
                <div className={"grid-block align-center shrink " + classes.label2}>Click the big button to upload the images</div>
                <div className={"grid-block align-center shrink " + classes.stepers}>
                    <NavigateToAnonimizerLeftSVG onclickcomponent={()=>props.onactiontoperform({action:"GO TO ANONIMIZATION","values":false})}/>
                    <Step1SVG done={true}/>
                    <Step2SVG done={true}/>
                    <Step3SVG done={true}/>
                </div>
            </div>
            )
    }

    return (
        <div className={"grid-block vertical " + classes.root}>
            <div className="grid-block align-center">
                <div className="grid-block align-center">
                    <div className="grid-block shrink"><UploadToCloudSVG onclickcomponent={runAnonimization}/></div>
                    <div className="grid-block shrink vertical">
                        <div className="grid-block">&nbsp;</div>
                        <div className="grid-block shrink">
                            <UploaderList
                                files={props.files}
                                onactiontoperform={props.onactiontoperform}
                            />
                        </div>
                        <div className="grid-block">&nbsp;</div>
                    </div>
                </div>
            </div>
            {renderSteps(props.files,props.uploadingimages,props.runninganonimization,props.anonimizationdir)}
        </div>
    );
}