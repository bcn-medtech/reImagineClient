import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    root: {}
}));

export const CheckSVG = (props) => {
    const classes = useStyles();
    const done = props.done;
    let opacity = "0.2";

    if (done) {
        opacity = "1";
    }

    return (
            <svg width="92" height="92" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d)">
                    <path d="M46 67C59.8071 67 71 55.8071 71 42C71 28.1929 59.8071 17 46 17C32.1929 17 21 28.1929 21 42C21 55.8071 32.1929 67 46 67Z" fill="#01F5C0" />
                </g>
                <path d="M44.3182 48.4478L38.8295 43.1194L37 44.8955L44.3182 52L60 36.7761L58.1705 35L44.3182 48.4478Z" fill="white" />
                {/*<defs>
                    <filter id="filter0_d" x="0" y="0" width="92" height="92" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="10.5" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                    </filter>
                </defs>*/}
            </svg>

    );
}