import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { linReg } from "./utils";
import { Typography } from "@mui/material";

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
];

const isObjectEmpty = (objectName) => {
return Object.keys(objectName).length === 0;
};

var primaryLaout = {
showlegend: true,
width: 1000,
height: 1000,
// autosize: true,
hovermode: "closest",
// editable: true,
// xaxis: {
//     title: {text: 'x Axis'},
//     zeroline : false
// },
// yaxis: {
//     title: {text: 'x Axis'},
//     showgrid: true,
// },
};

const PlotlyPlots = (props) => {
var plotyType = props.plotSchema.ploty_type;
var inputData = props.plotSchema.inputData;
var selectedVars = props.plotSchema.variablesToPlot;
var plotTitle = props.plotSchema.plotTitle;
var xLable = props.plotSchema.xLable;
var yLable = props.plotSchema.yLable;
primaryLaout["title"] = plotTitle;

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

// console.log(x, xdata)
// console.log(y, ydata)

//////////////////////////// Now for plot types

if (plotyType == "bar") {
    var plotData = [{ type: "bar", x: xdata, y: ydata }];
    var plotLayout = primaryLaout;
    plotLayout["xaxis"] = {};
    plotLayout["yaxis"] = {};
    plotLayout.xaxis["title"] = xLable || x;
    plotLayout.yaxis["title"] = yLable || y;
    plotLayout["boxmode"] = "group";
    plotLayout.showlegend = false;
    plotLayout.annotations = {}

} else if (plotyType == "line") {
    var input_Obj = {};
    selectedVars.map((key) => {
    var Y = [];
    var X = [];
    input_Obj[key] = {
        x: X,
        y: Y,
        type: "scatter",
        mode: "lines",
        name: key,
    };
    });
    for (let i = 0; i < inputData.length; i++) {
    var obj = inputData[i];
    selectedVars.map((key) => {
        input_Obj[key].y.push(obj[key]);
        input_Obj[key].x.push(i);
    });
    }
    var plotData = Object.values(input_Obj);
    // console.log(plotData)

    // var plotData=[{type : 'line', y:xdata} ];
    var plotLayout = primaryLaout;
    plotLayout["xaxis"] = {};
    plotLayout["yaxis"] = {};
    plotLayout.xaxis["title"] = xLable || x;
    plotLayout.yaxis["title"] = yLable || y;
    plotLayout.annotations = {}

    // console.log('modify it for many variables')
} else if (plotyType == "histogram") {
    var plotData = [{ type: "histogram", x: xdata }];
    var plotLayout = primaryLaout;
    plotLayout["xaxis"] = {};
    plotLayout.xaxis["title"] = xLable || x;
    plotLayout["yaxis"] = {};
    plotLayout.yaxis["title"] = yLable || y;
    plotLayout.showlegend = false;
    plotLayout.annotations = {}

} else if (plotyType == "scatter") {
    var plotData = [
    { type: "scattergl", mode: "markers", x: xdata, y: ydata },
    ];
    var plotLayout = primaryLaout;
    plotLayout["xaxis"] = {};
    plotLayout["yaxis"] = {};
    plotLayout.xaxis["title"] = xLable || x;
    plotLayout.yaxis["title"] = yLable || y;
    plotLayout.annotations = {}

    // plotLayout.showlegend = false
} else if (plotyType == "boxplot") {
    var input_Obj = {};
    selectedVars.map((key) => {
    var Y = [];
    input_Obj[key] = { y: Y, type: "box", name: key };
    });
    for (let i = 0; i < inputData.length; i++) {
    var obj = inputData[i];
    selectedVars.map((key) => {
        input_Obj[key].y.push(obj[key]);
    });
    }
    var plotData = Object.values(input_Obj);
    var plotLayout = primaryLaout;
    plotLayout["xaxis"] = {};
    plotLayout["yaxis"] = {};
    plotLayout.xaxis["title"] = xLable || x;
    plotLayout.yaxis["title"] = yLable || y;
    plotLayout.showlegend = false;
    plotLayout.annotations = {}

} else if (plotyType == "violin") {
    var input_Obj = {};
    selectedVars.map((key) => {
    var Y = [];
    input_Obj[key] = {
        y: Y,
        type: "violin",
        name: key,
        hoverinfo: "y", // Specify hover information
        hovertemplate: "", // Customize hover template to display only the 'y' value and the variable name
        points: "none",
        box: { visible: true },
        boxpoints: false,
        line: { color: "black" },
        fillcolor: "#8dd3c7",
        opacity: 0.6,
        meanline: { visible: true },
      };
    });
    for (let i = 0; i < inputData.length; i++) {
    var obj = inputData[i];
    selectedVars.map((key) => {
        input_Obj[key].y.push(obj[key]);
    });
    }
    var plotData = Object.values(input_Obj);
    var plotLayout = primaryLaout;
    plotLayout["xaxis"] = {};
    plotLayout["yaxis"] = {};
    plotLayout.xaxis["title"] = xLable || x;
    plotLayout.yaxis["title"] = yLable || y;
    plotLayout.showlegend = true;
    plotLayout.annotations = {}


} else if (plotyType == "raincloud") {
    var plotLayout = primaryLaout;
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
        hovertemplate: "", // Customize hover template to display only the 'y' value and the variable name
        line: { width: 0.75 }, //color : 'green',
        },
        {
        x: Y,
        name: key,
        showlegend: false,
        type: "box",
        opacity: 0.4,
        boxpoints: "all",
        jitter: 1,
        whiskerwidth: 0.3,
        width: 0.15,
        fillcolor: "orange",
        yaxis: y_axis,
        boxmean : 'sd',
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
        input_Obj[key][1].x.push(obj[key]);
    });
    }
    var plotData = [];
    Object.values(input_Obj).map((item) => {
    item.map((trace) => {
        plotData.push(trace);
    });
    });

    plotLayout["xaxis"] = {};
    plotLayout["yaxis"] = {};
    plotLayout.xaxis["title"] = xLable || x;
    plotLayout.yaxis["title"] = yLable || y;
    plotLayout.showlegend = true;
    plotLayout.annotations = {}

} else if (plotyType == "linReg") {
    var regLineData = linReg(xdata, ydata);
    var plotData = [
    { type: "scattergl", mode: "markers", x: xdata, y: ydata },
    regLineData,
    ];
    var plotLayout = primaryLaout;
    plotLayout["xaxis"] = {};
    plotLayout["yaxis"] = {};

    plotLayout.xaxis["title"] = xLable || x;
    plotLayout.yaxis["title"] = yLable || y;
    plotLayout.showlegend = false;
    plotLayout.annotations = {}

} else if (plotyType == "heatMap") {
    var x = selectedVars;
    var y = selectedVars;
    var z = ManhattanHeatMap(x, y, inputData);
    var plotData = [
    {
        x: x,
        y: y,
        z: z,
        type: "heatmap",
        // colorscale: colorscaleValue,
        showscale: false,
    },
    ];
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

    var plotLayout = primaryLaout;
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
    var traces = [];
    var clusterLegends = new Set(); // To keep track of unique cluster legends
    var maxX = 0;
    var maxY = 0;
    var indicesToHide = [];
    var originCountries = [];

    inputData.forEach((obj, index) => {
    if (obj.COV1 && obj.COV2 && obj.FID && obj.IID) {
        if (obj.COV1 > maxX) {
        maxX = obj.COV1;
        }

        if (obj.COV2 > maxY) {
        maxY = obj.COV2;
        }

        var trace = {
        type: "scattergl",
        mode: "markers",
        x: [obj.COV1], // Single data point x-coordinate
        y: [obj.COV2], // Single data point y-coordinate
        // text: `Sample: ${obj.IID} <br>Cluster: ${obj.ORIGIN}`,
        hovertemplate: `Sample: ${obj.IID} <br>Origin: ${obj.ORIGIN}<br>Cluster_ID: ${obj.ORIGIN_ID}`,
        marker: {
            color: DEFAULT_PLOTLY_COLORS[obj.ORIGIN_ID],
            size: 10, // Adjust the marker size as needed
        },
        name: `${obj.ORIGIN}`,
        sampleID: `${obj.IID}`, // we can add as many attributes as we want to map different variables
        };

        if (trace.x.length > 0 && trace.y.length > 0) {
        traces.push(trace);
        clusterLegends.add(`${obj.ORIGIN}`);
        }
    }
    if (!originCountries.includes(obj.ORIGIN)) {
        originCountries.push(obj.ORIGIN);
    } else {
        indicesToHide.push(index);
    }
    });

    var plotData = traces;

    var plotLayout = primaryLaout;
    plotLayout["xaxis"] = {};
    plotLayout["yaxis"] = {};
    plotLayout.xaxis["title"] = xLable || x;
    plotLayout.yaxis["title"] = yLable || y;
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
    // var text = []
    // xdata.map(item => {
    //     text.push('')
    // })

    var plotData = [
    { type: "scattergl", mode: "markers",  x: xdata, y: ydata }, {x:ydata, y:ydata, mode:"line",  color: 'grey'}
    ];
    var plotLayout = primaryLaout;
    plotLayout["xaxis"] = {};
    plotLayout["yaxis"] = {};
    plotLayout.xaxis["title"] = xLable ;
    plotLayout.yaxis["title"] = yLable;
    plotLayout.showlegend = false;
    plotLayout.width = 600;
    plotLayout.height = 600;
    plotLayout.annotations = {}

} else {
    console.log("Please choose a valid plot type");
}
setPlotData(plotData);
setPlotLayout(plotLayout);
};

return <Plot sx={{ p: 4, m: 1 }} data={plotData} layout={plotLayout} />;
};

export default PlotlyPlots;
