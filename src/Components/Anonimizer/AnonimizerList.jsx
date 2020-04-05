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
        }
    },
    textList: {
        color: "white"
    }
}));

export const AnonimizerList = (props) => {

    const classes = useStyles();
    const files = props.files;

    return (
        <List dense={true} className={classes.list}>
            {
                files.map((value, idx) => {
                    return (
                        <ListItem key={idx}>
                            <ListItemAvatar>
                                <Avatar>
                                    <FolderIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Typography className={classes.textList}>{value}</Typography>}
                                style={{ wordBreak: 'break-all' }}
                            />
                            <ListItemSecondaryAction className={classes.removeItem}>
                                <IconButton edge="end" aria-label="delete" onClick={() => props.onactiontoperform({action:"DELETE FOLDER",values:value})}>
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                })
            }
        </List>
    );
}