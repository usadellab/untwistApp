'use client';
import React from 'react'
import { Typography } from '@mui/material';
import {List,ListItem, ListItemButton,ListItemText} from '@mui/material';
import documentation from '../../public/documentation.json';

var docs = Object.values(documentation)


export function Documentation() {
  return (
      <>
      <Typography variant = 'h4' color='primary.dark' > Introduction </Typography>
      <Typography variant = 'p' color='secondary.light' >
              
      This application is meant to ease the analysis of Genomics data. The application can be used either as a standalone application  
        without installation from within browser, or can be deployed to cluster for integration into any JavaScript application. The application
        is capable of the following analysis on genomics data
       
       </Typography>
      <Typography variant = 'h5' color='primary.dark' > Toolkit</Typography>
     
      
        <List>
          {
            ['VisPheno', 'FastQC', 'LD Analysis', 'GWAS'].map((text, index) => (
            <ListItem  >
            <div>
              <ListItemButton 
                // alignment = 'left' 
                sx={{ border: 0.1, borderColor : 'secondary.light', width: 200 }}  
              > 
              {<h4>{text}</h4>}
              </ListItemButton>

              <ListItemText 
              sx={{ 
          // bgcolor: 'background.paper',
          // boxShadow: 1,
          // borderRadius: 2,
          p: 2,
          // minWidth: 300,
        }}
        primary={docs[index].description}  />
              </div>
            </ListItem>
          ))
          }
        </List>                


      </>

  )
}

