import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  label: {
      color: "gray",
      fontSize:"20pt",
      paddingTop:"10px"
  }
}));

const computeTime=(seconds)=>{

  let time;

  if(seconds/60 < 1){
    time = seconds+" s";
  }else{
    let minutes= Math.floor(seconds/60);
    let newseconds= seconds-(minutes*60);
    time = minutes+ " m " + newseconds+" s"
  }

  return time;

}

export const Timer = () => {

  const classes = useStyles();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const time= computeTime(seconds);

  return (
    <div className={"grid-block align-center "+classes.label}>
    {time}
    </div>
  );
};