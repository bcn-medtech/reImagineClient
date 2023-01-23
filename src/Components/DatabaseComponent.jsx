import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, Button, Table, TableHead, TableBody, TableRow, TableCell, Select, FormControl,InputLabel} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import {DatabaseSelectComponent} from './DatabaseSelectComponent.jsx'

const { ipcRenderer } = window.require("electron");

export class DatabaseComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            selectedKeyOne: 'Chiave Uno',
            selectedKeyTwo: 'Chiave Due',
            listaUno:['Chiave uno'],
            listaDue:['Chiave due']
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    functionExcel() {       
        ipcRenderer.send('open-file-dialog');
        ipcRenderer.on('selected-file',(event, data) => {
          this.setState({ listaUno:data[0],listaDue:data[0] });
      })
    }
      
    fetchData() {
        ipcRenderer.send('readSql');
        ipcRenderer.on('readSql', (event, data) => {
            this.setState({ data:data });
        });
    }

    handleChangeKeyOne = event => {
        this.setState({ selectedKeyOne: event.target.value });
    };

    handleChangeKeyTwo = event => {
        this.setState({ selectedKeyTwo: event.target.value });
    };

    render() {
        //const { listaUno, listaDue } = this.props;
        const { listaUno, listaDue }= this.state;
        const { selectedKeyOne, selectedKeyTwo } = this.state;
        return (
          <Container> 
              <div>
                  {this.state.data ? (
                      <Table>
                          <TableHead>
                              <TableRow>
                                  <TableCell>idx</TableCell>
                                  <TableCell>anoncode</TableCell>
                                  <TableCell>pid</TableCell>
                                  <TableCell>name</TableCell>
                                  <TableCell>accessionNumber</TableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              {this.state.data.map((row, index) => (
                                  <TableRow key={index}>
                                      <TableCell>{row.idx}</TableCell>
                                      <TableCell>{row.anoncode}</TableCell>
                                      <TableCell>{row.pid}</TableCell>
                                      <TableCell>{row.name}</TableCell>
                                      <TableCell>{row.accessionNumber}</TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  ) : (
                      <p>Loading...</p>
                  )}
                  <div style={{ position: 'fixed', bottom: '20px', left: '10px' }}>
                      <Button variant="contained" style={{backgroundColor: "#00BFFF",color:"#ffffff"}} onClick={() => this.functionExcel()}>
                          Select File xlsx
                      </Button>
                      <div >
                          <div style={{ position: 'fixed', bottom: '20px', left: '300px' }}>
                            <DatabaseSelectComponent label="ChiaveUno" lista={this.state.listaUno}/>
                          </div>
                          <div style={{ position: 'fixed', bottom: '20px', left: '500px' }}>
                            <DatabaseSelectComponent label="ChiaveDue" lista={this.state.listaDue}/>
                          </div>
                         
                      </div>
                  </div>
              </div>
          </Container>
      );
    }
}      

