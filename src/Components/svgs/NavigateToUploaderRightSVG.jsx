import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        right: "18px",
        top: "25px",
        cursor: "pointer",
        "&:hover":{
            "& .svgitem":{
                fill:"white"
            },
            "& .svgitem1":{
                stroke:"white"
            }
        }

    },
    label:{
        color:"rgb(255, 193, 7)",
        marginTop: "34px",
        marginRight: "-9px"
    }
}));

export const NavigateToUploaderRightSVG = (props) => {
    const classes = useStyles();
    return (
        <div className={"grid-block shrink "+classes.root} onClick={props.onclickcomponent}>
            <div className={"grid-block shrink "+classes.label}>
                Go to Anonimization
            </div>
            <div className="grid-block shrink">
            <svg  width="94" height="94" viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0)">
                <path d="M50.7717 51.07C50.4184 51.4145 49.8654 51.4111 49.5164 51.0622C49.1791 50.7251 49.1826 50.1676 49.524 49.8356L55.9287 43.5922L34.923 43.4609C34.4334 43.4579 34.0466 43.0713 34.0496 42.588C34.0526 42.1047 34.4443 41.7105 34.934 41.7135L55.9404 41.8448L49.6142 35.5344C49.277 35.1856 49.2805 34.6273 49.622 34.2953C49.9753 33.9508 50.5283 33.9543 50.8773 34.3031L58.701 42.1229C59.0383 42.4599 59.0348 43.0174 58.6934 43.3495L50.7717 51.07Z" fill="rgb(255, 193, 7)" className="svgitem"/>
            </g>
            <g filter="url(#filter0_d)">
                <path d="M23.5001 42.9478C23.5289 29.9692 34.0735 19.4712 47.0522 19.5001C60.0309 19.5289 70.5288 30.0735 70.5 43.0522C70.4712 56.0308 59.9265 66.5288 46.9478 66.4999C33.9692 66.4711 23.4713 55.9265 23.5001 42.9478Z" stroke="rgb(255, 193, 7)" stroke-width="3" className="svgitem1"/>
            </g>
            <defs>
                <filter id="filter0_d" x="0.94458" y="0.94455" width="92.1109" height="92.1109" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="10.5" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
                <clipPath id="clip0">
                    <rect x="59.028" y="30.4476" width="24.5793" height="24.9012" transform="rotate(90.3581 59.028 30.4476)" fill="white" />
                </clipPath>
            </defs>
        </svg>
            </div>
            
        </div>
        
    );
}