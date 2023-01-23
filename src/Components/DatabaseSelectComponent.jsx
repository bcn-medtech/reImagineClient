import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Select, InputLabel} from '@material-ui/core';

import MenuItem from '@material-ui/core/MenuItem';


export class DatabaseSelectComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKey: '',
        };
    }

      

    handleChangeKey = event => {
        this.setState({ selectedKey: event.target.value });
    };

    render() {
        const  lista  = this.props.lista;
        const {  selectedKey } = this.state;
        const label=this.props.label;
        return ( 
            
                <div>
                    <InputLabel id="ChiaveDueLabel">{label}</InputLabel>
                    <Select
                        labelId="ChiaveDueLabel"
                        id="ChiaveDue"
                        value={selectedKey}
                        onChange={this.handleChangeKey}
                        
                    >
                        {lista.map(item => (
                            <MenuItem key={item} value={item}> {item}</MenuItem>
                        ))}
                    </Select>
                </div>  
             
       );
    }
}      

