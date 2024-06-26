const calculateManPlot = (pValues) => {
    var qqData = []
    const sortedPValues = [...pValues].sort((a, b) => a - b);
    const n = pValues.length;
    const expectedQuantiles = Array.from({ length: n }, (_, i) => (i + 1 - 0.5) / n);
    sortedPValues.map((pval, index) => {
        qqData.push({expectedQuantiles : expectedQuantiles[index], sortedPValues:pval})
    })
    return qqData
};

const isObjectEmpty = (objectName) => {
    return Object.keys(objectName).length === 0;
    };
var qqPlotData = []

onmessage = async function (event) {
    // console.log('I am manhattanWorker')
    if (event.data.cmd === 'processManhattanPlotData') {
        //     //  prepare data
    var MaxP = 0;
    var filteredArray = event.data.plinkRes;
    var isDark = event.data.isDark
    
    const DEFAULT_PLOTLY_COLORS = [
        "rgb(31, 119, 180)",
        "rgb(255, 127, 14)",
        "rgb(44, 160, 44)",
        "rgb(214, 39, 40)",
        "rgb(148, 103, 189)",
        "rgb(140, 86, 75)",
        "rgb(227, 119, 194)",
        "rgb(127, 127, 127)",
        "rgb(188, 189, 34)",
        "rgb(23, 190, 207)",
        "rgb(188, 67, 67)",
        "rgb(67, 188, 67)",
        "rgb(67, 67, 188)",
        "rgb(240, 98, 146)",
        "rgb(98, 240, 146)",
        "rgb(146, 98, 240)",
        "rgb(255, 193, 37)",
        "rgb(193, 255, 37)",
        "rgb(37, 255, 193)",
        "rgb(0, 128, 128)",
      ];
              var dict = {};


    // set subplot xaxisID
    for (let i = 0; i < filteredArray.length-1; i ++) {
        var chrs = [];
        var xaxisId = 'x0';

        if(!isObjectEmpty(dict)){
            for (const [key, value] of Object.entries(dict)) {
            chrs.push(parseInt(`${key}`));
            }
            if(chrs.length == 1){
                xaxisId = "x2";
            }else{
                xaxisId = `x${chrs.length+1}`;
            }
        }

        var chr_id = parseInt(filteredArray[i]["SNP"].split('_')[0]); //parseInt(filteredArray[i]["CHR"]);
        var pos = parseInt(filteredArray[i]["SNP"].split('_')[1]); //parseInt(filteredArray[i]["BP"]);
        var pvalue = Math.abs(Math.log10(parseFloat(filteredArray[i]["P"])));

        if(pvalue > MaxP){
            MaxP = pvalue
        }

        if(chrs.includes(chr_id)){
            dict[chr_id].x.push(pos);
            dict[chr_id].y.push(pvalue);
        }else{
            var colorCode = Math.floor(Math.random() * DEFAULT_PLOTLY_COLORS.length);
            // if(chr_id >= 10){
            //     colorCode = colorCode[ chr_id-9];
            // }else{
            //     colorCode = DEFAULT_PLOTLY_COLORS[chr_id];
            // };
            dict[chr_id] = {
            name : `chr_${chr_id}`,
            type: "scattergl",
            mode: "markers",
            xaxis: xaxisId,
            yaxis: 'y1',
            shapes : [{fillcolor:'red'}],
            legendwidth:10,
            marker: {
                color : colorCode,
                size : 3.5,
            },
            };
            dict[chr_id]['x'] = [];
            dict[chr_id]['y'] = [];
            dict[chr_id].x.push(pos);
            dict[chr_id].y.push(pvalue);
            }
            dict[chr_id]['hovertemplate'] = '<b>Chromosome Id:\t</b> ' + chr_id + '<br><b>Position:\t</b>%{x:.f}<br>' + '<b>P-value:\t\t </b>%{y:.5f}<extra></extra>',
            // the float values defined in the above template .f is used to specify that the x value should be formatted as a fixed-point number without any exponent, and .2f is used to specify that the y value should be formatted as a fixed-point number with two decimal places.
            // by default plotly will round off every value rendering wrong values that are sensitive in our case
            customdata = [{ chr: chr_id, pos: pos, pvalue: pvalue }]
    }
    var textColor = isDark ? '#FFFFFF' : '#000000'

    //  create the layout
    var layout={ 
        hovermode: 'closest',
        width: 1000, 
        height: 800, 
        showlegend: false,
        font: { color: textColor },
        plot_bgcolor : isDark ? '#000000' : '#FFFFFF', 
        paper_bgcolor : isDark ? '#000000' : '#FFFFFF',
        title: {
            text:'Manhattan Plot',
            font: {
            family: 'Courier New, monospace',
            size: 22
            }
        },
        // autosize : true,
        // margin : {b:0},
        xaxis : {
            domain : [a,chunk], 
            anchor: 'y1',
            showgrid: false,
            showline: false,
            showticklabels: false,
            title: {},
            standoff: 5,
            tickangle: -90,
            font: {
                color: textColor
            },
            tickfont: { color: textColor },

        },
        yaxis: {
            title: {
                text:'absolute(-log10(pvalue))',
                font: {
                family: 'Courier New, monospace',
                size: 18
                }
            },
            range : [0,MaxP],
            showgrid:false,
            zeroline: false,
            showline: false,
            font: {
                color: textColor
              },
            tickfont: { color: textColor },

        },

    }

       
    
    


    // set id and domain
    const N = Object.keys(dict).length;
    var chunk= 1/N;
    var a=0;
    var b=chunk;
    for(let i=0;i < N;i++){
        if(i==0){
            layout.xaxis.title = {text : `Chr${chrs[i]}`, angle: 45,
            // standoff: -5,
            font: { size: 10 }};
            layout.xaxis.domain =  [a,b] 
        }else if(cnt==1){
            layout.xaxis2.title = {text : `Chr${chrs[i]}`, angle: 45,
            standoff: -10,
            font: { size: 10 }};
            layout.xaxis2.domain =  [a,b] 
        }else{
            layout[`xaxis${i+1}`] = {domain : [a,b], 
                anchor: 'y1',
                // automargin : true,
                zeroline:false,
                showline: false,
                showticklabels: false,
                showgrid: false,
                title: {
                text: `Chr${chrs[i]}`,
                angle: 45,
                // standoff: -10,
                font: { size: 10 }, 
                }
            };
        }
        var a = a + chunk;
        var b= a + chunk;
    }
    var data = [];
    var cnt = 0;
    // add ranges to display the span of a chromosome
    for (const [key, value] of Object.entries(dict)) {
        if(cnt==0){
            layout["xaxis"]["range"] = [value.x[0], value.x[value.x.length-1]];
        }else if(cnt==1){
            layout["xaxis2"]["range"] = [value.x[0], value.x[value.x.length-1]];
        } else{
            layout[`xaxis${cnt+1}`]["range"] = [value.x[0], value.x[value.x.length-1]];
        }
        cnt = cnt+1;
    data.push(value);





    }
    // console.log('Manhattan plot data',data)
    res = {data : data, layout : layout}
    postMessage({ cmd: 'processed', result: res });
    }
};

