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

export const AddFolderEmptySVG = (props) => {
    const classes = useStyles();
    return (
        <IconButton className={classes.root} edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={props.onclickcomponent}>
            <svg width="361" height="363" viewBox="0 0 361 363" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0)">
                    <g filter="url(#filter0_d)">
                        <path className="circle" d="M180.5 363C280.187 363 361 281.74 361 181.5C361 81.2603 280.187 0 180.5 0C80.8126 0 0 81.2603 0 181.5C0 281.74 80.8126 363 180.5 363Z" fill="#01F5C0" />
                        <path d="M360.5 181.5C360.5 281.466 279.909 362.5 180.5 362.5C81.0913 362.5 0.5 281.466 0.5 181.5C0.5 81.5339 81.0913 0.5 180.5 0.5C279.909 0.5 360.5 81.5339 360.5 181.5Z" stroke="black" />
                    </g>
                </g>
                <g filter="url(#filter1_d)">
                    <path d="M162.75 106.333H106.5C96.0938 106.333 87.75 115.085 87.75 126V244C87.75 249.216 89.7254 254.218 93.2417 257.906C96.7581 261.595 101.527 263.667 106.5 263.667H256.5C261.473 263.667 266.242 261.595 269.758 257.906C273.275 254.218 275.25 249.216 275.25 244V145.667C275.25 134.752 266.812 126 256.5 126H181.5L162.75 106.333Z" fill="white" />
                </g>
                <defs>
                    <filter id="filter0_d" x="-21" y="-17" width="403" height="405" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="10.5" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                    </filter>
                    <filter id="filter1_d" x="83.75" y="106.333" width="195.5" height="165.333" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                    </filter>
                    <clipPath id="clip0">
                        <rect width="361" height="363" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </IconButton>
    );
}