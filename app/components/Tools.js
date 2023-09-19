import React from 'react'
import Box from '@mui/material/Box';
import CardTemplate from './CardTemplate';


export function Tools() {
  return (
    <>
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: 350,
          height: 300,
        },
      }}
    >
    
    <CardTemplate
      myImage = './dataViz.png' 
      title = 'VisPheno' 
      description = 'A tool to create interactive plots with plotly.js, using data from a csv or the backend DB' />

    <CardTemplate
          myImage = './pca.png' 
        title = 'PCA' 
        description = 'Principal component analysis '
        />


      <CardTemplate
          myImage = './MDS.png' 
        title = 'MDS' 
        description = 'Population stratification'
        />

      {/* <CardTemplate
          myImage = './LDplot.png' 
        title = 'LD analysis' 
        description = 'Find correlations among genetic markers '
        /> */}




      <CardTemplate
        myImage = './manhattanplot.png' 
        title = 'GWAS' 
        description = 'Genome wide association analysis '
        />

    </Box>
    </>
  );
}





// import React from 'react'
// import Box from '@mui/material/Box';
// import CardTemplate from './CardTemplate';


// export function Tools() {
//   return (
//     <>
//     <Box
//       sx={{
//         display: 'flex',
//         flexWrap: 'wrap',
//         '& > :not(style)': {
//           m: 1,
//           width: 800,
//           height: 300,

//         },

//         flexDirection: 'column'

//       }}
//     >
    
//       <CardTemplate
//       myImage = './dataViz.png' 
//       title = 'VisPheno' 
//       description = 'A tool to create interactive plots with plotly.js, using data from a csv or the backend DB' />

//       <CardTemplate
//           myImage = './MDS.png' 
//         title = 'MDS' 
//         description = 'Population stratification'
//         />

//       {/* <CardTemplate
//           myImage = './LDplot.png' 
//         title = 'LD analysis' 
//         description = 'Find correlations among genetic markers '
//         /> */}

//       <CardTemplate
//         myImage = './manhattanplot.png' 
//         title = 'GWAS' 
//         description = 'Genome wide association analysis '
//         />

//       {/* <CardTemplate
//         myImage = './fastp.png' 
//         title = 'Fastp' 
//         description = 'Analyze sequencing qualitly of FastQ data'/> */}
//     </Box>
//     </>
//   );
// }


