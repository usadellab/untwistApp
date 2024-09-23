# This file is part of [untwistApp], copyright (C) 2024 [ataul haleem].

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

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

