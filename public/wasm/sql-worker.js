// importScripts("/wasm/sql-wasm.js");

// console.log("Running SQL worker")

onmessage = (e) => {
  if (e.data.cmd === "getAnnotations") {
    const sigData = e.data.sigData;
    const winSize = e.data.winSize;
    const species = e.data.species;
    const token = e.data.token;
    fetch("/api/annotateSNPlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        species: species,
        token: token,
        winSize: winSize,
        snpList: sigData,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle response data
        postMessage({ cmd: "processed", res: data });
      })
      .catch((error) => {
        // Handle errors
        console.error("There was a problem with your fetch operation:", error);
        // postMessage({ cmd: "processed", res: {} });
      });

    // legacy its slow
    //     initSqlJs().then((SQL) => {
    //         fetch("/Annotations.db")
    //           .then((response) => response.arrayBuffer())
    //           .then((data) => {
    //             const db = new SQL.Database(new Uint8Array(data));
    //             let annotations = [];

    //             sigData.map((snpID) => {

    //               var chr = parseInt(snpID.split("_")[0]);
    //               var pos = parseInt(snpID.split("_")[1]);

    //               // const getGenesQuery = `
    //               // SELECT IDENTIFIER FROM camelina
    //               // WHERE chr = ${chr} AND start > ${pos - winSize} AND start < ${pos + winSize};
    //               // `

    //               const joinedQuery2 = `
    //               SELECT * FROM camelina
    //               JOIN camelinam4 ON LOWER(camelina.IDENTIFIER) = LOWER(camelinam4.IDENTIFIER)
    //               WHERE camelina.chr = ${chr}
    //                 AND camelina.start > ${pos - winSize}
    //                 AND camelina.start < ${pos + winSize};
    //               `

    //               const result = db.exec(joinedQuery2);

    //               // console.log('RESULTS',result)

    //              if(!result.length){
    //                   var annot_data = {};
    //                       annot_data["Chr"] = chr;
    //                       annot_data["Position"] = pos;
    //                       annot_data["REF/ALT allele"] = `${snpID.split("_")[2]}/${snpID.split("_")[3]}`;
    //                       annot_data["Gene Id"] = '';
    //                       annot_data["Protein Name"] = '';
    //                       annot_data["DESCRIPTION"] = `No genes found within ${winSize} bp of this SNP. Try a larger window size`;
    //                   annotations.push(annot_data);
    //                 }else{

    //                   var ids = []

    //                   result.map((res) => {
    //                     res.values.map((record) => {
    //                       if(!ids.includes(record[6])){
    //                         var annot_data = {};
    //                         annot_data["Chr"] = chr;
    //                         annot_data["Position"] = pos;
    //                         annot_data["REF/ALT allele"] = `${snpID.split("_")[2]}/${snpID.split("_")[3]}`;
    //                         annot_data["Gene Id"] = record[6];
    //                         annot_data["Protein Name"] = record[10];
    //                         annot_data["DESCRIPTION"] = record[12];
    //                         annotations.push(annot_data)

    //                         ids.push(record[6])

    //                       }

    //                     });
    //                   });

    //                 }

    //               });

    //             postMessage({cmd : "processed", res : annotations })
    //           })
    //           .catch((error) => {
    //             console.error("Error reading database file:", error);
    //           });
    //       });
  }
};
