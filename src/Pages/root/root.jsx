import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Filer } from './../../Components/Filer/Filer';
import { TopBar } from './../../Components/TopBar';
import { Anonimizer } from './../../Components/Anonimizer/Anonimizer';
import { Uploader } from './../../Components/Uploader/Uploader';
import { Installers } from './../../Components/Installers/Installers';
import { Logs } from './../../Components/Logs';
import { CloudFunctionConfig } from 'minio';
import {UpdateApp} from './../../Components/UpdateApp/UpdateApp';

//Electron 
const { ipcRenderer } = window.require("electron");

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#1B1C1E"
    },
    panel: {
        width: '100%'
    },
    heading: {
        backgroundColor: "#1B1C1E",
        color: "white",                
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular
    },
    logs: {
        fontSize: theme.typography.pxToRem(10),
        fontWeight: theme.typography.fontWeightLight
    }
}));

let selectedFilesCopy = [];

export const RootPage = () => {

    const classes = useStyles();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [anonDir, setAnonDir] = useState(false);
    const [dataUploadedSuccesfully, setDataUploadedSuccesfully] = useState(false);
    const [step, setStep] = useState("filer");
    const [runningAnonimization, setRunningAnonimization] = useState(false);
    const [runningInstallers, setRunningInstallers] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [softwareInstalled, setSoftwareInstalled] = useState([]);
    const [softwareNotInstalled, setSoftwareNotInstalled] = useState([]);
    const [logLinesNum, setLogLinesNum] = useState(10);
    const [updateAppStatus,setUpdateAppStatus]=useState(); 

    const config = ipcRenderer.sendSync("getConfig");

    const onInstalledSoftwareCheck = (program, status, errs) => {
        if (status) {
            setSoftwareInstalled( (OldSoftwareInstalled) => {
                return OldSoftwareInstalled.concat([program]);
            });
        } else {
            setSoftwareNotInstalled( (OldSoftwareNotInstalled) => {
                return OldSoftwareNotInstalled.concat([program]);
            });
            setStep("installers")
        }
    }

    const checkUpdates = async ()=>{

        const newUpdates = await ipcRenderer.invoke('checkUpdate-ipc')
        setUpdateAppStatus(newUpdates);        
        if(newUpdates.updateFound){
            setStep("updateapp");    
        } 
    }

    const checkIfSoftwareIsInstalled = () => {
        setSoftwareInstalled( () => {
            return [];
        });
        setSoftwareNotInstalled( () => {
            return [];
        });
        for (let software of config.requiredPrograms) {
            ipcRenderer.send('checkInstalled', software);
        }
    }

    //Component did mount
    useEffect(() => {
        // code to run on component mount
        if ( (!runningInstallers) && (!runningAnonimization) ){
            //ipcRenderer.send("checkIfThereAreNewVersions");
            checkUpdates();
            checkIfSoftwareIsInstalled();
            //ipcRenderer.on("isAppUpToDate", (event, program, status, errs) => onIsAppUpToDate(program, status, errs));
            ipcRenderer.on("installedCheckRes", (event, program, status, errs) => onInstalledSoftwareCheck(program, status, errs));
        } else if (runningInstallers) {
            setStep("installers")
        } else if (runningAnonimization) {
            setStep("anonimizer")
        }
    }, [])


    const onActionToPerform = (action) => {

        console.log("Performing action:", action);
        switch (action.action) {
            case "ADD FOLDER":
                //console.log("Add folder");
                const newSelectedFiles = action.values;
                //console.log(newSelectedFiles);
                if (newSelectedFiles.length > 0) {
                    if (selectedFilesCopy.indexOf(newSelectedFiles[0]) === -1) {
                        selectedFilesCopy = selectedFilesCopy.concat(newSelectedFiles);
                        setSelectedFiles(selectedFilesCopy);
                        setDataUploadedSuccesfully(false);
                        setAnonDir(false);
                    }
                }
                break;

            case "DELETE FOLDER":
                //console.log("Delete folder");
                selectedFilesCopy = selectedFilesCopy.filter((element) => {
                    if (element !== action.values) {
                        return true;
                    }
                });
                setSelectedFiles(selectedFilesCopy);
                setDataUploadedSuccesfully(false);
                setAnonDir(false);
                break;
            case "GO TO ANONIMIZATION":
                setStep("anonimizer");
                break;
            case "GO TO FILER":
                setStep("filer");
                break;               
            case "GO TO UPLOADER":
                setStep("uploader");
                break;
            case "GO TO INSTALLERS":
                setStep("installers");
                break;
            case "RUN ANONIMIZATION":
                setRunningAnonimization(true);
                break;
            case "FINISH ANONIMIZATION":
                setAnonDir(action.values.outDir);
                setRunningAnonimization(false);
                setDataUploadedSuccesfully(false);
                break;
            case "RUN UPLOAD IMAGES":
                setUploadingImages(true);
                break;
            case "FINISH UPLOAD IMAGES":
                if (action.values === true) {
                    setDataUploadedSuccesfully(true);
                }
                setUploadingImages(false);
                break;
            case "RUN INSTALLERS":
                setRunningInstallers(true);
                break;
            case "FINISH INSTALLERS":
                setRunningInstallers(false);
                break;
            case "UPLOAD NEW CASES":
                selectedFilesCopy=[];
                setSelectedFiles(selectedFilesCopy);
                setDataUploadedSuccesfully(false);
                setAnonDir(false);
                setStep("filer");
                break;
            case "CHECKINSTALLED":
                checkIfSoftwareIsInstalled();
                break;
            case "GO TO LOGS":
                setStep("console-log");
                break;                
            default:
                break;
        }
    }


    const renderBody = (step) => {

        switch (step) {
            case "filer":
                return (
                    <Filer
                        onactiontoperform={onActionToPerform}
                        runninganonimization={runningAnonimization}
                        uploadingimages={uploadingImages}
                        files={selectedFiles} />
                );

            case "anonimizer":
                return (<Anonimizer
                    onactiontoperform={onActionToPerform}
                    runninganonimization={runningAnonimization}
                    uploadingimages={uploadingImages}
                    anonimizationdir={anonDir}
                    files={selectedFiles} />)

            case "uploader":
                return (<Uploader
                    onactiontoperform={onActionToPerform}
                    runninganonimization={runningAnonimization}
                    uploadingimages={uploadingImages}
                    anonimizationdir={anonDir}
                    datauploadedsuccesfully={dataUploadedSuccesfully}
                    files={selectedFiles} />)

            case "installers":
                return (<Installers
                    softwareinstalled={softwareInstalled}
                    softwarenotinstalled={softwareNotInstalled}
                    runninginstallation3rdpartysoftware={runningInstallers}
                    onactiontoperform={onActionToPerform}
                />)
            case "console-log":
                return (<Logs
                    logFile={config.logFile}
                />)
            case "updateapp":
                return(<UpdateApp
                    status={updateAppStatus}
                    onactiontoperform={onActionToPerform}
                    />)
            default:
                break;
        }
    }

    return (
        <div className={"grid-frame"}>
            <div className={"grid-block vertical"}>
                <div className="grid-block shrink">
                    <TopBar onactiontoperform={onActionToPerform} />
                </div>
                <div className="grid-block">
                    {renderBody(step)}
                </div>
            </div>
        </div>
    );
}
