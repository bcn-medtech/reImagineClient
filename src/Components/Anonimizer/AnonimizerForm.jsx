import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// Forms
import Form from "@rjsf/core"

//Electron 
const { ipcRenderer } = window.require("electron");

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#1B1C1E",
        "& #root": {
            border: "1px solid transparent",
            color: "white",
            "& #root__title": {
                fontSize: "22pt"
            },
            "& .control-label": {
                color: "#999",
                fontSize: "13pt"
            },
            "& .form-control": {
                backgroundColor: "transparent",
                color: "white",
                paddingTop: "20px",
                border: "1px solid #8080804a"
            },
            
        },
        "& button, html input[type=button], input[type=reset], input[type=submit]":{
            display:"none"
        }
    }
}));

const initialSchema = {
    title: "Initial schema",
    type: "object",
    properties: {
        ann: { type: "string", title: "Additional data or annotations", default: "" }
    }
}

// const initialData = {
//     ann: "Initial data"
// }

const initialUi = {
    ann: {
        "ui:widget": "textarea"
    }
}

let componentloaded=false;

export const AnonimizerForm = (props) => {

    const [formSchema, setFormSchema] = useState(initialSchema);
    //const [formData, setFormData] = useState(initialData);
    const [formUi, setFormUi] = useState(initialUi);
    const classes = useStyles();
    const formData= props.anonimizationnotes;

    useEffect( () => {
        const loadForm = async () => {
            const result = await ipcRenderer.invoke("load-form");
            if (result.form !== null) {
                setFormSchema(result.form.schema)
                setFormUi(result.form.ui)
                if(componentloaded===false){
                    props.onactiontoperform({action:"INIT_ANONIMIZATION_NOTES",value:result.form.data})
                    componentloaded=true;
                }
            }
        }
        loadForm();
    }, []);

    return (
        <div className={"grid-block shrink " + classes.root}>
            <Form schema={formSchema}
                formData={formData}
                uiSchema={formUi}
                onChange={(event)=>{props.onactiontoperform({action:"CHANGE_ANONIMIZATION_NOTES",value:event.formData})}}
                />
        </div>);
}