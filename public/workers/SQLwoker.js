// function parseStringToObject(inputString) {
//     const keyValuePairs = inputString.split(';');
//     const resultObject = {};
//     keyValuePairs.forEach((keyValuePair) => {
//         const [key, value] = keyValuePair.split('=');
//         resultObject[key] = value;
//     });
// return resultObject;
// }

// var getSigGenes = async (species, snpsList) => {
//     var genes = [];
//     var dbFile = new URL('../../public/Annotations.db', import.meta.url)
//     // Load the sql.js wasm module
//     initSqlJs().then(SQL => {
//     // Read the database file
//     fetch(dbFile)
//     .then(response => response.arrayBuffer())
//     .then(data => {
//       // Create an SQL.js database from the ArrayBuffer
//       const db = new SQL.Database(new Uint8Array(data));

//       // Perform queries on the existing database
//       sigData.map(snpID => {
//         var chr = snpID.split('_')[0]
//         var pos = snpID.split('_')[1]
//         // query 1kb region
//         const result = db.exec(`SELECT * FROM camelina WHERE start > ${pos - 1000} AND end < ${pos + 1000};`);

//         console.log(snpID,result);
//       })
//     })

//     });

// }



// onmessage = async function (event) {

//     if (event.data.cmd === 'processGenes') {
//     const genes = await getSigGenes(event.data.species, event.data.snpsList);
//     postMessage({ cmd: 'processed', result: genes });




//     }
// };

