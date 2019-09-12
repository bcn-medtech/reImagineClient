import React, { Component } from 'react';
import { Container, Button, makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box'
import Tabs from '../../Components/Tabs/Tabs';
import AppBar from '../../Components/AppBar/AppBar';
import { getThemeProps } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(1),
    }
}));


export default function InstallersPage(props) {
    const classes = useStyles()
    console.log(props);

    return (
        <div>
            <AppBar page='installers' history={props.history} />
            <Container>
                <Box boxShadow={1}>
                    <Tabs/>
                </Box>
            </Container>
        </div>
    );

}