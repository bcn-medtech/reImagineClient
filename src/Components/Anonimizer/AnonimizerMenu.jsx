import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        color: "white"
    },
    menuItem: {
        marginLeft: "14px",
        paddingBottom: "5px",
        fontSize: "14pt",
        marginBottom: "10px",
        color: "#f4f4f4",
        borderBottom: "3px solid white",
        cursor:"pointer",
        "&:hover":{
            color: "rgb(248, 109, 112)",
            borderBottom: "3px solid rgb(248, 109, 112)"
        }
    },

    menuItemSelected: {
        marginLeft: "14px",
        paddingBottom: "5px",
        fontSize: "14pt",
        marginBottom: "10px",
        color: "rgb(248, 109, 112)",
        borderBottom: "3px solid rgb(248, 109, 112)",
        cursor:"pointer"
    }

}));


export const AnonimizerMenu = (props) => {

    const classes = useStyles();

    let notesDOM=<div className={"grid-block shrink " + classes.menuItem} onClick={()=>{props.onactiontoperform({action:"CHANGE_TAB_TO_NOTES"})}}>Notes</div>
    let foldersDOM=<div className={"grid-block shrink " + classes.menuItem} onClick={()=>{props.onactiontoperform({action:"CHANGE_TAB_TO_FOLDERS"})}}>Folders</div>

    if(props.currentmenuitem==="notes"){
        notesDOM=<div className={"grid-block shrink " + classes.menuItemSelected}>Notes</div>
    }else{
        foldersDOM=<div className={"grid-block shrink " + classes.menuItemSelected}>Folders</div>
    }

    return (
        <div className={"grid-block shrink " + classes.root}>
           {notesDOM}
           {foldersDOM}
        </div>);
}