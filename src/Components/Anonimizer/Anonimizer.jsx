import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
//Components
import { Step1SVG } from './../svgs/Step1SVG';
import { Step2SVG } from './../svgs/Step2SVG';
import { Step2RunningSVG } from './../svgs/Step2RunningSVG';
import { Step3SVG } from './../svgs/Step3SVG';
import { NavigateToAnonimizerRightSVG } from './../svgs/NavigateToAnonimizerRightSVG';
import { NavigateToFilerLeftSVG } from './../svgs/NavigateToFilerLeftSVG';
import { NavigateToUploaderRightSVG } from './../svgs/NavigateToUploaderRightSVG';
import { AnonimizerList } from './AnonimizerList';
import { RunAnonimizerSVG } from './../svgs/RunAnonimizerSVG';
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

export const Anonimizer = (props) => {

    const classes = useStyles();

    // ipcRenderer.on('condaAnonimizeRequestFinished', (event, args) => {
    //     console.log(args);
        
    // });
/*
    const condaAnonimizeRequestFinished=(event, args) => {
        props.onactiontoperform({ action: "FINISH ANONIMIZATION", values: args });
    }
*/
    //Component did unmount
    /*
    useEffect(() => {
        ipcRenderer.on('condaAnonimizeRequestFinished', (event, args) => condaAnonimizeRequestFinished(event, args));
        return () => {
            ipcRenderer.removeListener('condaAnonimizeRequestFinished', condaAnonimizeRequestFinished)
        }
    }, []);
    */

    const runAnonimization = async () => {
        props.onactiontoperform({ action: "RUN ANONIMIZATION", values: "false" });
        const result = await ipcRenderer.invoke("anonimize-ipc", props.files, null);
        props.onactiontoperform({ action: "FINISH ANONIMIZATION", values: { outDir: result.outDir } });
        console.info("Anonimization result: ", result.status, result.reason);

        if (result.status === true) {
            console.info("Anonimization was successfull. Data in: ",result.outDir);
            
        } else {
            let errMsg = 'An error occurred during anonimization!'
            errMsg += '\n' + "Reason: " + result.reason
            errMsg += '\n' + "Check into the logs for additional informations"
            console.log("Anonimization of ",props.files, " failed!")

            // TODO: Improve the message to the user!
            alert(errMsg);
          
        }        
    }

    const renderAddFolderBody = (files) => {

        if (files.length === 0) {
            return (
                <RunAnonimizerSVG onclickcomponent={runAnonimization} />
            );
        } else {
            return (
                <div className="grid-block align-center">
                    <div className="grid-block shrink"><RunAnonimizerSVG onclickcomponent={runAnonimization} /></div>
                    <div className="grid-block shrink vertical">
                        <div className="grid-block">&nbsp;</div>
                        <div className="grid-block shrink">
                            <AnonimizerList
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


    const renderSteps = (files, uploadingImages, runningAnonimization, anonimizationdir) => {

        if (runningAnonimization) {
            return (
                <div className="grid-block vertical ">
                    <div className={"grid-block align-center shrink " + classes.label1}>Anonimizing Images</div>
                    <div className={"grid-block align-center shrink " + classes.label2}>Please wait upto the anonimization process finish</div>
                    <div className={"grid-block align-center shrink " + classes.stepers}>
                        <NavigateToFilerLeftSVG onclickcomponent={() => props.onactiontoperform({ action: "GO TO FILER", "values": false })} />
                        <Step1SVG done={true} />
                        <Step2RunningSVG done={true} />
                        <Step3SVG done={false} />
                    </div>
                </div>
            )
        } if (anonimizationdir !== false) {
            return (
                <div className="grid-block vertical ">
                    <div className={"grid-block align-center shrink " + classes.label1}>Anonimization done</div>
                    <div className={"grid-block align-center shrink " + classes.label2}>Data has been anonimized succesfully</div>
                    <div className={"grid-block align-center shrink " + classes.stepers}>
                        <NavigateToFilerLeftSVG onclickcomponent={() => props.onactiontoperform({ action: "GO TO FILER", "values": false })} />
                        <Step1SVG done={true} />
                        <Step2SVG done={true} />
                        <Step3SVG done={false} />
                        <NavigateToUploaderRightSVG onclickcomponent={() => props.onactiontoperform({ action: "GO TO UPLOADER", "values": false })} />
                    </div>
                </div>);
        } else {
            return (
                <div className="grid-block vertical ">
                    <div className={"grid-block align-center shrink " + classes.label1}>Anonimize Images</div>
                    <div className={"grid-block align-center shrink " + classes.label2}>Click the big button to run the anonimizer</div>
                    <div className={"grid-block align-center shrink " + classes.stepers}>
                        <NavigateToFilerLeftSVG onclickcomponent={() => props.onactiontoperform({ action: "GO TO FILER", "values": false })} />
                        <Step1SVG done={true} />
                        <Step2SVG done={true} />
                        <Step3SVG done={false} />
                    </div>
                </div>
            )
        }
    }

    return (
        <div className={"grid-block vertical " + classes.root}>
            <div className="grid-block align-center">
                {renderAddFolderBody(props.files)}
            </div>
            {renderSteps(props.files, props.uploadingimages, props.runninganonimization, props.anonimizationdir)}
        </div>
    );
}