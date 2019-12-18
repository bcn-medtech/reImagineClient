import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Select, Typography, FormControl, MenuItem, InputLabel} from '@material-ui/core';
import constants from '../conf/constants.json';

const useStyles = makeStyles(theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function ControlledOpenSelect(props) {
  const classes = useStyles();
  const [age, setAge] = React.useState('32713');
  const [open, setOpen] = React.useState(false);


  React.useEffect(() => {
    props.pacsValue('32713');
  }, [])

  const handleChange = event => {
    setAge(event.target.value);
    props.pacsValue(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  function items() {
    return (
      Object.keys(constants.PORTS).map((key) => {
        return (
          <MenuItem value={constants.PORTS[key]}>{key}</MenuItem>
        )  
      })
    )
  }

  return (

    <div>
      <Typography style={{ textAlign: "left", marginTop: '5px' }}>
          Select destination (Default: DEEPRAD)
      </Typography>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">PACS</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={age}
          onChange={handleChange}>
          {items()}
        </Select>
      </FormControl>
    </div>
  );
}