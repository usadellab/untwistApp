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

import React, { useEffect, useState } from 'react';
import { Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import Footer from './Footer'; // Import your Footer component here
import { useUntwistThemeContext } from "../../contexts/ThemeContext"
import { UntwistThemeProvider } from "../../contexts/ThemeContext";

const WelcomePage = () => {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useUntwistThemeContext();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.between('sm', 'md','ld'));
  const containerWidth = isSmallScreen ? '90%' : isMediumScreen ? '80%' : '100%';
  const imageHeight = isSmallScreen ? '15vh' : isMediumScreen ? '30vh' : '55vh';
  const containerSize = isSmallScreen ? 'sm' : isMediumScreen ? 'md' : 'ld';
  
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      margin: 0,
      color: 'blue',
      width: containerWidth, // '100%',
      // backgroundColor: 'lightyellow',

    },
    image: {
      width: '100%',
      height: imageHeight, //'100%',
      borderRadius: '10px',
    },
    content: {
      // backgroundColor: 'lightyellow',
      textAlign: 'center',
      // borderRadius: '10px',
      padding : 0,
      margin: 0, 
      width: '100%',

    }

  };


  return (
    <UntwistThemeProvider values={{isDarkMode, toggleTheme}}>

    <Container sx={{mt:2, ml:0}} maxWidth={containerSize} >
      <div style={styles.container}>
        <img src={'/untField.png'} alt="untwist field" style={styles.image} />
        <div style={styles.content}>
          <Typography sx={{mt:-35}} variant="h4" >
            <a style={{color : '#332288'}} href="https://www.fz-juelich.de/en/ibg/ibg-4/about-us" target="_blank" rel="noreferrer">
              Institute of Bio and Geosciences (IBG-4)
            </a>
          </Typography>
          <Typography sx={{mb: 23}} variant="h6">
            Wilhelm-Johnen-Straße 52428 Jülich, Germany
          </Typography>
          <Footer isDark={isDarkMode} />
        </div>
      </div>
    </Container>



    </UntwistThemeProvider>



  );
};

export default WelcomePage;
