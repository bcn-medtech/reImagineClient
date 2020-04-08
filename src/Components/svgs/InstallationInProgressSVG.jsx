import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {}
}));

export const InstallationInProgressSVG = (props) => {
    const classes = useStyles();
    const done = props.done;
    let opacity = "0.2";

    if (done) {
        opacity = "1";
    }

    const circularProgressStyle = {
        position: "absolute",
        zIndex: 10,
        marginTop: "-5px",
        color: "#f1f1f1"
    }

    return (
        <IconButton className={classes.root} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <svg width="122" height="122" viewBox="0 0 122 122" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d)">
                    <path d="M61 97C83.0914 97 101 79.0914 101 57C101 34.9086 83.0914 17 61 17C38.9086 17 21 34.9086 21 57C21 79.0914 38.9086 97 61 97Z" fill="#FFC107" />
                </g>
                <path d="M79 45.5644L70.95 39L68.675 41.5248L76.725 48.0891L79 45.5644ZM54.325 41.6931L52.05 39.1683L44 45.5644L46.275 48.0891L54.325 41.6931V41.6931ZM62.375 49.4356H59.75V59.5347L67.975 64.4158L69.375 62.396L62.375 58.3564V49.4356ZM61.5 42.703C52.75 42.703 45.75 49.4356 45.75 57.8515C45.75 66.2673 52.75 73 61.5 73C70.25 73 77.25 66.2673 77.25 57.8515C77.25 49.4356 70.25 42.703 61.5 42.703ZM61.5 69.6337C54.675 69.6337 49.25 64.4158 49.25 57.8515C49.25 51.2871 54.675 46.0693 61.5 46.0693C68.325 46.0693 73.75 51.2871 73.75 57.8515C73.75 64.4158 68.325 69.6337 61.5 69.6337Z" fill="white" />
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
            <CircularProgress className="circularprogress" size={82} className={classes.buttonProgress} style={circularProgressStyle} />
        </IconButton>
    );
}