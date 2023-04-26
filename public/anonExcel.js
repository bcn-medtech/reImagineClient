
async function anonExcel(dataSQL, rows, saveExcelfunction) {
    const accessionNumberList = [201, 218, 235, 252, 269, 286];

    for (const patient of dataSQL['patient']) {
        const idxPatient = patient['idx'];
        const anonCode = patient['anoncode'];

        for (const image of dataSQL['image']) {
            if (image['patientId'] === idxPatient) {
                const accessionNumber = image['imageId'];
                console.log(`Cerca questo accNumb: ${accessionNumber} con id paziente: ${idxPatient} nel file excel`);

                for (let y = 1; y < rows.length; y++) {
                    if (rows[y][0]) {
                        for (const k of accessionNumberList) {
                            if (rows[y][k] == accessionNumber) {
                                rows[y][6] = anonCode;
                                break;
                            }
                        }
                    }
                }
                break;
            }
        }
    }
    rows[0][6]="anonCode";
    saveExcelfunction(rows);
}
    


module.exports.anonExcel = anonExcel;
  