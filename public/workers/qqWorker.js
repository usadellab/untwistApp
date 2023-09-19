
// console.log('I am qqWorker')


const calculateQQPlot = (pValues) => {

    var qqData = []

    const sortedPValues = [...pValues].sort((a, b) => a - b);
    const n = pValues.length;
    const expectedQuantiles = Array.from({ length: n }, (_, i) => (i + 1 - 0.5) / n);

    sortedPValues.map((pval, index) => {
        qqData.push({expectedQuantiles : expectedQuantiles[index], sortedPValues:pval})
    })

    return qqData
};

var qqPlotData = []

onmessage = async function (event) {

    if (event.data.cmd === 'processQQplotData') {
        var pvals = []
        event.data.plinkRes.map(snpRecord => {
            pvals.push(snpRecord.P)
        })
        res = calculateQQPlot(pvals)
    postMessage({ cmd: 'processed', result: res });
// console.log('qqWorker is done')


    }
};

