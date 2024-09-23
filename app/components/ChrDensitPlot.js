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
import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useState, useEffect } from 'react';

const ChrDensitPlot = ({ data }) => {
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

    const getPercenValue = (size, maxLength) => {
        return size / maxLength * 100
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

const createGradient =(size, maxLength, positions) => {
    var gradient = ['rgba(255, 255, 255, 1) 0%',]
    positions.map((pos) => {          
        let pos_percent = getPercenValue(pos,size) 
        gradient.push(`rgba(255, 255, 255, 1) ${pos_percent -0.1}%`)
        gradient.push(`rgba(0, 0, 0, 1) ${pos_percent -0.1}%`)
        gradient.push(`rgba(0, 0, 0, 1) ${pos_percent +0.1}%`)
        gradient.push(`rgba(255, 255, 255, 1) ${pos_percent +0.1}%`)
    })

    gradient.push('rgba(255, 255, 255, 1) 100pt')
    const finalString = gradient.toString()
    // console.log(`linear-gradient(to right, ${finalString})`)
    return `linear-gradient(to right, ${finalString})`
}

  return (
    <Box>
      <Paper sx={{padding : 2}} background='grey'>
      <Typography style={{fontFamily: 'Raleway', fontSize : '18pt'}} variant='h4' align='center' >Chromo Map</Typography>
      {data.map((chromosome) => (
        <Grid container sx={{marginTop : 2}} columns={2} columnGap={1} rowSpacing={8}>
        <Typography key={chromosome.name}>{chromosome.name}</Typography>
        <div
  style={{
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px',
    width: `${getPercenValue(chromosome.length, maxLength) - 5 }%`,
    height: '30px',
    border: '2px solid #ccc',
    position: 'relative',
    borderRadius: '10px', // You can adjust the radius based on your preference
    background: createGradient(chromosome.length, maxLength, chromosome.positions),
    
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

export default ChrDensitPlot;
