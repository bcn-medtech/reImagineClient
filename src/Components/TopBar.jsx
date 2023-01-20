import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Logo } from './svgs/Logo';
import IconButton from '@material-ui/core/IconButton';
import ScreenShare from '@material-ui/icons/ScreenShare';
import AppsRoundedIcon from '@material-ui/icons//AppsRounded';
import PostAddIcon from '@material-ui/icons/PostAdd';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AssignmentIcon from '@material-ui/icons/Assignment';

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

  const [auth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);  

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogin = () => {
    console.log("Login request")
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("Logout request")
    setAnchorEl(null);
  };

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
          {auth && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={handleLogin}>LogIn</MenuItem>
                <MenuItem onClick={handleLogout}>LogOut</MenuItem>
              </Menu>
            </div>
          )}
          
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
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label="show logs"
              aria-haspopup="true"
              color="inherit"
              onClick={()=>{props.onactiontoperform({action:"GO TO LOGS", values:false})}}
            >
              <AssignmentIcon/>
            </IconButton>
          </div>
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label="show more"
              aria-haspopup="true"
              color="inherit"
              onClick={()=>{props.onactiontoperform({action:"GO TO DATABASE", values:false})}}
            >
              <AppsRoundedIcon />
            </IconButton>
          </div>
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label="show more"
              aria-haspopup="true"
              color="inherit"
              onClick={()=>{props.onactiontoperform({action:"GO TO ANON_EXCEL", values:false})}}
            >
              <PostAddIcon />
            </IconButton>
          </div>                   
        </Toolbar>
      </AppBar>
    </div>
  );
}