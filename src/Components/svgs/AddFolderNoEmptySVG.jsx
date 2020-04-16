import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    root: {
        "&:hover":{
            "& .circle":{
                backgroundColor:"red"
            }
        },
    }
}));

export const AddFolderNoEmptySVG = (props) => {
    const classes = useStyles();
    return (
        <IconButton className={classes.root} edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={props.onclickcomponent}>
        <svg width="361" height="363" viewBox="0 0 361 363" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0)">
        <g filter="url(#filter0_d)">
        <path d="M180.5 363C280.187 363 361 281.74 361 181.5C361 81.2603 280.187 0 180.5 0C80.8126 0 0 81.2603 0 181.5C0 281.74 80.8126 363 180.5 363Z" fill="#01F5C0"/>
        <path d="M360.5 181.5C360.5 281.466 279.909 362.5 180.5 362.5C81.0913 362.5 0.5 281.466 0.5 181.5C0.5 81.5339 81.0913 0.5 180.5 0.5C279.909 0.5 360.5 81.5339 360.5 181.5Z" stroke="black"/>
        </g>
        </g>
        <path d="M258.5 123.5H183.5L164.75 104H108.5C98.0938 104 89.8437 112.677 89.8437 123.5L89.75 240.5C89.75 251.323 98.0938 260 108.5 260H258.5C268.906 260 277.25 251.323 277.25 240.5V143C277.25 132.177 268.906 123.5 258.5 123.5ZM249.125 201.5H221V230.75H202.25V201.5H174.125V182H202.25V152.75H221V182H249.125V201.5Z" fill="white"/>
        <defs>
        <filter id="filter0_d" x="-21" y="-17" width="403" height="405" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="10.5"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <clipPath id="clip0">
        <rect width="361" height="363" fill="white"/>
        </clipPath>
        </defs>
        </svg>
        </IconButton>
    );
}












