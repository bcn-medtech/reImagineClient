import React from 'react';
//import { Container, makeStyles } from '@material-ui/core';
import { Container } from '@material-ui/core';
import Box from '@material-ui/core/Box'
import Tabs from '../Components/Tabs';
import AppBar from '../Components/AppBar';

/*
const useStyles = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(1),
    }
}));
*/

export default function InstallersPage(props) {

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
