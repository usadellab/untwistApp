import React from 'react'
import dynamic from 'next/dynamic'
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })
import { useState, useEffect } from 'react'







const isObjectEmpty = (objectName) => {
  return Object.keys(objectName).length === 0
}

export default function ManhattanPlot(props) {
    //  prepare data
    var filteredArray = props.inputArray;
    const DEFAULT_PLOTLY_COLORS=['rgb(31, 119, 180)', 'rgb(255, 127, 14)',
                                    'rgb(44, 160, 44)', 'rgb(214, 39, 40)',
                                    'rgb(148, 103, 189)', 'rgb(140, 86, 75)',
                                    'rgb(227, 119, 194)', 'rgb(127, 127, 127)',
                                    'rgb(188, 189, 34)', 'rgb(23, 190, 207)']
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

        var chr_id = parseInt(filteredArray[i]["CHR"]);
        var pos = parseInt(filteredArray[i]["BP"]);
        var pvalue = Math.abs(Math.log10(parseFloat(filteredArray[i]["P"])));

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
                size : 3.5
            }
            };
            dict[chr_id]['x'] = [];
            dict[chr_id]['y'] = [];
            dict[chr_id].x.push(pos);
            dict[chr_id].y.push(pvalue);
            }
    }
    

    //  create the layout
 
    var layout={ 
        width: 1000, 
        height: 800, 
        showlegend: false,
        title: {
            text:'Manhattan Plot',
            font: {
              family: 'Courier New, monospace',
              size: 24
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
            title: {}
        },
        yaxis: {
            title: {
                text:'-log10(pvalue)',
                font: {
                  family: 'Courier New, monospace',
                  size: 18
                }
            },
            //   range : [0,12],
            showgrid:false,
            zeroline: false,
            showline: false,
        },

    }
    // set id and domain
    const N = Object.keys(dict).length;
    var chunk= 1/N;
    var a=0;
    var b=chunk;

    for(let i=0;i < N;i++){
        if(i==0){
            layout.xaxis.title["text"] = `Chr${chrs[i]}`;
            layout.xaxis.domain =  [a,b] 
        }else if(cnt==1){
            layout.xaxis2.title.text = `Chr${chrs[i]}`;
            layout.xaxis2.domain =  [a,b] 
        }else{
            layout[`xaxis${i+1}`] = {domain : [a,b], 
                anchor: 'y1',
                automargin : true,
                zeroline:false,
                showline: false,
                showticklabels: false,
                showgrid: false,
                title: {
                text: `Chr${chrs[i]}`,
                }
            };
        }
        var a = a + chunk;
        var b= a + chunk;
    }
    var data = [];
    var cnt = 0;
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

return (
    <>
    <Plot data={ data } layout={layout }/>
    </>
  )
}
