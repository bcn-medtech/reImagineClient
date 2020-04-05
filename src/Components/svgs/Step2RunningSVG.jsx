import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {}
}));

export const Step2RunningSVG = (props) => {
    const classes = useStyles();
    const done = props.done;
    let opacity="0.2";
    
    if(done){
        opacity="1";
    }

    const circularProgressStyle={
        position: "absolute",
        zIndex: 10,
        marginTop: "-5px",
        color: "#f1f1f1"
    }

    return (
        <IconButton className={classes.root} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <svg width="122" height="122" viewBox="0 0 122 122" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d)">
                    <path d="M61 97C83.0914 97 101 79.0914 101 57C101 34.9086 83.0914 17 61 17C38.9086 17 21 34.9086 21 57C21 79.0914 38.9086 97 61 97Z" fill="#F86D70" />
                </g>
                <path opacity={opacity} d="M60.1992 46.0039C59.5742 46.0039 58.9883 46.1211 58.4414 46.3555C57.9076 46.5898 57.4388 46.9089 57.0352 47.3125C56.6315 47.7161 56.3125 48.1914 56.0781 48.7383C55.8438 49.2721 55.7266 49.8516 55.7266 50.4766V51.6094L53.207 51.1992V50.4766C53.207 49.526 53.3828 48.6341 53.7344 47.8008C54.099 46.9674 54.5938 46.2383 55.2188 45.6133C55.8438 44.9883 56.5729 44.5 57.4062 44.1484C58.2396 43.7839 59.1315 43.6016 60.082 43.6016H61.2734C62.224 43.6016 63.1159 43.7708 63.9492 44.1094C64.7956 44.4479 65.5312 44.9362 66.1562 45.5742C66.7812 46.2122 67.2695 46.9805 67.6211 47.8789C67.9857 48.7643 68.168 49.7669 68.168 50.8867C68.168 51.9935 67.9987 53.1068 67.6602 54.2266C67.3346 55.3464 66.8984 56.4466 66.3516 57.5273C65.8177 58.6081 65.1992 59.6562 64.4961 60.6719C63.806 61.6875 63.0964 62.6445 62.3672 63.543C60.6615 65.6393 58.7279 67.6576 56.5664 69.5977H68.3633V72H52.6016V70.0078C55.0365 68.0026 57.2109 65.9258 59.125 63.7773C59.9453 62.8529 60.7461 61.8698 61.5273 60.8281C62.3086 59.7865 63.0052 58.7188 63.6172 57.625C64.2292 56.5182 64.7174 55.3984 65.082 54.2656C65.4596 53.1198 65.6484 51.9935 65.6484 50.8867C65.6484 50.0664 65.5247 49.3503 65.2773 48.7383C65.0299 48.1263 64.6979 47.6185 64.2812 47.2148C63.8646 46.8112 63.3828 46.5117 62.8359 46.3164C62.3021 46.1081 61.7422 46.0039 61.1562 46.0039H60.1992Z" fill="white" />
                <defs>
                    <filter id="filter0_d" x="0" y="0" width="122" height="122" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="10.5" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                    </filter>
                </defs>
            </svg>
            <CircularProgress className="circularprogress" size={82} className={classes.buttonProgress} style={circularProgressStyle}/>
        </IconButton>
    );
}