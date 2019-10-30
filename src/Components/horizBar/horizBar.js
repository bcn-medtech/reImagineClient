import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/styles';

export default function FormControlLabelPosition(props) {
  const [value, setValue] = React.useState('DeepRad');

  const handleChange = event => {
    setValue(event.target.value);
  };

  const useStyles = makeStyles(theme => ({
    root: {
      marginLeft: '0px',
      display: 'flex',
    }
  }));

  function passProp(value) { 
    props.pacsValue(value)
  }


  return (
    <div className={useStyles.root}>
      <FormControl component="fieldset">
        {/* <FormLabel component="legend">Pacs selector</FormLabel> */}
        <RadioGroup aria-label="position" name="position" value={value} onChange={handleChange} row>
          <FormControlLabel
            value="USImage"
            control={<Radio color="primary" />}
            label="USImage"
            labelPlacement="start"
            onChange={() => passProp(value)}
          />
          <FormControlLabel
            value="DeepRad"
            control={<Radio color="secondary" />}
            label="DeepRad"
            labelPlacement="start"
            onChange={() => passProp(value)}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}