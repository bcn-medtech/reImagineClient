import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CheckSVG } from './../svgs/CheckSVG';
import { FailSVG } from './../svgs/FailSVG';
import { InstallersList } from './InstallersList';
import { NavigateToFilerLeftSVG } from './../svgs/NavigateToFilerLeftSVG';
import { InstallationDoneSVG } from './../svgs/InstallationDoneSVG';
import { InstallationNotDoneSVG } from './../svgs/InstallationNotDoneSVG';
import { InstallationInProgressSVG } from './../svgs/InstallationInProgressSVG';
import { Timer } from './../Timer/Timer';
//import { BrowserWindow } from 'electron';
//Components
//Electron 
const { ipcRenderer } = window.require("electron");
//const { dialog } = window.require("electron");

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#1B1C1E"
    },
    label1: {
        color: "white",
        fontSize: "18pt",
        //marginTop: "-20px"
        //paddingTop:"30px"
    },
    label2: {
        color: "#979797",
        fontSize: "13pt",
        paddingTop: "14px",
        paddingLeft: "20px",
        paddingRight: "20px"
    },
    stepers: {},
    installationInfo: {
        paddingBottom: "50px"
    },
    navigationLeft: {
        position: "absolute",
        left: "10px",
        bottom: "171px",
        zIndex: 10,
        width: "240px"
    },
    list: {
        paddingTop: "40px"
    }
}));


export const Installers = (props) => {

    const classes = useStyles();
/*
    const condaInstallRequestFinished=(event, installed)=>{
        props.onactiontoperform({ action: "FINISH INSTALLERS", values: installed });
    }

    useEffect(() => {
        ipcRenderer.on('condaInstallRequestFinished', (event, args) => condaInstallRequestFinished(event,args));
        return () => {
            ipcRenderer.removeListener('condaInstallRequestFinished', condaInstallRequestFinished)
        }
    }, []);
*/

    const runInstallNext = async () => {
        console.info("Run installation third party software");
        props.onactiontoperform({ action: "RUN INSTALLERS", values: null });

        const app = props.softwarenotinstalled[0];
        const result = await ipcRenderer.invoke("install-ipc", app);
        props.onactiontoperform({ action: "FINISH INSTALLERS", values: null });
        console.info("Installation of ",app, result.status, result.reason);

        if (result.status === true) {
            console.info("Installation of ",app, " was successfull");
            props.onactiontoperform({ action: "CHECKINSTALLED", values: null });
        } else {
            let errMsg = 'An error occurred while installing ' + app.name
            errMsg += '\n' + "Reason: " + result.reason
            errMsg += '\n' + "Check into the logs for additional informations"
            console.log("Installation of ",app, " failed!")

            // TODO: Improve the message to the user!
            alert(errMsg);

            // THIS LOCKS THE APP BUT THE WINDOW IS NOT SHOWN
            /*
            dialog.showMessageBoxSync(null, {
                type: "error",
                title: "Installation error!",
                buttons: ["OK"],
                message: errMsg
            });
            */
            
        }
        /*
        

        // To avoid dependency problems, run one installer per time
        if (softwarenotinstalled.length > 0) {
            ipcRenderer.send("installRequestPromise", softwarenotinstalled[0])
        }
        */
    }

    const renderInstallationToolbox = (softwareInstalled, softwareNotInstalled, runninginstallation3rdpartysoftware) => {

        if (runninginstallation3rdpartysoftware === true) {
            return (
                <div className={"grid-block vertical align-center shrink " + classes.installationInfo}>
                    <div className="grid-block align-center shrink"><InstallationInProgressSVG done={true} /></div>
                    <div className={"grid-block align-center shrink " + classes.label1}>Installing third party software</div>
                    <div className={"grid-block align-center text-center shrink " + classes.label2}>The installation can take up to 5-8 minutes, please wait and be sure that the computer is connected to internet.</div>
                    <Timer />
                </div>
            )
        } else if (softwareNotInstalled.length !== 0) {
            return (
                <div className={"grid-block vertical align-center shrink " + classes.installationInfo}>
                    <div className="grid-block align-center shrink"><InstallationNotDoneSVG done={true} onclickcomponent={runInstallNext} /></div>
                    <div className={"grid-block align-center shrink " + classes.label1}>Third party software not installed</div>
                    <div className={"grid-block align-center shrink " + classes.label2}>Some needed software is not installed, please click the red button to start the installation</div>
                    {/*<NavigateToFilerLeftSVG onclickcomponent={() => props.onactiontoperform({ action: "GO TO FILER", "values": false })} />*/}
                </div>
            )
        } else {
            return (
                <div className={"grid-block vertical align-center shrink " + classes.installationInfo}>
                    <div className="grid-block align-center shrink"><InstallationDoneSVG done={true} /></div>
                    <div className={"grid-block align-center shrink " + classes.label1}>Installation of third party software done</div>
                    <div className={"grid-block align-center shrink " + classes.label2}>Everything is installed</div>
                    <NavigateToFilerLeftSVG onclickcomponent={() => props.onactiontoperform({ action: "GO TO FILER", "values": false })} />
                </div>
            )
        }
    }

    return (
        <div className={"grid-block vertical " + classes.root}>
            <div className={"grid-block " + classes.list}>
                <div className="grid-block align-center vertical">
                    <div className={"grid-block align-center shrink "}><CheckSVG /></div>
                    <div className={"grid-block align-center shrink " + classes.label1}>Software installed</div>
                    <div className={"grid-block align-center"}>
                        <InstallersList sofwarelist={props.softwareinstalled} />
                    </div>
                </div>
                <div className="grid-block align-center vertical">
                    <div className={"grid-block align-center shrink "}><FailSVG /></div>
                    <div className={"grid-block align-center shrink " + classes.label1}>Software not installed</div>
                    <div className={"grid-block align-center"}>
                        <InstallersList sofwarelist={props.softwarenotinstalled} />
                    </div>
                </div>
            </div>
            {renderInstallationToolbox(props.softwareinstalled, props.softwarenotinstalled, props.runninginstallation3rdpartysoftware)}
        </div>
    );
}