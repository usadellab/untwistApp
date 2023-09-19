function parseStringToObject(inputString) {
    const keyValuePairs = inputString.split(';');
    const resultObject = {};
    keyValuePairs.forEach((keyValuePair) => {
        const [key, value] = keyValuePair.split('=');
        resultObject[key] = value;
    });
return resultObject;
}

var getSigGenes = async (species, snpsList) => {
    var genes = [];

// Create an array to hold all the fetch requests
const fetchRequests = snpsList.map((locus) => {
    let chr = locus.split('_')[0];
    let pos = parseInt(locus.split('_')[1]);

    // Return the fetch request for each locus
    return fetch(`/gffFiles/${species}/${species}_chr${chr}.json`)
    .then((response) => response.json())
    .then((listObj) => {
        listObj.forEach((record) => {
            var annot_data = {};

        if (pos >= record.start && pos <= record.end) {
            // console.log('I am full record', record)
            const inputString = record.attributes;
            const parsedObject = parseStringToObject(inputString);
            annot_data['SNP ID'] = locus;
            annot_data['Chromosome'] = chr;
            annot_data['SNP Position'] = pos;


            // annot_data['Feature Type'] = parsedObject.mol_type;
            annot_data['Feature Start'] = record.start;
            annot_data['Feature End'] = record.end;
            // annot_data['Ref Cultivar'] = parsedObject.cultivar;
            // annot_data['Feature Dbxref'] = parsedObject.Dbxref;

            // annot_data['Feature Tissue'] = parsedObject.tissue-type;
            // console.log('I am parse object',parsedObject)
            for (const key in parsedObject) {
                if(!(['chromosome', 'Name','gap_count','mol_type','gene_biotype','num_mismatch','cultivar','pct_coverage','pct_identity_gap','gbkey','genome','partial','Note','exception','inference', 'pseudo','tissue-type','Parent','model_evidence'].includes(key))){
                    if(key == 'ID'){
                        annot_data['Feature ID'] = parsedObject.ID.split(':')[0];
                    }else if(key == 'Target'){
                        annot_data['Feature ID'] = parsedObject.Target.split(' ')[0];

                    }else{
                    annot_data[key] = parsedObject[key];
                    }

                }
            }




            genes.push(annot_data);
            // console.log('Annot data', annot_data);

        }
        });
    })
    .catch((error) => console.error('Error fetching JSON:', error));
});

// Wait for all fetch requests to complete before returning the genes array
await Promise.all(fetchRequests);

return genes;
};

onmessage = async function (event) {

    if (event.data.cmd === 'processGenes') {
    const genes = await getSigGenes(event.data.species, event.data.snpsList);
    postMessage({ cmd: 'processed', result: genes });




    }
};

