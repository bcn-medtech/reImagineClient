import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

//Alert dependencies
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
//Components
import { Step1SVG } from './../svgs/Step1SVG';
import { Step2SVG } from './../svgs/Step2SVG';
import { Step2RunningSVG } from './../svgs/Step2RunningSVG';
import {Step3RunningSVG} from './../svgs/Step3RunningSVG.jsx';
import { Step3SVG } from './../svgs/Step3SVG';
import { NavigateToAnonimizerRightSVG } from './../svgs/NavigateToAnonimizerRightSVG';
import { NavigateToUploaderRightSVG } from './../svgs/NavigateToUploaderRightSVG';
import { NavigateToAnonimizerLeftSVG } from './../svgs/NavigateToAnonimizerLeftSVG';
import { NavigateToFilerRightSVG} from './../svgs/NavigateToFilerRightSVG';
import { UploaderList } from './UploaderList';
import { RunAnonimizerSVG } from './../svgs/RunAnonimizerSVG';
import { UploadToCloudSVG } from './../svgs/UploadToCloudSVG';

//Electron 
const { ipcRenderer } = window.require("electron");

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  

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
    const [openAlertMissingCertificates, setOpenAlertMissingCertificates] = React.useState(false);

    
      const handleClose = () => {
        setOpenAlertMissingCertificates(false);
      };

    const uploadResult=(event, args) => {
        props.onactiontoperform({ action: "FINISH UPLOAD IMAGES", values: args });
    }

    const checkUploadCertificatesAndUploadData=(event,result)=>{
        
        console.log("checkUploadCertificatesAndUploadData");
        
        if(result){
            props.onactiontoperform({ action: "RUN UPLOAD IMAGES", values: "false" });
            ipcRenderer.send('MinioUpload', props.anonimizationdir, null);
        }else{
            setOpenAlertMissingCertificates(true);
        }
    }

    //Component did unmount
    useEffect(() => {
        ipcRenderer.on('uploadResult', (event, args) => uploadResult(event,args));
        ipcRenderer.on("onCheckUploadCerticates",(event,args)=> checkUploadCertificatesAndUploadData(event,args));
        return () => {
            ipcRenderer.removeListener('uploadResult', uploadResult);
            ipcRenderer.removeListener("checkUploadCerticates",checkUploadCertificatesAndUploadData);
        }
    }, []);

    const uploadImages = () => {
        
        ipcRenderer.send("checkUploadCerticates");
        //ipcRenderer.send('MinioUpload', props.anonimizationdir, null);
        
    }


    const renderSteps = (files, uploadingImages, runningAnonimization, anonimizationdir,datauploadedsuccesfully) => {

        if (uploadingImages) {
            return (
                <div className="grid-block vertical ">
                    <div className={"grid-block align-center shrink " + classes.label1}>Uploading Images</div>
                    <div className={"grid-block align-center shrink " + classes.label2}>Please wait upto the file upload process finish</div>
                    <div className={"grid-block align-center shrink " + classes.stepers}>
                        {/*<NavigateToAnonimizerLeftSVG onclickcomponent={() => props.onactiontoperform({ action: "GO TO FILER", "values": false })} />*/}
                        <Step1SVG done={true} />
                        <Step2SVG done={true} />
                        <Step3RunningSVG done={false} />
                    </div>
                </div>);
        }else if(datauploadedsuccesfully){
            return (
                <div className="grid-block vertical ">
                    <div className={"grid-block align-center shrink " + classes.label1}>Upload Images done</div>
                    <div className={"grid-block align-center shrink " + classes.label2}>Data uploaded succesfully</div>
                    <div className={"grid-block align-center shrink " + classes.stepers}>
                        <NavigateToAnonimizerLeftSVG onclickcomponent={() => props.onactiontoperform({ action: "GO TO ANONIMIZATION", "values": false })} />
                        <Step1SVG done={true} />
                        <Step2SVG done={true} />
                        <Step3SVG done={true} />
                        <NavigateToFilerRightSVG onclickcomponent={() => props.onactiontoperform({ action: "UPLOAD NEW CASES", "values": false })} />
                    </div>
                </div>)
        } else {
            return (
                <div className="grid-block vertical ">
                    <div className={"grid-block align-center shrink " + classes.label1}>Upload Images</div>
                    <div className={"grid-block align-center shrink " + classes.label2}>Click the big button to upload the images</div>
                    <div className={"grid-block align-center shrink " + classes.stepers}>
                        <NavigateToAnonimizerLeftSVG onclickcomponent={() => props.onactiontoperform({ action: "GO TO ANONIMIZATION", "values": false })} />
                        <Step1SVG done={true} />
                        <Step2SVG done={true} />
                        <Step3SVG done={true} />
                        
                    </div>
                </div>)
        }
    }

    const renderMissingCertificatesAlert=()=>{
        return(
                  <Dialog
                    open={openAlertMissingCertificates}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                  >
                    <DialogTitle id="alert-dialog-slide-title">{"Upload credentials are not installed"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-slide-description">
                        Please, ask the Admin for the credentials and move the minio.json file to the folder Documents/remimagineclient/.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose} color="primary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
        )
    }

    return (
        <div className={"grid-block vertical " + classes.root}>
            <div className="grid-block align-center">
                <div className="grid-block align-center">
                    <div className="grid-block shrink"><UploadToCloudSVG onclickcomponent={uploadImages} /></div>
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
            {renderSteps(props.files, props.uploadingimages, props.runninganonimization, props.anonimizationdir,props.datauploadedsuccesfully)}
            {renderMissingCertificatesAlert()}
        </div>
    );
}