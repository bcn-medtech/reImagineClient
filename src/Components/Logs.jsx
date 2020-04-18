import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography} from '@material-ui/core';
const fs = window.require('fs')

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

export const Logs = (props) => {

    const classes = useStyles();
    const [logs, setLogs] = useState("")
    var stream = null

    useEffect(() => {
        openLogs()
        return () => { //Close the stream
            if (stream) {
                stream.close();
                stream.push(null);
                stream.read(0);
            }
        }
    }, []);

    const openLogs = () => {
        
        try {
            stream = fs.createReadStream(props.logFile)

            stream.on('data', data => {
                setLogs(logs.concat(data.toString()))
              })   

        } catch(e) {
            console.log(e)
        }

        
    }

    const renderLogs = () => {
        
        return (
            logs.split("\n").map((i,key) => {
                return <div key={key}>{i}</div>
            })
        )

    }

    return (
        <div className={classes.panel}>
            <Typography className={classes.logs}>
                {renderLogs()}
            </Typography>
        </div>
    );
}