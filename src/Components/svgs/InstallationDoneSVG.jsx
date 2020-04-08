import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    root: {}
}));

export const InstallationDoneSVG = (props) => {
    const classes = useStyles();
    const done = props.done;
    let opacity = "0.2";

    if (done) {
        opacity = "1";
    }

    return (
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <svg width="122" height="122" viewBox="0 0 122 122" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d)">
                    <path d="M61 97C83.0914 97 101 79.0914 101 57C101 34.9086 83.0914 17 61 17C38.9086 17 21 34.9086 21 57C21 79.0914 38.9086 97 61 97Z" fill="#01F5C0" />
                </g>
                <path d="M42 72.75H46.0834C47.2063 72.75 48.125 71.8312 48.125 70.7083V52.3333C48.125 51.2104 47.2063 50.2917 46.0834 50.2917H42V72.75ZM82.4863 58.2133C82.7109 57.7029 82.8334 57.1517 82.8334 56.58V54.375C82.8334 52.1292 80.9959 50.2917 78.75 50.2917H67.5209L69.3992 40.7979C69.5013 40.3487 69.44 39.8587 69.2359 39.4504C68.7663 38.5317 68.1742 37.6946 67.4392 36.9596L66.5 36L53.413 49.0871C52.6371 49.8629 52.2084 50.9042 52.2084 51.9862V67.9929C52.2084 70.6062 54.3521 72.75 56.9859 72.75H73.5438C74.973 72.75 76.3204 71.9946 77.0554 70.7696L82.4863 58.2133Z" fill="white" />
                <defs>
                    <filter id="filter0_d" x="0" y="0" width="122" height="122" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="10.5" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                    </filter>
                </defs>
    </svg>
        </IconButton>
    );
}