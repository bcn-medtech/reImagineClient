import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    root: {
        "&:hover": {
            "& .circle": {
                backgroundColor: "red"
            }
        },
    }
}));

export const UpdateAppSVG = (props) => {
    const classes = useStyles();
    return (
        <IconButton className={classes.root} edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={props.onclickcomponent}>
            <svg width="403" height="405" viewBox="0 0 403 405" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d)">
                    <path d="M201.5 380C301.187 380 382 298.74 382 198.5C382 98.2603 301.187 17 201.5 17C101.813 17 21 98.2603 21 198.5C21 298.74 101.813 380 201.5 380Z" fill="#007AFF" />
                    <path d="M381.5 198.5C381.5 298.466 300.909 379.5 201.5 379.5C102.091 379.5 21.5 298.466 21.5 198.5C21.5 98.5339 102.091 17.5 201.5 17.5C300.909 17.5 381.5 98.5339 381.5 198.5Z" stroke="black" />
                </g>
                <path d="M271.047 174.963L271.118 174.892L244.923 148.542L237.458 156.05L252.316 170.996C245.697 173.546 240.979 179.921 240.979 187.5C240.979 197.275 248.866 205.208 258.583 205.208C261.118 205.208 263.442 204.642 265.625 203.721V254.792C265.625 258.688 262.456 261.875 258.583 261.875C254.71 261.875 251.542 258.688 251.542 254.792V222.917C251.542 215.125 245.204 208.75 237.458 208.75H230.417V159.167C230.417 151.375 224.079 145 216.333 145H174.083C166.338 145 160 151.375 160 159.167V272.5H230.417V219.375H240.979V254.792C240.979 264.567 248.866 272.5 258.583 272.5C268.301 272.5 276.188 264.567 276.188 254.792V187.5C276.188 182.613 274.216 178.15 271.047 174.963ZM258.583 194.583C254.71 194.583 251.542 191.396 251.542 187.5C251.542 183.604 254.71 180.417 258.583 180.417C262.456 180.417 265.625 183.604 265.625 187.5C265.625 191.396 262.456 194.583 258.583 194.583ZM188.167 251.25V219.375H174.083L202.25 166.25V201.667H216.333L188.167 251.25Z" fill="white" />
                <path d="M155 128.091V136.545L167 125.273L155 114V122.455C141.74 122.455 131 132.544 131 145C131 149.425 132.38 153.539 134.72 157.005L139.1 152.891C137.75 150.552 137 147.846 137 145C137 135.672 145.07 128.091 155 128.091ZM175.28 132.995L170.9 137.109C172.22 139.476 173 142.154 173 145C173 154.328 164.93 161.909 155 161.909V153.455L143 164.727L155 176V167.545C168.26 167.545 179 157.456 179 145C179 140.575 177.62 136.461 175.28 132.995V132.995Z" fill="#FFC107" />
                <defs>
                    <filter id="filter0_d" x="0" y="0" width="403" height="405" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
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