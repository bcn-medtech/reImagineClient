import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        left: "18px",
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
        color:"rgb(248, 109, 112)",
        marginTop: "34px",
        marginRight: "-9px"
    
    }
}));

export const NavigateToAnonimizerLeftSVG = (props) => {
    const classes = useStyles();
    return (
        <div className={"grid-block shrink " + classes.root} onClick={props.onclickcomponent}>
            <div className="grid-block shrink">
                <svg width="92" height="92" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0)">
                        <path d="M42.2104 33.9383C42.563 33.5931 43.1159 33.5953 43.4658 33.9434C43.8038 34.2797 43.8015 34.8372 43.4608 35.1701L37.07 41.4276L58.0759 41.5122C58.5656 41.5142 58.9532 41.8999 58.9513 42.3833C58.9493 42.8666 58.5586 43.2617 58.0689 43.2597L37.0622 43.175L43.4024 49.4714C43.7403 49.8194 43.7381 50.3777 43.3974 50.7105C43.0448 51.0558 42.4919 51.0535 42.142 50.7054L34.301 42.9031C33.963 42.5668 33.9652 42.0093 34.3059 41.6765L42.2104 33.9383Z" fill="rgb(248, 109, 112)" className="svgitem"/>
                    </g>
                    <g filter="url(#filter0_d)">
                        <path d="M69.5 42C69.5 54.9787 58.9787 65.5 46 65.5C33.0213 65.5 22.5 54.9787 22.5 42C22.5 29.0213 33.0213 18.5 46 18.5C58.9787 18.5 69.5 29.0213 69.5 42Z" stroke="rgb(248, 109, 112)" stroke-width="3" className="svgitem1"/>
                    </g>
                    <defs>
                        <filter id="filter0_d" x="0" y="0" width="92" height="92" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                            <feOffset dy="4" />
                            <feGaussianBlur stdDeviation="10.5" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                        </filter>
                        <clipPath id="clip0">
                            <rect x="34" y="54.5791" width="24.5793" height="24.9012" transform="rotate(-89.7691 34 54.5791)" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </div>
            <div className={"grid-block shrink " + classes.label}>
                Go to Anonimization
            </div>
        </div>
    );
}