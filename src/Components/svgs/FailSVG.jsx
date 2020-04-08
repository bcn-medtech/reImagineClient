import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    root: {}
}));

export const FailSVG = (props) => {
    const classes = useStyles();
    const done = props.done;
    let opacity = "0.2";

    if (done) {
        opacity = "1";
    }

    return (
       
            <svg width="92" height="92" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d)">
                    <path d="M46 67C59.8071 67 71 55.8071 71 42C71 28.1929 59.8071 17 46 17C32.1929 17 21 28.1929 21 42C21 55.8071 32.1929 67 46 67Z" fill="#F86D70" />
                </g>
                <path d="M53 37.41L51.59 36L46 41.59L40.41 36L39 37.41L44.59 43L39 48.59L40.41 50L46 44.41L51.59 50L53 48.59L47.41 43L53 37.41Z" fill="white" />
            </svg>
    );
}