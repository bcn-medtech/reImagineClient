import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Logo } from './svgs/Logo';
import IconButton from '@material-ui/core/IconButton';
import ScreenShare from '@material-ui/icons/ScreenShare';

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
  grow: {
    flexGrow: 1,
  }
}));

export const TopBar = (props) => {
  const classes = useStyles();

  const handleGoHome = () => {
    props.onactiontoperform({action:"GO TO FILER", values:false})
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Logo onClickHandler={handleGoHome}/>
          <Typography variant="h6" color="inherit">
            reImagine Client
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label="show more"
              aria-haspopup="true"
              color="inherit"
              onClick={()=>{props.onactiontoperform({action:"GO TO INSTALLERS", values:false})}}
            >
              <ScreenShare />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}