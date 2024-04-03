// ChromosomePlot.jsx
'use client'
import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useState, useEffect } from 'react';

const ChromosomePlot = ({ data }) => {
    const [hoveredPosition, setHoveredPosition] = useState(null);
    const [hoveredChromosome, setHoveredChromosome] = useState(null);
    const [hoverInfo, setHoverInfo] = useState('')

    const handleMouseEnter = (event, chromosomeLength, positions, chromosomeName) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const percentPosition = (mouseX / rect.width) * 100;
        const hoverinfo = `Chromosome : ${chromosomeName} \n Total length: ${chromosomeLength} bps \n Position: ${getPosition(chromosomeName,percentPosition)}`
        setHoveredPosition(percentPosition);
        setHoveredChromosome(chromosomeName);
        setHoverInfo(hoverinfo)
      };

    var maxLength = 0;
    data.map(chromosome => {
        if(chromosome.length > maxLength){
            maxLength = chromosome.length
        }
    })

    const getPercentValue = (size, maxLength) => {
        return size / maxLength * 100                                    // the size of the chromosome on the figure depends on the relative size of max
    }

    const getPosition = (chromosome, percentPosition) => {
        var length = 0;
        data.map(chrom => {
            if(chrom.name === chromosome){
                length = chrom.length
            }
        })
        return parseInt((percentPosition * length) / 100)
    }

    const getRelativePercentValue = (pos, length, total_percentage ) => {
      return pos / length * total_percentage                                    // the size of the chromosome on the figure depends on the relative size of max
  }
const createGradient =(name, size, maxLength, positions) => {
  var chr_percentage = getPercentValue(size, maxLength);
  // console.log(name, '\n','Chr %age', chr_percentage);

    var gradient = [
      'rgba(0, 128, 128, 1) 0%',
    ]
    positions.map((pos) => {       
      // console.log(positions)   
        let pos_percent = getRelativePercentValue(pos,size, chr_percentage)                     // as the actual size is already less then 100 % for smaller chromosomes (as compared to largest, the position should be relative to the relative percentage, so pass the chromosome length not the max length)
        // console.log(pos_percent)   
        
        gradient.push(`rgba(0, 128, 128, 1) ${pos_percent -0.1}%`)
        gradient.push(`rgba(0, 0, 0, 1) ${pos_percent -0.1}%`)
        gradient.push(`rgba(0, 0, 0, 1) ${pos_percent + 0.1}%`)
        gradient.push(`rgba(0, 128, 128, 1) ${pos_percent + 0.1}%`)
    })

    gradient.push(`rgba(0, 128, 128, 1) ${chr_percentage}%`)
    const finalString = gradient.toString()
    // console.log(`linear-gradient(to right, ${finalString})`)
    return `linear-gradient(to right, ${finalString})`
}



  return (
    <Box>
      <Paper sx={{padding : 2}} background='grey'>
      <Typography style={{fontFamily: 'Raleway', fontSize : '18pt'}} variant='h4' align='center' >Chromo Map</Typography>
      {data.map((chromosome) => (
        <Grid container sx={{marginTop : 2}} columns={2} columnGap={0.25} rowSpacing={8}>
        <Typography key={chromosome.name}>{chromosome.name}</Typography>
        <div
  style={{
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px',
    width: `${getPercentValue(chromosome.length, maxLength) -5}%`,
    height: '30px',
    border: '2px solid #ccc',
    position: 'relative',
    borderRadius: '10px', // You can adjust the radius based on your preference
    background: createGradient(chromosome.name,chromosome.length, maxLength, chromosome.positions),
    
}}


onMouseMove ={(e) => handleMouseEnter(e, chromosome.length, chromosome.positions, chromosome.name)}
onMouseLeave={() => {setHoveredPosition(null);setHoveredChromosome(null);}}

  
>
{hoveredPosition && hoveredChromosome === chromosome.name && (
                <div
              style={{
                position: 'absolute',
                top: '150%',
                left: `${hoveredPosition + 1.5}%`,
                // transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                zIndex: 1,
                width : '180pt'
              }}
            >
              {hoverInfo}
            </div>
          )}
</div>


        </Grid>


      ))}


</Paper>

    </Box>
  );
};

export default ChromosomePlot;
