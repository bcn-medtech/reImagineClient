import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';



const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#1B1C1E"
    },
    label1: {
        color: "white",
        fontSize: "18pt"
    },
    label2: {
        color: "#979797",
        fontSize: "13pt",
        paddingTop: "14px"
    },
    stepers: {},
    list:{
        width: "50%"
    }
}));

const { ipcRenderer } = window.require("electron");
export class DatabaseComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: null,
      };
    }
  
    componentDidMount() {
      this.fetchData();
    }

    functionExcel() {
        console.log("Funzione Uno chiamata!");
      }
      
    fetchData() {
      ipcRenderer.send('readSql');
      ipcRenderer.on('readSql', (event, data) => {
          this.setState({ data:data });
      });
    }
  
    // render() {
    //   return (
    //     <div>
    //       {this.state.data ? (
    //         <div>
    //           {/* mostra i dati qui */}
    //           <p>idx: {this.state.data[0].idx}</p>
    //           <p>anoncode: {this.state.data[0].anoncode}</p>
    //           <p>pid: {this.state.data[0].pid}</p>
    //           <p>name: {this.state.data[0].name}</p>
    //           <p>accessionNumber: {this.state.data[0].accessionNumber}</p>
    //         </div>
    //       ) : (
    //         <p>Loading...{this.state.data}</p>
    //       )}
    //     </div>
    //   );
    // }
    render() {
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
              <div style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
                <Button variant="contained" style={{backgroundColor: "#00BFFF",color:"#ffffff"}} onClick={() => this.functionExcel()}>
                    excelAnon
                </Button>
             </div>
          </div>
          </Container>
        );
      }
  }
  
  