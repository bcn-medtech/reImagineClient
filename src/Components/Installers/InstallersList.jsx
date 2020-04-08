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
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

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
        color: "gray"
    }
}));

export const InstallersList = (props) => {

    const classes = useStyles();
    const softwarelist = props.sofwarelist;

    return (
        <List dense={true} className={classes.list}>
            {
                softwarelist.map((element, idx) => {
                    return (
                        <ListItem key={idx}>
                            {/*<ListItemAvatar>
                                <Avatar>
                                    
                                </Avatar>
                                <AssignmentTurnedInIcon />
                            </ListItemAvatar>*/}
                            
                            <ListItemText
                                primary={<Typography className={classes.textList}>{element.name}</Typography>}
                                style={{ wordBreak: 'break-all' }}
                            />
                        </ListItem>
                    )
                })
            }
        </List>
    );
}