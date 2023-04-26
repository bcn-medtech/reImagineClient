const sqlite3 = require('sqlite3').verbose();

async function readSqlB(path) {
    return new Promise(async (resolve, reject) => {
      let db = new sqlite3.Database(`${path}`, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
          reject(err);
        }
        console.log('Connected to the database.');
      });
  
      // Ottieni i nomi di tutte le tabelle dal database
      db.all(`SELECT name FROM sqlite_master WHERE type='table'`, [], async (err, rows) => {
        if (err) {
          reject(err);
        }
  
        const tableNames = rows.map(row => row.name); // Ottieni i nomi delle tabelle
        const tablesData = {}; // Oggetto per memorizzare i dati delle tabelle
  
        // Esegui una query separata per ciascuna tabella per ottenere i relativi dati
        await Promise.all(tableNames.map(async tableName => {
          return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
              if (err) {
                reject(err);
              }
              tablesData[tableName] = rows; // Salva i dati della tabella nell'oggetto
              resolve();
            });
          });
        }));
  
        // Chiudi la connessione al database
        db.close((err) => {
          if (err) {
            reject(err);
          }
          console.log('Closed the database connection.');
        });
  
        resolve(tablesData); // Restituisci l'oggetto con i dati di tutte le tabelle
      });
    });
  }
  module.exports.readSqlB = readSqlB;
