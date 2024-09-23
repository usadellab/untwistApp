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

// // LinesCanvas.jsx
// 'use client';
// import React, { useEffect, useRef } from 'react';

// const LinesCanvas = ({ data }) => {
//   data = data.slice(18);
//   console.log(data)
//   const canvasRef = useRef(null);

//   const maxWidth = document.body.clientWidth; // Set canvas width to the page width

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     const canvasHeight = 25; // Adjust the canvas height as needed
//     const verticalSpacing = 20; // Adjust the vertical spacing between figures
//     const labelOffsetX = 10; // Adjust the horizontal offset for the labels
//     const scaleHeight = 40; // Adjust the height of the scale

//     let maxLength = 0;

//     data.forEach((chr) => {
//       if (chr.length > maxLength) {
//         maxLength = chr.length;
//       }
//     });
//     console.log('I have calculated the max length it is', maxLength)

//     const totalLength = data.reduce((acc, chr) => acc + chr.length, 0);

//     canvas.width = Math.max(totalLength + labelOffsetX, maxWidth);
//     canvas.height = canvasHeight * data.length + verticalSpacing * (data.length - 1) + scaleHeight;

//     // Draw scale line
//     context.fillStyle = 'black';
//     context.font = '16px Arial';

//     const scaleWidth = (maxLength / totalLength) * canvas.width;
//     const scaleMarkSpacing = Math.ceil(maxLength / 5);

//     for (let i = 0; i <= maxLength; i += scaleMarkSpacing) {
//       const xPos = (i / maxLength) * scaleWidth + labelOffsetX;
//       context.beginPath();
//       context.moveTo(xPos, 20);
//       context.lineTo(xPos, scaleHeight);
//       context.stroke();
//       context.fillText(`${i}`, xPos - 5, scaleHeight - 15);
//     }

//     console.log('goiing to loop through the data now')

//     data.map((chr, index) => {
//       const positions = chr.positions;

//       // Draw figure
//       const scaledLength = (chr.length / totalLength) * canvas.width;
//       for (let i = 0; i < scaledLength; i++) {
//         let color = 'white';
//         let border = 'black';

//         if (positions.includes(i)) {
//           color = 'red';
//           border = 'red';
//         }

//         context.fillStyle = color;
//         context.strokeStyle = border;
//         context.lineWidth = 10;

//         context.beginPath();
//         context.moveTo(i + labelOffsetX, index * (canvasHeight + verticalSpacing) + scaleHeight);
//         context.lineTo(i + labelOffsetX, index * (canvasHeight + verticalSpacing) + scaleHeight + canvasHeight);
//         context.stroke();
//       }

//       // Draw label
//       context.fillStyle = 'black';
//       context.font = '16px Arial';
//       context.fillText(chr.name, scaledLength + 30, index * (canvasHeight + verticalSpacing) + scaleHeight + canvasHeight / 2);

//     });

//     console.log('I have done with computing this plot')

//   }, [data]);

//   return <canvas ref={canvasRef} style={{ border: '1px', borderRadius: '5px', width: '100%' }} />;
// };

// export default LinesCanvas;

// LinesCanvas.jsx
// LinesCanvas.jsx











// import React, { useEffect, useRef, useState } from 'react';

// const LinesCanvas = ({ data }) => {
//   const canvasRef = useRef(null);
//   const [imageDataArray, setImageDataArray] = useState([]);
//   const canvasWidth = Math.min(
//     document.body.clientWidth,
//     data.reduce((acc, chr) => acc + chr.length, 0)
//   ); // Set canvas width to the sum of chromosome lengths or the page width, whichever is smaller
//   console.log("drawing canvas")

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     const drawChromosome = (image, index) => {
//       context.drawImage(image, 0, index * 25); // Draw the image at the appropriate index
//     };

//     const worker = new Worker('/workers/chromosomeWorker.js');
//     console.log("created new worker")

//     console.log(data[0])

//     worker.onmessage = function (event) {
//       const { cmd, imageData, index } = event.data;
//       if (cmd === 'processingComplete') {
//         setImageDataArray((prevImageDataArray) => [
//           ...prevImageDataArray,
//           { imageData, index },
//         ]);
//       }
//     };

//     // Send all chromosome data to the worker for processing
//     Promise.all(
//       data.map((chr, index) => {
//         return new Promise((resolve, reject) => {
//           worker.postMessage({ cmd: 'process', chr, index });
//           resolve();
//         });
//       })
//     ).then(() => {
//       // Clean up worker after processing all data
//       worker.terminate();
//     });
//   }, [data]);

//   useEffect(() => {
//     if (imageDataArray.length === data.length) {
//       const canvas = canvasRef.current;
//       const context = canvas.getContext('2d');

//       // Sort imageDataArray by index before drawing
//       imageDataArray.sort((a, b) => a.index - b.index);

//       // Draw the chromosome images onto the main canvas
//       imageDataArray.forEach(({ imageData, index }) => {
//         createImageBitmap(imageData).then((image) => {
//           drawChromosome(image, index);
//         });
//       });
//     }
//   }, [imageDataArray]);

//   return (
//     <canvas
//       ref={canvasRef}
//       width={canvasWidth}
//       height={25 * data.length}
//       style={{ border: '1px', borderRadius: '5px', width: '100%' }}
//     />
//   );
// };

// export default LinesCanvas;


import React, { useEffect, useRef, useState } from 'react';

const LinesCanvas = ({ data }) => {
  console.log('HWE data', data)
  
  const canvasRef = useRef(null);
  const [imageDataArray, setImageDataArray] = useState([]);
  const canvasWidth = Math.min(
    document.body.clientWidth,
    data.reduce((acc, chr) => acc + chr.length, 0)
  ); // Set canvas width to the sum of chromosome lengths or the page width, whichever is smaller

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const drawChromosome = (image, index) => {
      context.drawImage(image, 0, index * 25); // Draw the image at the appropriate index
    };

    const worker = new Worker('/workers/chromosomeWorker.js');

    worker.onmessage = function (event) {
      const { cmd, imageData, index } = event.data;
      if (cmd === 'processingComplete') {
        setImageDataArray((prevImageDataArray) => [
          ...prevImageDataArray,
          { imageData, index },
        ]);
      }
    };

    // Function to process chromosome data sequentially
    const processChromosome = async (chr, index) => {
      return new Promise((resolve, reject) => {
        worker.postMessage({ cmd: 'process', chr, index });
        worker.onmessage = (event) => {
          const { cmd, imageData, index: workerIndex } = event.data;
          if (cmd === 'processingComplete') {
            resolve({ imageData, index: workerIndex });
          }
        };
      });
    };

    // Process chromosome data sequentially
    (async () => {
      for (let i = 0; i < data.length; i++) {
        const result = await processChromosome(data[i], i);
        setImageDataArray((prevImageDataArray) => [
          ...prevImageDataArray,
          result,
        ]);
      }
    })();

    return () => {
      worker.terminate(); // Clean up worker when unmounting
    };
  }, [data]);

  useEffect(() => {
    if (imageDataArray.length === data.length) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Sort imageDataArray by index before drawing
      imageDataArray.sort((a, b) => a.index - b.index);

      // Draw the chromosome images onto the main canvas
      imageDataArray.forEach(({ imageData, index }) => {
        createImageBitmap(imageData).then((image) => {
          drawChromosome(image, index);
        });
      });
    }
  }, [imageDataArray]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={25 * data.length}
      style={{ border: '1px', borderRadius: '5px', width: '100%' }}
    />
  );
};

export default LinesCanvas;
