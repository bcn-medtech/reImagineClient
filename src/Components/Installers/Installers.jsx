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
//Components
//Electron 
const { ipcRenderer } = window.require("electron");

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

    ipcRenderer.on('condaInstallRequestFinished', (event, installed) => {
        props.onactiontoperform({ action: "FINISH INSTALLERS", values: installed });
    });

    //Component did unmount
    // useEffect(() => {
    //     return () => {
    //         ipcRenderer.removeAllListeners();
    //     }
    // }, []);

    const runInstallationThirdPartySoftware = () => {
        console.log("Run installation third party software");
        props.onactiontoperform({ action: "RUN INSTALLERS", values: false });

        const softwarenotinstalled = props.softwarenotinstalled;

        //#TODO currently working only for conda
        if (softwarenotinstalled.length > 0) {
            ipcRenderer.send("installRequest", softwarenotinstalled[0])
        }
    }

    const renderInstallationToolbox = (softwareInstalled, softwareNotInstalled, runninginstallation3rdpartysoftware) => {

        if (runninginstallation3rdpartysoftware === true) {
            return (
                <div className={"grid-block vertical align-center shrink " + classes.installationInfo}>
                    <div className="grid-block align-center shrink"><InstallationInProgressSVG done={true} /></div>
                    <div className={"grid-block align-center shrink " + classes.label1}>Installing third party software</div>
                    <div className={"grid-block align-center text-center shrink " + classes.label2}>The installation of the software can take about 10 minutes,please wait and be sure that the computer is connected to internet. In the mean time you can go and drink a cofee</div>
                    <Timer />
                </div>
            )
        } else if (softwareNotInstalled.length !== 0) {
            return (
                <div className={"grid-block vertical align-center shrink " + classes.installationInfo}>
                    <div className="grid-block align-center shrink"><InstallationNotDoneSVG done={true} onclickcomponent={runInstallationThirdPartySoftware} /></div>
                    <div className={"grid-block align-center shrink " + classes.label1}>Third party software not installed</div>
                    <div className={"grid-block align-center shrink " + classes.label2}>Software needed is not installed, please click the play red button to start the installation</div>
                    {/*<NavigateToFilerLeftSVG onclickcomponent={() => props.onactiontoperform({ action: "GO TO FILER", "values": false })} />*/}
                </div>
            )
        } else {
            return (
                <div className={"grid-block vertical align-center shrink " + classes.installationInfo}>
                    <div className="grid-block align-center shrink"><InstallationDoneSVG done={true} /></div>
                    <div className={"grid-block align-center shrink " + classes.label1}>Installation third party software done</div>
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