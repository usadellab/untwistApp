'use client'
// BarPlot.jsx
import React from 'react';
import Plot from 'react-plotly.js';

const BarPlot = ({ data }) => {
  const barData = data.map((chromosome) => {
    const positions = chromosome.positions;
    const uniqueValues = Array.from({ length: chromosome.length }, (_, i) => i);
    const colorArray = new Array(chromosome.length).fill('green');

    positions.forEach((pos) => {
      if (pos < chromosome.length) {
        colorArray[pos] = 'red';
      }
    });

    return {
      type: 'bar',
      name: chromosome.name,
      y: new Array(chromosome.length).fill(chromosome.length),
      x: uniqueValues,
      orientation: 'h', // Set orientation to horizontal
    //   marker: {
    //     color: colorArray,
    //   },
    };
  });

  const layout = {
    heigh : 1000,
    width : 1500,
    barmode: 'stack',
    yaxis: {
      title: 'Chromosome',
    },
    xaxis: {
      title: 'Length',
    },
  };

  return (
    <Plot
      data={barData}
      layout={layout}
      config={{ displayModeBar: false }} // Disable the display of mode bar for simplicity
    />
  );
};

export default BarPlot;

