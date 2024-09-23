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

// ChromosomePlot.jsx
'use client'


// ChromosomePlot.jsx
import React, { useEffect, useRef, useState } from 'react';


const LinesDiv = () => {
  const generateLines = () => {
    const lineCount = 4000000;
    const line = 'linear-gradient(to right, black 1px, transparent 1px)';

    const lines = Array.from({ length: lineCount }, (_, index) => line).join(',');

    return {
      backgroundImage: lines,
      backgroundSize: `${lineCount}px 100%`,
      height: '20px',  // Adjust the height as needed
    };
  };

  return <div style={generateLines()} />;
};
const ChromosomePlot = ({ data }) => {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const context = canvas.getContext('2d');

    const drawLines = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      const numChromosomes = data.length;
      const rowSpacing = 2; // Added row spacing for separation
      const lineSpacing = 0.01; // Added spacing between lines for visibility

      let totalSegments = 0; // Total number of segments for scaling
      let maxSegments = 0; // Maximum number of segments in a row
      for (let i = 0; i < numChromosomes; i++) {
        totalSegments += data[i].length;
        maxSegments = Math.max(maxSegments, data[i].length);
      }

      let yOffset = 0; // Tracks the vertical position of each row

      for (let i = 0; i < numChromosomes; i++) {
        const chromosome = data[i];
        const numSegments = maxSegments;
        const positions = chromosome.positions;

        // Calculate the scale factor for the row based on its length
        const scale = (canvas.width - lineSpacing * (numSegments - 1)) / numSegments;
        const rowHeight = 4; //(canvas.height - rowSpacing * (numChromosomes - 1)) / numChromosomes;

        context.strokeStyle = 'black'; // Set border color

        // Draw the border line for each row
        context.beginPath();
        context.moveTo(0, yOffset);
        // context.lineTo(canvas.width, yOffset);
        // context.stroke();

        for (let j = 0; j < numSegments; j++) {
          let color = 'green'; // Default color

          if (positions.includes(j) && j < chromosome.length) {
            color = 'red'; // Color segment red if in positions and within object length
          } else if (j >= chromosome.length) {
            color = 'white'; // Color segment white if beyond object length
          }

          context.fillStyle = color;

          // Calculate the scaled position
          const x = j * (scale + lineSpacing);
          const y = yOffset;

          // Draw the line
          context.fillRect(x, y, scale, rowHeight);
        }

        // Update the yOffset for the next row
        yOffset += rowHeight + rowSpacing;
      }
    };

    const handleMouseEnter = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // TODO: Implement hover logic

      setHoverInfo(null);
    };

    const handleMouseLeave = () => {
      setHoverInfo(null);
    };

    overlay.addEventListener('mouseenter', handleMouseEnter);
    overlay.addEventListener('mouseleave', handleMouseLeave);

    drawLines();

    // Cleanup event listeners on unmount
    return () => {
      overlay.removeEventListener('mouseenter', handleMouseEnter);
      overlay.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [data]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas style={{ display: 'block', width: '100%' }} ref={canvasRef} />
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
      {hoverInfo && <div style={{ marginTop: '10px' }}>{hoverInfo}</div>}
    </div>
  );
};

export default ChromosomePlot;
