import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, Button, Table, TableHead, TableBody, TableRow, TableCell, Select, FormControl,InputLabel, Grid} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
//import {DatabaseSelectComponent} from './DatabaseSelectComponent.jsx'
import { active } from 'timers-browserify';

const { ipcRenderer } = window.require("electron");

export class DatabaseComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            selectedKeyOne: 'Chiave Uno',//inserici il valore predefinito
            selectedKeyTwo: 'Chiave Due',//inserisci il valore predefinito
            listaUno:['Chiave uno'],
            listaDue:['Chiave due'],
            dataExcel:null,
            msgSuccess:"             "
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    functionExcel() {       
        ipcRenderer.send('open-file-dialog');
        ipcRenderer.on('selected-file',(event, data) => {
          this.setState({ listaUno:data[0],listaDue:data[0] });
          this.state.dataExcel=data;
      })
    }
    saveFileExcel(){
        ipcRenderer.send('saveFileExcel',[this.state.data,this.state.dataExcel]);
        ipcRenderer.on('excelModified',(event, data)=>{
        this.setState({msgSuccess:data})
        setTimeout(() => {
            this.setState({msgSuccess:"             "})
        }, 2000);

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
        //const { listaUno, listaDue }= this.state;
        //const { selectedKeyOne, selectedKeyTwo } = this.state;
        return (
          <Container> 
              <div>
                  {this.state.data ? (
                      <Table style={{ overflow: 'auto', maxHeight: '300px' }}>
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
                      <p>empty...</p>
                  )}
                
                 
                    <Table style={{marginTop: '20px', position: 'fixed', bottom: '0px', left: '0px', border: '1px solid #a0a0a0', boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.75)',background:'#D3D3D3' }}>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Button variant="contained" style={{backgroundColor: "#00BFFF",color:"#ffffff"}} onClick={() => this.functionExcel()}>
                                    Select File xlsx
                                    </Button>
                                </TableCell>
                                {/* <TableCell>
                                    <DatabaseSelectComponent label="ChiaveUno" lista={this.state.listaUno} value={this.state.selectedKeyOne} onChange={this.handleChangeKeyOne}/>
                                </TableCell>
                                <TableCell>
                                    <DatabaseSelectComponent label="ChiaveDue" lista={this.state.listaDue} value={this.state.selectedKeyTwo} onChange={this.handleChangeKeyTwo}/>
                                </TableCell> */}
                                <TableCell>
                                    <Button variant="contained" style={{ right: '0px',backgroundColor: "#E62C4B",color:"#ffffff"}} onClick={() => this.saveFileExcel()}>
                                    Save File xlsx
                                    </Button>
                                </TableCell>
                               <p style={{marginTop: '20px', position: 'fixed', bottom: '0px', right: '100px',color:'#575757'}} >{this.state.msgSuccess}</p>
                            </TableRow>
                        </TableBody>
                    </Table>
              </div>
          </Container>
      );
    }
}      

