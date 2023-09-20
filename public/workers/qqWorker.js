
// console.log('I am qqWorker')


const calculateQQPlot = (pValues) => {
    const qqData = [];
  
    const sortedPValues = [...pValues].sort((a, b) => a - b);
    const n = pValues.length;
    const expectedQuantiles = Array.from({ length: n }, (_, i) => (i + 1 - 0.5) / n);
  
    sortedPValues.forEach((pval, index) => {
      // Apply -log10 transformation to p-value
      const transformedPValue = -Math.log10(pval);
      const transformedQuantile = -Math.log10(expectedQuantiles[index]);

  
      qqData.push({ expectedQuantiles: transformedQuantile, sortedPValues: transformedPValue });
    });
  
    return qqData;
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

