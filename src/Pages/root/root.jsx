import React , { useState,useEffect }from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TopBar } from './../../Components/TopBar.jsx';
import { Filer } from './../../Components/Filer/Filer';
import { Anonimizer } from './../../Components/Anonimizer/Anonimizer';
import { Uploader} from './../../Components/Uploader/Uploader';
import {Installers} from './../../Components/Installers/Installers';
import config from "./../../conf/config";
import {getSoftwareInstalledAnNotInstalled} from './helper';
//Electron 
const { ipcRenderer } = window.require("electron");

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#1B1C1E"
    }
}));



// let softwareInstalled=[];
// let softwareNotInstalled=[];

export const RootPage = () => {

    const classes = useStyles();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [anonDir, setAnonDir]=useState(false);
    const [dataUploadedSuccesfully,setDataUploadedSuccesfully]=useState(false);
    //const [allSoftwareIsInstalledSuccesfully, setAllSoftwareIsInstalledSuccesfully]=useState(false);
    const [step,setStep] = useState("filer");
    const [runningAnonimization,setRunningAnonimization]=useState(false);
    const [runningInstallation3rdPartySoftware,setRunningInstallation3rdPartySoftware]=useState(true);
    const [uploadingImages,setUploadingImages]=useState(false);
    const [softwareInstalled,setSoftwareInstalled]=useState([]);
    const [softwareNotInstalled,setSoftwareNotInstalled]=useState([]);

    ipcRenderer.on("installedCheckRes", (event, program, status, errs) => onInstalledSoftwareCheck(program, status, errs));

    const onInstalledSoftwareCheck=(softwareInstalled, status, errs)=>{
        if(status){
            //const result =getSoftwareInstalledAnNotInstalled(config.requiredPrograms,softwareInstalled);
            // softwareInstalled=result.softwareInstalled;
            // softwareNotInstalled=result.softwareNotInstalled;
            setSoftwareInstalled([{name: "conda", icon: "../assets/logo_anaconda.png"}]);
            setSoftwareNotInstalled([]);
            //setAllSoftwareIsInstalledSuccesfully(true);
        }else{
            //setAllSoftwareIsInstalledSuccesfully(false);
            setSoftwareInstalled([]);
            setSoftwareNotInstalled([{name: "conda", icon: "../assets/logo_anaconda.png"}]);
            setStep("installers");
        }
    }

    const checkIfSoftwareIsInstalled=()=> {
        for (let software of config.requiredPrograms) {
            ipcRenderer.send('checkInstalled', software);
        }
    }

    //Component did mount
    useEffect(() => {
        // code to run on component mount
        checkIfSoftwareIsInstalled();
    }, [])


    const onActionToPerform=(action)=>{

        switch (action.action) {
            case "ADD FOLDER":
                const newSelectedFiles=action.values;
                setSelectedFiles(newSelectedFiles);
                setDataUploadedSuccesfully(false);
                setAnonDir(false);
                break;

            case "DELETE FOLDER":
                let newSelectedFiles2=selectedFiles.filter((element)=>{
                    if(element !== action.values){
                        return true;
                    }
                });
                setSelectedFiles(newSelectedFiles2);
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
                if(action.values==="success"){
                    setDataUploadedSuccesfully(true);
                }
                setUploadingImages(false);
                break;
            default:
                break;
        }
    }

    const renderBody=(step)=>{

        switch(step){
            case "filer":
                return(
                    <Filer 
                    onactiontoperform={onActionToPerform}
                    runninganonimization={runningAnonimization}
                    uploadingimages={uploadingImages}
                    files={selectedFiles}/>
                    );
                break;
            case "anonimizer":
                    return (<Anonimizer
                    onactiontoperform={onActionToPerform}
                    runninganonimization={runningAnonimization}
                    uploadingimages={uploadingImages}
                    anonimizationdir={anonDir}
                    files={selectedFiles}/>)
                break;
            case "uploader":
                return (<Uploader
                    onactiontoperform={onActionToPerform}
                    runninganonimization={runningAnonimization}
                    uploadingimages={uploadingImages}
                    anonimizationdir={anonDir}
                    datauploadedsuccesfully={dataUploadedSuccesfully}
                    files={selectedFiles}/>)
                break;
            case "installers":
                return(<Installers
                    softwareinstalled={softwareInstalled}
                    softwarenotinstalled={softwareNotInstalled}
                    runninginstallation3rdpartysoftware={runningInstallation3rdPartySoftware}
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
                    <TopBar onactiontoperform={onActionToPerform}/>
                </div>
                <div className="grid-block">
                    {renderBody(step)}
                </div>
            </div>
        </div>
    );
}
