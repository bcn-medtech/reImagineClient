import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

//Components
import { Step1SVG } from './svgs/Step1SVG';
import { Step2SVG } from './svgs/Step2SVG';
import { Step3SVG } from './svgs/Step3SVG';
import { NavigateToAnonimizerRightSVG } from './svgs/NavigateToAnonimizerRightSVG';
import { NavigateToUploaderRightSVG } from './svgs/NavigateToUploaderRightSVG';
import { NavigateToAnonimizerLeftSVG } from './svgs/NavigateToAnonimizerLeftSVG';

// Forms
import Form from "@rjsf/core"

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

const schema = {
    title: "Todo",
    type: "object",
    required: ["title"],
    properties: {
        title: {type: "string", title: "Title", default: "A new task"},
        done: {type: "boolean", title: "Done?", default: false},        
    }
};

const formData = {
    title: "Test task",
    done: true
}

export const Metadata = (props) => {

    const classes = useStyles();
    const [formData, setFormData] = useState(formData);
    
    const renderSteps = (files, anonimizationdir) => {
        return (
            <div className="grid-block vertical ">
                <div className={"grid-block align-center shrink " + classes.label1}>Add study metadata</div>
                <div className={"grid-block align-center shrink " + classes.label2}>Complete the form</div>
                <div className={"grid-block align-center shrink " + classes.stepers}>
                    <NavigateToAnonimizerLeftSVG onclickcomponent={() => props.onactiontoperform({ action: "GO TO ANONIMIZATION", "values": false })} />
                    <Step1SVG done={true} />
                    <Step2SVG done={true} />
                    <Step3SVG done={true} />
                    <NavigateToUploaderRightSVG onclickcomponent={() => props.onactiontoperform({ action: "GO TO UPLOADER", "values": false })} />
                </div>
            </div>
        )
    }
    
    return (
        <div className={"grid-block vertical " + classes.root}>
            <div className="grid-block align-center">
                <div className="grid-block align-center">
                    <div className="grid-block shrink">
                        <Form schema={schema}
                            formData={formData}
                            onChange={(ev) => {
                                console.log("Form Changed! "+ev)
                            }}
                            onSubmit={ ({formData}, e) => {
                                console.log("Data submitted: ", formData)
                            }}
                            onError={(ev) => {
                                console.log("Form ERROR! "+ev)
                            }}
                        />                        
                    </div>
                    <div className="grid-block shrink vertical">
                        <div className="grid-block">&nbsp;</div>
                        <div className="grid-block shrink">

                        </div>
                        <div className="grid-block">&nbsp;</div>
                    </div>
                </div>
            </div>
            {renderSteps(props.files, props.anonimizationdir)}
        </div>
    );
}