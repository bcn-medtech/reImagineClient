import React , { useState }from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TopBar } from './../Components/TopBar.jsx';
import { Filer } from './../Components/Filer/Filer';
import { Anonimizer } from './../Components/Anonimizer/Anonimizer';
import { Uploader} from './../Components/Uploader/Uploader'

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#1B1C1E"
    }
}));


export const RootPage = () => {

    const classes = useStyles();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [anonDir, setAnonDir]=useState(false);
    const [step,setStep] = useState("filer");
    //const [step,setStep] = useState("uploader");
    const [runningAnonimization,setRunningAnonimization]=useState(false);
    const [uploadingImages,setUploadingImages]=useState(false);

    const onActionToPerform=(action)=>{

        switch (action.action) {
            case "ADD FOLDER":
                const newSelectedFiles=action.values;
                setSelectedFiles(newSelectedFiles);
                break;

            case "DELETE FOLDER":
                let newSelectedFiles2=selectedFiles.filter((element)=>{
                    if(element !== action.values){
                        return true;
                    }
                });
                setSelectedFiles(newSelectedFiles2);
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
            case "RUN ANONIMIZATION":
                setRunningAnonimization(true);
                break;
            case "FINISH ANONIMIZATION":
                setAnonDir(action.values.outDir);
                setRunningAnonimization(false);
                break;
            case "RUN UPLOAD IMAGES":
                setUploadingImages(true);
                break;
            case "FINISH UPLOAD IMAGES":
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
                    files={selectedFiles}/>)
                break;
            default:
                break;
            
        }
    }

    return (
        <div className={"grid-frame"}>
            <div className={"grid-block vertical"}>
                <div className="grid-block shrink">
                    <TopBar />
                </div>
                <div className="grid-block">
                    {renderBody(step)}
                </div>
            </div>
        </div>
    );
}
