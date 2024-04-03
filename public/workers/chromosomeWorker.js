// // chromosomeWorker.js
// self.onmessage = function(event) {
//     const { chr, index } = event.data;
//     const canvas = new OffscreenCanvas(chr.length, 25); // Create a canvas with width equal to chromosome length and height 25
//     const context = canvas.getContext('2d');
  
//     // Draw figure
//     const scale = canvas.width / chr.length;
//     for (let i = 0; i < chr.length; i++) {
//       let color = 'white';
  
//       if (chr.positions.includes(i)) {
//         color = 'red';
//       }
  
//       context.fillStyle = color;
//       context.fillRect(i, 0, 1, 25); // Draw a vertical line for each position
//     }
  
//     // Post the canvas image data back to the main thread
//     const imageData = canvas.transferToImageBitmap();
//     self.postMessage({ imageData, index });
//   };
 

// chromosomeWorker.js
// self.onmessage = function(event) {
//     var cmd  = event.data.cmd;
//     if (cmd == 'process'){
//         var chr = event.data.chr;
//         console.log('Processing: ', chr.name);
//         const canvas = new OffscreenCanvas(chr.length, 25); // Create a canvas with width equal to chromosome length and height 25
//         const context = canvas.getContext('2d');
//         const positionsArray = Array.from({ length: chr.length }, (_, i) => i + 1);
//         const observedPositions = chr.positions;
//         const unionArray = positionsArray.map((pos) => observedPositions.includes(pos));
//         // Draw figure
//         unionArray.forEach((isInPosition, i) => {
//             const color = isInPosition ? 'red' : 'green';
//             context.fillStyle = color;
//             context.fillRect(i * scale, 0, scale, 25); // Draw a rectangle for each position
//         });
//         // Post the canvas image data back to the main thread
//         const imageData = canvas.transferToImageBitmap();
//         console.log(imageData)
//         self.postMessage({ cmd : 'proessingComplete', imageData : imageData, index : index });
//     }  
// };

// chromosomeWorker.js
self.onmessage = function (event) {
    const { cmd, chr, index } = event.data;
    if (cmd === 'process') {
      const canvas = new OffscreenCanvas(chr.length, 25); // Create a canvas with width equal to chromosome length and height 25
      const context = canvas.getContext('2d');
  
      // Draw figure
      const positionsArray = Array.from({ length: chr.length }, (_, i) => i + 1);
      const unionArray = positionsArray.map((pos) =>
        chr.positions.includes(pos)
      );
  
      unionArray.forEach((isInPosition, i) => {
        const color = isInPosition ? 'red' : 'green';
        context.fillStyle = color;
        context.fillRect(i, 0, 1, 25); // Draw a rectangle for each position
      });
  
      // Create a copy of the canvas before transferring its image data
      const copyCanvas = new OffscreenCanvas(canvas.width, canvas.height);
      const copyContext = copyCanvas.getContext('2d');
      copyContext.drawImage(canvas, 0, 0);
  
      // Post the copy of canvas image data back to the main thread
      const imageData = copyCanvas.transferToImageBitmap();
      self.postMessage({ cmd: 'processingComplete', imageData, index });
    }
  };
  

