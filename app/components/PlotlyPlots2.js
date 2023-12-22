import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { linReg, createHeatmapTrace } from "./utils";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

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
  
  
const isObjectEmpty = (objectName) => {
return Object.keys(objectName).length === 0;
};

const PlotlyPlots = (props) => {
var plotyType = props.plotSchema.ploty_type;
var inputData = props.plotSchema.inputData;
var selectedVars = props.plotSchema.variablesToPlot;
var plotTitle = props.plotSchema.plotTitle || 'add plot title here';
var xLable = props.plotSchema.xLable;
var yLable = props.plotSchema.yLable;
var isDark = props.plotSchema.isDark;
var textColor = isDark ? '#FFFFFF' : '#000000'

var primaryLayout = {
    width: 1000,
    height: 1000,
    // autosize: true,
    hovermode: "closest",
    font: { color: textColor },
    xaxis: {
        // zeroline : false,
        "title" : '', 
        font: {
            color: textColor
          },
        tickfont: { color: textColor }
    },
    yaxis: {
        showgrid: true,
        "title" : '', 
        // zeroline : false,
    
        font: {
            color: textColor
          },
        tickfont: { color: textColor }
    
    },
    };
   


primaryLayout["title"] = plotTitle;
primaryLayout["plot_bgcolor"] = isDark ? '#000000' : '#FFFFFF'
primaryLayout["paper_bgcolor"] = isDark ? '#000000' : '#FFFFFF'

const [plotData, setPlotData] = useState([]);
const [plotLayout, setPlotLayout] = useState({});

useEffect(() => {
handlePlotData(selectedVars, plotyType, inputData);
}, [plotyType, selectedVars]);

var handlePlotData = (selectedVars, plotyType, inputData) => {
var xdata = [];
var ydata = [];

var x = selectedVars[0];
var y = selectedVars[1];
if (!isObjectEmpty(inputData)) {
    for (let i = 0; i < inputData.length; i++) {
    var obj = inputData[i];
    xdata.push(obj[x]);
    ydata.push(obj[y]);
    }
}

var accessions = []
inputData.map(obj => {
    accessions.push(obj.Accessions)
})

//////////////////////////// Now for plot types

if (plotyType == "bar") {
    var plotData = [{ type: "bar", x: xdata, y: ydata }];
    var plotLayout = primaryLayout;
    plotLayout.xaxis.title = xLable || x;
    plotLayout.yaxis.title = yLable || y;
    plotLayout["boxmode"] = "group";
    plotLayout.showlegend = false;
    plotLayout.annotations = {};
} else if (plotyType == "line") {
    var input_Obj = {};
    selectedVars.map((key) => {
    var Y = [];
    var X = [];
    input_Obj[key] = {
        x: X,
        y: Y,
        type: "scatter",
        mode: "lines+markers",
        name: key,
    };
    });
    for (let i = 0; i < inputData.length; i++) {
    var obj = inputData[i];
    selectedVars.map((key) => {
        input_Obj[key].y.push(obj[key]);
        input_Obj[key].x.push(obj.Accessions);
    });
    }
    var plotData = Object.values(input_Obj);
    var plotLayout = primaryLayout;
    plotLayout.xaxis["title"] = xLable || 'Accessions';
    plotLayout.yaxis["title"] = yLable || 'add label to y axis';
    plotLayout.annotations = {};
    plotLayout.showlegend = true;


    // console.log('modify it for many variables')
} else if (plotyType == "histogram") {
    var plotData = [{ type: "histogram", mode:'markers', x: xdata }];
    var plotLayout = primaryLayout;
    plotLayout["xaxis"] = {};
    plotLayout.xaxis["title"] = xLable || x;
    plotLayout["yaxis"] = {};
    plotLayout.yaxis["title"] = yLable || 'add label to y axis';
    plotLayout.showlegend = false;
    plotLayout.annotations = {};
} else if (plotyType == "scatter") {
    
"density_overlay"
    var plotData = [
    { type: "scattergl", mode: "markers", x: xdata, y: ydata , text : accessions , 
    hovertemplate: '<b>%{text}</b><br>' + '<b><i>y</i></b>: %{y:.2f}' + '<br><b>X</b>: %{x}<br><extra></extra>',
    showlegend: false
},
    ];
    var plotLayout = primaryLayout;
    plotLayout["xaxis"] = {};
    plotLayout["yaxis"] = {};
    plotLayout.xaxis["title"] = xLable || x;
    plotLayout.yaxis["title"] = yLable || y;
    plotLayout.annotations = {};
    plotLayout.showlegend = false

} else if (plotyType == "boxplot") {
    var input_Obj = {};
    selectedVars.map((key) => {
    var Y = [];
    input_Obj[key] = { y: Y, type: "box", name: key , boxpoints: 'all', jitter: 1,pointpos: 0.3,
};
    });
    for (let i = 0; i < inputData.length; i++) {
    var obj = inputData[i];
    selectedVars.map((key) => {
        input_Obj[key].y.push(obj[key]);
        input_Obj[key]["hovertemplate"] = `<b>${obj.Accessions}</b><br> <i>y</i>: %{y:.2f}<br><extra></extra>`
    });
    }
    var plotData = Object.values(input_Obj);
    var plotLayout = primaryLayout;
    plotLayout["xaxis"] = 
//     { 
//         showticklabels: true,
//         autotick: false,
//         tickangle: 'auto',
//         ticks: 'outside', 
//         tick0: 0,
//         dtick: 0.25,
//         ticklen: 8,
//         tickwidth: 4,
// } //
{showticklabels: false, showline:false};

    plotLayout["yaxis"] = {};
    plotLayout.xaxis["title"] = xLable || 'add label to x axis';
    // plotLayout.xaxis.title["standoff"] = 40;
    plotLayout.yaxis["title"] = yLable || 'add label to y axis';
    plotLayout.showlegend = true;
    plotLayout.annotations = {};
    plotLayout.width = 1400


} else if (plotyType == "density_overlay") {
    var input_Obj = {};
    selectedVars.map((key) => {
    var Y = [];
    input_Obj[key] = { x: Y,
    type: 'violin',
    side: 'positive',
    opacity: 0.5,
	    y0 : ' ',
    name: key,
    };
    });
    for (let i = 0; i < inputData.length; i++) {
    var obj = inputData[i];
    selectedVars.map((key) => {
        input_Obj[key].x.push(obj[key]);
        input_Obj[key]["hovertemplate"] = `<b>${obj.Accessions}</b><br> <i>y</i>: %{y:.2f}<br><extra></extra>`
    });
    }
    var plotData = Object.values(input_Obj);
    var plotLayout = primaryLayout;
    plotLayout["xaxis"] =
{showticklabels: false, showline:false};

    plotLayout["yaxis"] = {};
    plotLayout.xaxis["title"] = xLable || 'add label to x axis';
    // plotLayout.xaxis.title["standoff"] = 40;
    plotLayout.yaxis["title"] = yLable || 'add label to y axis';
    plotLayout.showlegend = true;
    plotLayout.annotations = {};
    plotLayout.width = 800;
    plotLayout.height = 600




} else if (plotyType == "violin") {
    var input_Obj = {};
    selectedVars.map((key) => {
    var Y = [];
    // var X = [];

    input_Obj[key] = {
        y: Y,
        // x : X,
        // x0 : ' ',  //overlapping distros
        type: "violin",
        name: key,
        // offsetgroup : obj[key],

        hoverinfo: "y", // Specify hover information
        // text : accessions,
        // hovertemplate: "", // Customize hover template to display only the 'y' value and the variable name
        points: "all",
        jitter : .8,
        // box: { visible: true },
        // boxpoints: true,
        // line: { color: "black" },
        // fillcolor: "#8dd3c7",
        opacity: .9,
        // meanline: { visible: true },
        hoveron: "violins+points+kde",
    };
    });

    for (let i = 0; i < inputData.length; i++) {
    var obj = inputData[i];
    selectedVars.map((key) => {
        input_Obj[key].y.push(obj[key]);
        // input_Obj[key].x.push(obj.Accessions);

        input_Obj[key]["hovertemplate"] = `<b>Accession: </b>${obj.Accessions}<br> <b>value:</b>${obj[key]} <extra></extra>`;

        


    });
    }
    var plotData = Object.values(input_Obj);
    var plotLayout = primaryLayout;
    plotLayout["xaxis"] = {};
    plotLayout["yaxis"] = {};
    plotLayout.xaxis["title"] =  xLable || "add label to x axis";
    plotLayout.yaxis["title"] = yLable || "add label to y axis";
    plotLayout.showlegend = true;
    plotLayout.annotations = {};
    plotLayout.width = 1400
} else if (plotyType == "raincloud") {
    var plotLayout = primaryLayout;
    var input_Obj = {};
    var cnt = 0;
    var N = selectedVars.length;
    var chunk = 1 / N;
    var a = 0;
    var b = chunk;
    selectedVars.map((key) => {
    var Y = [];
    var y_axis;
    if (cnt == 0) {
        y_axis = "yaxis";
        a = b;
        b = b + chunk;
    } else if (cnt == 1) {
        y_axis = "yaxis2";
        plotLayout[y_axis] = [];
        plotLayout[y_axis]["domain"] = [a, b];
        a = b;
        b = b + chunk;
    } else {
        y_axis = `yaxis${cnt + 1}`;
        plotLayout[y_axis] = [];
        plotLayout[y_axis]["domain"] = [a, b];
        a = b;
        b = b + chunk;
    }
    input_Obj[key] = [
        {
        x: Y,
        name: key,
        yaxis: y_axis,
        type: "violin",
        side: "positive",
        hoverinfo: "x", // Specify hover information
        line: { width: 0.75 }, //color : 'green',
        jitter : 1,
        hoveron: "violins+points+kde",

        },
        {
        x: Y,
        name: key,
        showlegend: false,
        type: "box",
        opacity: 0.4,
        // points : "all",
        boxpoints: "all",
        hoveron: "violins+points+kde",

        jitter: 1,
        whiskerwidth: 0.3,
        width: 0.15,
        fillcolor: "orange",
        yaxis: y_axis,
        boxmean: "sd",
        marker: {
            color: "green",
            opacity: 1,
            size: 4,
            outliercolor: "red",
            Symbol: "diamond",
        },
        line: { color: "red", width: 2 },
        },
        
    ];
    cnt = cnt + 1;
    });
    for (let i = 0; i < inputData.length; i++) {
    var obj = inputData[i];
    selectedVars.map((key) => {
        input_Obj[key][0].x.push(obj[key]);
        input_Obj[key][1]["hovertemplate"] = `<b>Accession: </b>${obj.Accessions}<br> <b>value:</b>${obj[key]} <extra></extra>`;

    });
    }
    var plotData = [];
    Object.values(input_Obj).map((item) => {
    item.map((trace) => {
        plotData.push(trace);
    });
    });

    plotLayout["xaxis"] = {};
    plotLayout["yaxis"] = { showticklabels: false, showline:false };
    plotLayout.xaxis["title"] = xLable || "add label to x axis";
    plotLayout.yaxis["title"] = yLable || "add label to y axis";
    plotLayout.showlegend = true;
    plotLayout.annotations = {};
} else if (plotyType == "linReg") {
    var regLineData = linReg(xdata, ydata);
    var xAnnotPos = Math.min(...xdata)
    var yAnnotPos = Math.max(...ydata)

    if(xAnnotPos <= 1){
        xAnnotPos = xAnnotPos + 0.15
        // yAnnotPos = yAnnotPos - 0.01
        
    }
    // console.log('x', xAnnotPos, 'y', yAnnotPos)



    var plotData = [
    { type: "scattergl", 
    mode: "markers",
     x: xdata, 
     y: ydata,   
    // text: [`R\u00B2: ${regLineData.text}`], 
    // textposition: 'bottom right', 
    // textfont: {
    //     family: 'sans serif',
    //     size: 18,
    //     color: 'blue'
    //   }, 
    text : accessions , 
    hovertemplate: '<b>%{text}</b><br>' + '<b><i>y</i></b>: %{y:.2f}' + '<br><b>X</b>: %{x}<br><extra></extra>',
    showlegend: false
    
    },
    regLineData,
    ];
    var plotLayout = primaryLayout;
    plotLayout["xaxis"] = {};
    plotLayout["yaxis"] = {};

    plotLayout.xaxis["title"] = xLable || x;
    plotLayout.yaxis["title"] = yLable || y;
    plotLayout.showlegend = false;



    plotLayout.annotations = 
    [{
        x: xAnnotPos,
        y: yAnnotPos,
        xref: 'x',
        yref: 'y',
        text: `R\u00B2: ${regLineData.text}`,
        showarrow: false,
        // ax: 10,
    //   ay: -40
        font: {
            family: 'sans serif',
            size: 18,
            color: 'blue'
        }, 
        bordercoloheatMapr: 'black', //'#c7c7c7',
      borderwidth: 1,
      borderpad: 4,
      bgcolor: 'lightyellow',
      opacity: 0.8

        }]




} else if (plotyType == "heatMap") {
	var heatMapData =  createHeatmapTrace(selectedVars, inputData)
	var xValues = heatMapData.x;
	var yValues = heatMapData.y;
	var zValues = heatMapData.z;

var colorscaleValue = [
  [0, '#3D9970'],
  [1, '#001f3f']
];

var data = [{
  x: xValues,
  y: yValues,
  z: zValues,
  type: 'heatmap',
  colorscale: colorscaleValue,
  showscale: true,
	coloraxis: 'coloraxis'
}];

var layout = {
  title: plotTitle,

  annotations: [],
  xaxis: {
    ticks: '',
    side: 'bottom',
	  automargin: true
  },
  yaxis: {
    ticks: '',
    ticksuffix: ' ',
	  automargin: true,
   width: 700,
  height: 700,
  autosize: false,
	  side: 'right'


  },
	coloraxis: {
    colorbar: {
      x: -0.1, // Adjust the x position (0.5 means centered horizontally)
      y: 1, // Adjust the y position (1.15 means above the plot)
      xanchor: 'center',
      yanchor: 'top',
    },
  },

	margin : {1:200}
};

for ( var i = 0; i < yValues.length; i++ ) {
  for ( var j = 0; j < xValues.length; j++ ) {
    var currentValue = zValues[i][j];
    if (currentValue != 0.0) {
      var textColor = 'white';
    }else{
      var textColor = 'black';
    }
    var result = {
      xref: 'x1',
      yref: 'y1',
      x: xValues[j],
      y: yValues[i],
      text: zValues[i][j],
      font: {
        family: 'Arial',
        size: 12,
        color: 'rgb(50, 171, 96)'
      },
      showarrow: false,
      font: {
        color: textColor
      }
    };
    layout.annotations.push(result);
  }
}



	var plotLayout = layout;
	var plotData = data;


plotLayout.height = 1000
plotLayout.width = 1000

} else if (plotyType == "mds") {
    var traces = [];
    var clusterLegends = new Set(); // To keep track of unique cluster legends
    var maxX = 0;
    var maxY = 0;
    var indicesToHide = [];
    var originCountries = [];

    inputData.forEach((obj, index) => {
    if (obj.FID && obj.C1 && obj.C2 && obj.SOL && obj.IID) {
        if (obj.C1 > maxX) {
        maxX = obj.C1;
        }

        if (obj.C2 > maxY) {
        maxY = obj.C2;
        }

        var trace = {
        type: "scattergl",
        mode: "markers",
        x: [obj.C1], // Single data point x-coordinate
        y: [obj.C2], // Single data point y-coordinate
        // text: `Sample: ${obj.IID} <br>Cluster: ${obj.ORIGIN}`,
        hovertemplate: `Sample ID: ${obj.IID} <br>Cluster  ID: \t${obj.SOL}`,
        marker: {
            color: DEFAULT_PLOTLY_COLORS[obj.SOL],
            size: 10, // Adjust the marker size as needed
        },
        name: `Cluster ${obj.SOL}`,
        SampleID: `${obj.IID}`,
        };

        if (trace.x.length > 0 && trace.y.length > 0) {
        traces.push(trace);
        clusterLegends.add(`Cluster ${obj.SOL}`);
        }
    }
    if (!originCountries.includes(obj.SOL)) {
        originCountries.push(obj.SOL);
    } else {
        indicesToHide.push(index);
    }
    });

    var plotData = traces;

    var plotLayout = primaryLayout;
    plotLayout["xaxis"] = {};
    plotLayout["yaxis"] = {};
    plotLayout.xaxis["title"] = xLable || x;
    plotLayout.yaxis["title"] = yLable || y;
    // plotLayout.xaxis['range'] = [0, maxX + 0.1]; // Adjust the range as needed
    // plotLayout.yaxis['range'] = [0, maxY + 0.1]; // Adjust the range as needed
    // plotLayout.xaxis['range'] = [-maxX -0.2, maxX + 0.2 ]; // Adjust the range as needed
    // plotLayout.yaxis['range'] = [-maxY -0.2, maxY + 0.2 ]; // Adjust the range as needed

    plotLayout.showlegend = true; // Hide the default legend
    plotLayout["annotations"] = {};

    // Add a marker text annotation for each data point
    var markerTextAnnotations = traces.map((trace) => ({
    x: trace.x[0],
    y: trace.y[0],
    text: trace.SampleID, // Display IID as marker text
    xref: "x",
    yref: "y",
    showarrow: true,
    arrowhead: 2,
    ax: 0,
    ay: -10, // Adjust the position of the marker text
    }));

    // legend annotations

    plotLayout.annotations = markerTextAnnotations;

    plotLayout["legend"] = {};
    plotLayout.legend["traceorder"] = "normal"; // Preserve the order of other legend items
    plotLayout.legend["title"] = { text: "IBS clusters" };

    traces.forEach((trace, index) => {
    if (indicesToHide.includes(index)) {
        trace.showlegend = false;
    }
    });
} else if (plotyType == "pca") {
    var c = 0
    var traces = [];
    var clusterLegends = new Set(); // To keep track of unique cluster legends
    var maxX = 0;
    var maxY = 0;
    var indicesToHide = [];
    var originCountries = [];
    var COV1 = selectedVars[0]
    var COV2 = selectedVars[1]

    // console.log(inputData)

    inputData.forEach((obj, index) => {
    if (obj.COV1 && obj.COV2 && obj.FID && obj.IID) {

        if (COV1 > maxX) {
        maxX = COV1;
        }

        if (COV2 > maxY) {
        maxY = COV2;
        }

        var trace = {
        type: "scattergl",
        mode: "markers",
        x: [obj.COV1], // Single data point x-coordinate
        y: [obj.COV2], // Single data point y-coordinate
        // text: `Sample: ${obj.IID} <br>Cluster: ${obj.ORIGIN}`,
        hovertemplate: `Sample: ${obj.IID} <br>Origin: ${obj.ORIGIN}<extra></extra>`,
        marker: {
            color: DEFAULT_PLOTLY_COLORS[obj.ORIGIN_ID],
            size: 10, // Adjust the marker size as needed
        },
        name: `${obj.ORIGIN}`,
        sampleID: `${obj.IID}`, // we can add as many attributes as we want to map different variables
        };

        c = c +1

        traces.push(trace);
        clusterLegends.add(`${obj.ORIGIN}`);

        if (!originCountries.includes(obj.ORIGIN)) {
            originCountries.push(obj.ORIGIN);
        } else {
            indicesToHide.push(index);
        }
    }
    });

    var plotData = traces;

    var plotLayout = primaryLayout;
    plotLayout.xaxis.title = xLable || x;
    plotLayout.yaxis.title = yLable || y;
    // plotLayout.xaxis['range'] = [0, maxX + 0.1]; // Adjust the range as needed
    // plotLayout.yaxis['range'] = [0, maxY + 0.1]; // Adjust the range as needed
    // plotLayout.xaxis['range'] = [-maxX, maxX]; // Adjust the range as needed
    // plotLayout.yaxis['range'] = [-maxY, maxY ]; // Adjust the range as needed

    plotLayout.showlegend = true; // Hide the default legend
    plotLayout["annotations"] = {};

    // Add a marker text annotation for each data point
    var markerTextAnnotations = traces.map((trace) => ({
    x: trace.x[0],
    y: trace.y[0],
    text: trace.sampleID, // Display IID as marker text
    xref: "x",
    yref: "y",
    showarrow: true,
    arrowhead: 2,
    ax: 0,
    ay: -10, // Adjust the position of the marker text
    }));

    // legend annotations

    plotLayout.annotations = markerTextAnnotations;

    plotLayout["legend"] = {};
    plotLayout.legend["traceorder"] = "normal"; // Preserve the order of other legend items
    plotLayout.legend["title"] = { text: "Geographic origin" };

    traces.forEach((trace, index) => {
    if (indicesToHide.includes(index)) {
        trace.showlegend = false;
    }
    });
} else if (plotyType == "qqplot") {
    var plotData = [
    { type: "scattergl", mode: "markers", x: xdata, y: ydata },
    { x: ydata, y: ydata, mode: "line", color: "grey" },
    ];
    var plotLayout = primaryLayout;
    plotLayout["xaxis"] = {};
    plotLayout["yaxis"] = {};
    plotLayout.xaxis["title"] = xLable;
    plotLayout.yaxis["title"] = yLable;
    plotLayout.showlegend = false;
    plotLayout.width = 600;
    plotLayout.height = 600;
    plotLayout.annotations = {};
} else {
    console.log("Please choose a valid plot type");
}
setPlotData(plotData);
setPlotLayout(plotLayout);
};

return <Plot sx={{ p: 4, m: 1 }} data={plotData} layout={plotLayout} />;
};

export default PlotlyPlots;
