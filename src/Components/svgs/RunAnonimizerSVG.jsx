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

export const RunAnonimizerSVG = (props) => {
    const classes = useStyles();
    return (
        <IconButton className={classes.root} edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={props.onclickcomponent}>
        <svg width="361" height="363" viewBox="0 0 361 363" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0)">
        <g filter="url(#filter0_d)">
        <path d="M180.5 363C280.187 363 361 281.74 361 181.5C361 81.2603 280.187 0 180.5 0C80.8126 0 0 81.2603 0 181.5C0 281.74 80.8126 363 180.5 363Z" fill="#F86D70"/>
        <path d="M360.5 181.5C360.5 281.466 279.909 362.5 180.5 362.5C81.0913 362.5 0.5 281.466 0.5 181.5C0.5 81.5339 81.0913 0.5 180.5 0.5C279.909 0.5 360.5 81.5339 360.5 181.5Z" stroke="black"/>
        </g>
        <g clip-path="url(#clip1)">
        <g filter="url(#filter1_d)">
        <path d="M241.095 191.912C241.432 189.387 241.6 186.777 241.6 184C241.6 181.307 241.432 178.613 241.011 176.088L258.097 162.79C259.612 161.612 260.032 159.339 259.107 157.656L242.947 129.712C241.937 127.861 239.832 127.272 237.981 127.861L217.865 135.941C213.657 132.742 209.196 130.049 204.23 128.029L201.2 106.651C200.863 104.631 199.18 103.2 197.16 103.2H164.84C162.82 103.2 161.221 104.631 160.884 106.651L157.854 128.029C152.888 130.049 148.343 132.827 144.219 135.941L124.103 127.861C122.252 127.187 120.147 127.861 119.137 129.712L103.062 157.656C102.052 159.423 102.388 161.612 104.072 162.79L121.157 176.088C120.737 178.613 120.4 181.391 120.4 184C120.4 186.609 120.568 189.387 120.989 191.912L103.903 205.21C102.388 206.388 101.967 208.661 102.893 210.344L119.053 238.287C120.063 240.139 122.167 240.728 124.019 240.139L144.135 232.059C148.343 235.257 152.804 237.951 157.77 239.971L160.8 261.349C161.221 263.369 162.82 264.8 164.84 264.8H197.16C199.18 264.8 200.863 263.369 201.116 261.349L204.146 239.971C209.112 237.951 213.657 235.257 217.781 232.059L237.897 240.139C239.748 240.812 241.852 240.139 242.862 238.287L259.022 210.344C260.032 208.492 259.612 206.388 258.012 205.21L241.095 191.912ZM181 214.3C164.335 214.3 150.7 200.665 150.7 184C150.7 167.335 164.335 153.7 181 153.7C197.665 153.7 211.3 167.335 211.3 184C211.3 200.665 197.665 214.3 181 214.3Z" fill="white"/>
        </g>
        </g>
        </g>
        <defs>
        <filter id="filter0_d" x="-21" y="-17" width="403" height="405" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="10.5"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <filter id="filter1_d" x="98.4052" y="103.2" width="165.19" height="169.6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="2"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <clipPath id="clip0">
        <rect width="361" height="363" fill="white"/>
        </clipPath>
        <clipPath id="clip1">
        <rect x="79" y="99" width="202" height="202" fill="white"/>
        </clipPath>
        </defs>
        </svg>
        </IconButton>
    );
}






