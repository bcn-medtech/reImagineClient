import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    root: {}
}));

export const InstallationNotDoneSVG = (props) => {
    const classes = useStyles();
    const done = props.done;
    let opacity = "0.2";

    if (done) {
        opacity = "1";
    }

    return (
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={props.onclickcomponent}>
        <svg width="122" height="122" viewBox="0 0 122 122" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d)">
        <path d="M61 97C83.0914 97 101 79.0914 101 57C101 34.9086 83.0914 17 61 17C38.9086 17 21 34.9086 21 57C21 79.0914 38.9086 97 61 97Z" fill="#F86D70"/>
        </g>
        <path d="M56.3333 68.8333L70.5 58L56.3333 47.1667V68.8333Z" fill="white"/>
        <defs>
        <filter id="filter0_d" x="0" y="0" width="122" height="122" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="10.5"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        </defs>
        </svg>
        </IconButton>
    );
}