import React, { useEffect, useState } from 'react';

const ChromosomeMap = ({ chromosomeData }) => {
  const [initialSVG, setInitialSVG] = useState('');
  const [isCreatingSVG, setIsCreatingSVG] = useState(true);

  const blockHeight = 20; // Height of each block
  const gap = 2; // Gap between blocks
  const lineHeight = blockHeight + gap; // Height of each line including gap


  useEffect(() => {
    // Load the initial SVG from the file
    fetch('/initial_chromosome_map.svg')
      .then(response => response.text())
      .then(svg => setInitialSVG(svg))
  }, []);

  useEffect(() => {
    // Once the initial SVG is loaded and chromosome data is available,
    // update the colors based on chromosomeData
      let updatedSVG = initialSVG;

      chromosomeData.forEach(chromosome => {

        const chrRect = document.querySelector(`#${chromosome.name.replace(' ','')}`);
        chromosome.positions.map(position => {
            const positionX = (position / 100) * chromosome.length;
            console.log(positionX)
            // chrRect + `<rect x="${positionX}%" y="0" width="1%" height="20" fill="red" />`.join("")
        })
        // console.log(chrRect)



        // const maxPosition = Math.max(...chromosome.positions.map(p => parseInt(p, 10)));
        // const width = (parseInt(maxPosition, 10) / 10000000) * 100;

        // Replace the width of the chromosome rectangle
        // updatedSVG = updatedSVG.replace(
        //   new RegExp(`<rect.*?${chromosome.name}.*?width=".*?"[^>]*>`, 'g'),
        //   `<rect x="0%" y="0" width="${width}%" height="20" fill="black" />`
        // );

        // Replace the color of each position within the chromosome
        // chromosome.positions.forEach(position => {
        //   const positionX = (parseInt(position, 10) / 10000000) * 100;
        //   updatedSVG = updatedSVG.replace(
        //     new RegExp(`<rect.*?${chromosome.name}.*?x="${positionX}%"[^>]*>`, 'g'),
        //     `<rect x="${positionX}%" y="0" width="1%" height="20" fill="red" />`
        //   );
        // });

      });

    //   // Update the SVG once after all changes are made
      setInitialSVG(updatedSVG);
      setIsCreatingSVG(false)
  }, [initialSVG]);

  return (
    <div>
      {isCreatingSVG ? <h5>Creating SVG...</h5> : 
        <div dangerouslySetInnerHTML={{ __html: initialSVG }} />
      }
    </div>
  );
};

export default ChromosomeMap;

