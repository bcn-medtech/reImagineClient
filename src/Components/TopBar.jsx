import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Logo} from './svgs/Logo';

import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiAppBar-colorPrimary": {
      backgroundColor: "#1B1C1E"
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

export const TopBar = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Logo/>
          <Typography variant="h6" color="inherit">
            Reimagine Client
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}