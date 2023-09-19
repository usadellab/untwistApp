async function parseFileFromPath(filePath, searchString) {
    try {
    const response = await fetch(filePath);
    if (!response.ok) {
    throw new Error('Failed to fetch the file.');
    }

    const fileContent = await response.text();
    const lines = fileContent.split('\n');
    const header = lines[0].split('\t').map((item) => item.trim());
    const dataRows = lines.slice(1);

    let maxMatchPercentage = 0;
    let matchedRecord = null;

    for (const dataRow of dataRows) {
    const columns = dataRow.split('\t').map((item) => item.trim());

    const matchCount = columns.reduce((count, column) => {
        const words = column.toLowerCase().split(' ');
        const searchLower = searchString.toLowerCase();
        const matchPercentage = words.filter((word) => word.includes(searchLower)).length / words.length;
        return count + matchPercentage;
    }, 0);

    const currentMatchPercentage = matchCount / columns.length * 100;

    if (currentMatchPercentage > maxMatchPercentage) {
        maxMatchPercentage = currentMatchPercentage;
        const record = {};
        header.forEach((key, index) => {
        record[key] = columns[index];
        });
        matchedRecord = record;
    }
    }

    return {
    record: matchedRecord,
    matchPercentage: maxMatchPercentage,
    };
} catch (error) {
    console.error('Error fetching or parsing the file:', error);
    return null;
}
}
  
  

const filePath = '/m4/MapManMappingFile.txt'; 

onmessage = async function (event) {
    if (event.data.cmd === 'processGenes') {
        console.log('I am mercartor ',event.data.geneList)
        var querySet = []
        event.data.geneList.map((item) => {
            for (const key in item) {
                if((['product'].includes(key))){
                    querySet.push(item[key])
                    parseFileFromPath(filePath, item[key])
                        .then((result) => {
                            console.log(result);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });

                }
            }

        })

//         console.log('Query Set', querySet)

// const searchString = 'photosystem II';



    // const genes = await getSigGenes(event.data.species, event.data.snpsList);
    // postMessage({ cmd: 'processed', result: genes });




    }
};

