import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    root: {}
}));

export const Logo = () => {
    const classes = useStyles();
    return (
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0327 25.5381L24.7315 19.3617C25.4034 18.9741 25.8428 18.2505 25.8428 17.4494V5.09657C25.8428 4.68309 25.7136 4.29545 25.5068 3.93365H25.481C25.3001 4.21792 25.0417 4.47635 24.7315 4.65725L19.3563 7.75836C19.4855 8.04263 19.563 8.37859 19.563 8.6887V13.8055C19.563 14.6067 19.1495 15.3303 18.4518 15.7179L14.0327 18.2763C13.3608 18.664 12.508 18.664 11.8102 18.2763L7.39113 15.7179C6.71922 15.3303 6.2799 14.5808 6.2799 13.8055V8.71454C6.2799 8.37859 6.35743 8.06848 6.48664 7.78421L1.11137 4.68309C0.801262 4.50219 0.542835 4.24377 0.361937 3.9595H0.336094C0.129353 4.29545 0.000139236 4.70893 0.000139236 5.12242V17.501C0.000139236 18.3022 0.413622 19.0258 1.11137 19.4134L11.8102 25.5898C12.508 25.9516 13.3349 25.9516 14.0327 25.5381Z" fill="url(#paint0_linear)" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0327 10.8337L19.3563 7.75839L24.7315 4.65728C25.0416 4.47638 25.3001 4.21795 25.481 3.93368V3.90784C25.3001 3.59773 25.0416 3.3393 24.7057 3.15841L20.7001 0.858411C20.1315 0.522457 19.4079 0.522457 18.8394 0.858411L14.0068 3.64942C13.6709 3.85616 13.2832 3.93368 12.8956 3.93368C12.508 3.93368 12.1203 3.83031 11.7844 3.64942L6.97763 0.858411C6.40909 0.522457 5.6855 0.522457 5.11696 0.858411L1.08551 3.18425C0.775398 3.36515 0.491131 3.62357 0.310232 3.93368V3.95953C0.491131 4.26964 0.749557 4.50222 1.05967 4.68312L6.43494 7.78424L11.7585 10.8595C12.508 11.2471 13.3349 11.2471 14.0327 10.8337Z" fill="url(#paint1_linear)" />
                <defs>
                    <linearGradient id="paint0_linear" x1="0.000177745" y1="3.93365" x2="0.000177745" y2="25.8549" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#00BDC7" />
                        <stop offset="1" stop-color="#00FFE1" />
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="0.310171" y1="0.606445" x2="0.310171" y2="11.1471" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#00D4A9" />
                        <stop offset="0.525" stop-color="#00F2C2" />
                        <stop offset="1" stop-color="#00FFB3" />
                    </linearGradient>
                </defs>
            </svg>
        </IconButton>
    );
}