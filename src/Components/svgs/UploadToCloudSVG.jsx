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

export const UploadToCloudSVG = (props) => {
    const classes = useStyles();
    return (
        <IconButton className={classes.root} edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={props.onclickcomponent}>
        <svg width="361" height="363" viewBox="0 0 361 363" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0)">
        <g filter="url(#filter0_d)">
        <path d="M180.5 363C280.187 363 361 281.74 361 181.5C361 81.2603 280.187 0 180.5 0C80.8126 0 0 81.2603 0 181.5C0 281.74 80.8126 363 180.5 363Z" fill="#FFC107"/>
        <path d="M360.5 181.5C360.5 281.466 279.909 362.5 180.5 362.5C81.0913 362.5 0.5 281.466 0.5 181.5C0.5 81.5339 81.0913 0.5 180.5 0.5C279.909 0.5 360.5 81.5339 360.5 181.5Z" stroke="black"/>
        </g>
        </g>
        <g filter="url(#filter1_d)">
        <path d="M253.938 148.843C254.315 146.412 254.503 143.98 254.503 141.346C254.503 117.843 236.799 99 215.141 99C198.567 99 184.253 110.144 178.415 125.745C172.2 119.464 163.913 115.614 154.685 115.614C135.474 115.614 120.031 132.229 120.031 152.895C120.031 154.719 120.219 156.34 120.407 158.163C118.712 157.758 117.017 157.758 115.322 157.758C98.5602 157.758 85 172.346 85 190.379C85 208.412 98.5602 223 115.322 223H247.346C266.556 223 282 206.386 282 185.719C282 167.281 269.946 152.288 253.938 148.843Z" fill="white"/>
        </g>
        <path d="M163.378 261H200.622V213.293H221L182 167L143 213.293H163.378V261Z" fill="#979797"/>
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
        <filter id="filter1_d" x="74" y="92" width="219" height="146" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="5.5"/>
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