importScripts("/wasm/sql-wasm.js");

onmessage = (e) => {
    if (e.data.cmd === "getAnnotations") {
        const sigData = e.data.sigData;
        const winSize = e.data.winSize;
        initSqlJs().then((SQL) => {
            fetch("/Annotations.db")
              .then((response) => response.arrayBuffer())
              .then((data) => {
                const db = new SQL.Database(new Uint8Array(data));
                let annotations = [];

                sigData.map((snpID) => {

                  var chr = snpID.split("_")[0];
                  var pos = parseInt(snpID.split("_")[1]);
                  const joinedQuery = `SELECT c.*, 
                  COALESCE(m.BINCODE, 'NA') AS BINCODE,
                  COALESCE(m.NAME, 'NA') AS NAME,
                  COALESCE(m.IDENTIFIER, 'NA') AS IDENTIFIER,
                  COALESCE(m.DESCRIPTION, 'NA') AS DESCRIPTION,
                  COALESCE(m.TYPE, 'NA') AS TYPE
                  FROM camelina c
                  LEFT JOIN camelinam4 m ON c.IDENTIFIER = m.IDENTIFIER
                  WHERE c.seqid = ${chr} AND c.type = 'CDS' AND  c.start > ${pos - winSize} AND c.end < ${pos + winSize};
                  `;
                  const result = db.exec(joinedQuery);
                    if(!result.length){
                      var annot_data = {};
                          annot_data["Chr"] = chr;
                          annot_data["Position"] = pos;
                          annot_data["REF/ALT allele"] = `${snpID.split("_")[2]}/${snpID.split("_")[3]}`;
                          annot_data["ID"] = '';
                          annot_data["Protein Name"] = '';
                          annot_data["DESCRIPTION"] = 'No genes found';
                      annotations.push(annot_data);
                    }else{
                      var annot_data = {};
                      result.map((res) => {
                        res.values.map((record) => {
                          annot_data["Chr"] = record[0];
                          annot_data["Position"] = snpID.split("_")[1];
                          annot_data["REF/ALT allele"] = `${snpID.split("_")[2]}/${snpID.split("_")[3]}`;
                          annot_data["ID"] = record[8];
                          annot_data["Protein Name"] = record[12];
                          annot_data["DESCRIPTION"] = record[14];
                        });
                      });
                      annotations.push(annot_data);
                    }
                  });
                postMessage({cmd : "processed", res : annotations })
              })
              .catch((error) => {
                console.error("Error reading database file:", error);
              });
          });
    }
}


