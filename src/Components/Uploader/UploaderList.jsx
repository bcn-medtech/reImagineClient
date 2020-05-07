import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
//Components
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';

//Electron 
const { ipcRenderer } = window.require("electron");

const useStyles = makeStyles((theme) => ({
    list: {
        "& .MuiButtonBase-root": {
            "& svg": {
                fill: "gray"
            },
            "&:hover": {
                "& svg": {
                    fill: "rgb(248, 109, 112)"
                }
            },
            display:"none"
        },

        "& .MuiListItem-container:hover":{
            "& .MuiButtonBase-root":{
                display:"block"
            },
            "& .MuiAvatar-colorDefault":{
                backgroundColor:"#969595"
            },
            cursor:"pointer"
        },
        "& .MuiAvatar-root":{
            "&:hover":{
                backgroundColor:"rgb(255, 193, 7)"
            }
            
        }
    },
    textList: {
        color: "white"
    }
}));

export const UploaderList = (props) => {

    const classes = useStyles();
    const files = props.files;

    const openFolder=(path)=>{
        ipcRenderer.send("open-folder",path);
    }


    return (
        <List dense={true} className={classes.list}>
            {
                files.map((value, idx) => {

                    let text=value;

                    if(value.length>40){
                        text=value.substr(0, 40 - 3)+"...";
                    }

                    return (
                        <ListItem key={idx}>
                        <ListItemAvatar onClick={()=>{openFolder(value)}} style={{cursor: 'pointer'}}>
                                <Avatar>
                                    <FolderIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Typography className={classes.textList}>{text}</Typography>}
                                style={{ wordBreak: 'break-all' }}
                            />
                        </ListItem>
                    )
                })
            }
        </List>
    );
}