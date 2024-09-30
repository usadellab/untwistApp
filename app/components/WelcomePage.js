// import React, { useEffect, useState } from 'react';
// import { Container, Typography, useMediaQuery, useTheme } from '@mui/material';
// import Footer from './Footer'; // Import your Footer component here
// import { useUntwistThemeContext } from "../../contexts/ThemeContext"
// import { UntwistThemeProvider } from "../../contexts/ThemeContext";

// const WelcomePage = () => {
//   const theme = useTheme();
//   const { isDarkMode, toggleTheme } = useUntwistThemeContext();

//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
//   const isLargeScreen = useMediaQuery(theme.breakpoints.between('sm', 'md','ld'));
//   const containerWidth = isSmallScreen ? '90%' : isMediumScreen ? '80%' : '100%';
//   const imageHeight = isSmallScreen ? '15vh' : isMediumScreen ? '30vh' : '55vh';
//   const containerSize = isSmallScreen ? 'sm' : isMediumScreen ? 'md' : 'ld';
  
//   const styles = {
//     container: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       minHeight: '80vh',
//       margin: 0,
//       color: 'blue',
//       width: containerWidth, // '100%',
//       // backgroundColor: 'lightyellow',

//     },
//     image: {
//       width: '100%',
//       height: imageHeight, //'100%',
//       borderRadius: '10px',
//     },
//     content: {
//       // backgroundColor: 'lightyellow',
//       textAlign: 'center',
//       // borderRadius: '10px',
//       padding : 0,
//       margin: 0, 
//       width: '100%',

//     }

//   };


//   return (
//     <UntwistThemeProvider values={{isDarkMode, toggleTheme}}>

//     <Container sx={{mt:2, ml:0}} maxWidth={containerSize} >
//       <div style={styles.container}>
//         <img src={'/untField.png'} alt="untwist field" style={styles.image} />
//         <div style={styles.content}>
//           <Typography sx={{mt:-35}} variant="h4" >
//           Uncover and Promote Tolerance to Temperature and Water Stress in Camelina sativa
//           </Typography>
//           <Typography sx={{mb: 23}} variant="h6">
//             Wilhelm-Johnen-Straße 52428 Jülich, Germany
//           </Typography>
//           <Footer isDark={isDarkMode} />
//         </div>
//       </div>
//     </Container>



//     </UntwistThemeProvider>



//   );
// };

// export default WelcomePage;


// import React from 'react';
// import { Container, Typography, useMediaQuery, useTheme, Box, Button } from '@mui/material';
// import Footer from './Footer'; 
// import { useUntwistThemeContext } from "../../contexts/ThemeContext";
// import { UntwistThemeProvider } from "../../contexts/ThemeContext";

// const WelcomePage = () => {
//   const theme = useTheme();
//   const { isDarkMode, toggleTheme } = useUntwistThemeContext();

//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

//   // Style configurations
//   const containerSize = isSmallScreen ? 'sm' : isMediumScreen ? 'md' : 'lg';
//   const textAlignment = isSmallScreen ? 'center' : 'left';

//   const styles = {
//     container: {
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       minHeight: '80vh',
//       textAlign: textAlignment,
//     },
//     heading: {
//       fontWeight: 700,
//       marginBottom: theme.spacing(2),
//     },
//     subHeading: {
//       fontWeight: 300,
//       marginBottom: theme.spacing(4),
//     },
//     buttonContainer: {
//       display: 'flex',
//       justifyContent: isSmallScreen ? 'center' : 'flex-start',
//       marginTop: theme.spacing(4),
//     },
//     button: {
//       padding: theme.spacing(1.5, 4),
//       borderRadius: '25px',
//       color: 'white',
//       backgroundColor: theme.palette.primary.main,
//     }
//   };

//   return (
//     <UntwistThemeProvider values={{ isDarkMode, toggleTheme }}>
//       <Container maxWidth={containerSize} sx={{ mt: 2 }}>
//         <Box sx={styles.container}>
//           <Typography variant="h3" sx={styles.heading}>
//             Uncover Tolerance to Environmental Stress in Camelina sativa
//           </Typography>
//           <Box sx={styles.buttonContainer}>
//             <Button variant="contained" sx={styles.button}>
//               Learn More
//             </Button>
//           </Box>
//         </Box>
//       </Container>
//       <Footer isDark={isDarkMode} />
//     </UntwistThemeProvider>
//   );
// };

// export default WelcomePage;




import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Typography, Container, Box, Grid, useTheme, useMediaQuery } from '@mui/material';
import Footer from './Footer'; // Assuming you keep your custom Footer component
import { useApiContext } from '@/contexts/ApiEndPoint';
import { useTokenContext } from '@/contexts/TokenContext';
import axios from 'axios';
import Cookies from 'js-cookie';

const WelcomePage = () => {
  const token = useTokenContext();
  const { apiEndpoint } = useApiContext();
  const [partners, setPartners] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const darkModeValue = Cookies.get("isDarkMode");
      setIsDarkMode(darkModeValue === "true");
    }, 1); // Check every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);


  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const institute_ids = ["AIT", "INRAE", "RRES", "FZJ", "UNIBO", "CCE", "INI", "RTDS"];
        
        // Use Promise.all to wait for all axios calls to finish
        const responses = await Promise.all(
          institute_ids.map(id => 
            axios.post(`${apiEndpoint}/institute?instituteId=${id}&token=${token.apiToken}`)
          )
        );
        
        // Extract data from all responses
        const newpartners = responses.map(response => response.data.result.data[0]);
                
        // Update the partners state
        setPartners(newpartners);
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };
  
    fetchPartners();
  }, [apiEndpoint, token.apiToken]); // Make sure to include dependencies
  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const styles = {
    hero: {
      backgroundColor: isDarkMode ? '#121212' :'#e0f7fa', // Light teal background
      // color: isDarkMode ? 'white' : 'black',
      height: '70vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '0 20px',
    },
    section: {
      backgroundColor: isDarkMode ? '#121212' :'white', // Light teal background
      padding: '50px 0',
    },
    sectionPartners: {
      backgroundColor: isDarkMode ? '#121212' : '#f0f0f0', 
      padding: '50px 0',
    },
    sectionTitle: {
      marginBottom: '20px',
      fontWeight: 700,
      color: '#00796b',
    },
    button: {
      marginTop: '20px',
      padding: theme.spacing(1, 4),
      borderRadius: '25px',
    },
    logo: {
      maxWidth: '300px',
    },
  };


      //   {/* Navigation */}
      
      //   <AppBar position="static" color="transparent" elevation={0}>
      //   <Toolbar sx={{ justifyContent: 'space-between' }}>
      //     <img src="/LOGO-UNTWIST.jpg" alt="UNTWIST Logo" style={styles.logo} /> {/* Add your logo */}
      //     <Button color="primary" variant="outlined" sx={{ borderRadius: '20px' }}>
      //       Contact Us
      //     </Button>
      //   </Toolbar>
      // </AppBar>


  return (
    <>




      {/* Hero Section */}


      <Box sx={styles.hero}>
        <Typography variant={isSmallScreen ? 'h4' : 'h2'} fontWeight="bold" color="green">
          Uncovering Environmental Stress Tolerance in Camelina sativa
        </Typography>
        <Typography variant="h6" sx={{ marginTop: 2, maxWidth : '75%' }}>
        The Camelina Knowledge Hub is a comprehensive web-based platform designed to empower scientists, farmers, and the general public with advanced tools and resources for Camelina research, farming, and data exploration.
        </Typography>
        <Button variant="contained" color="primary" sx={styles.button} type='a' href='https://ataulhaleem.github.io/camelina-hub-documentation/' target='blank'>
          Learn More
        </Button>
      </Box>


      {/* <Box
  sx={{
    ...styles.hero,
    backgroundImage: `url('/welcomeImg.jpg')`, // Replace with your image path
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  <Typography variant={isSmallScreen ? 'h4' : 'h2'} fontWeight="bold" color="black">
    Uncovering Environmental Stress Tolerance in Camelina sativa
  </Typography>
  <Typography variant="h6" sx={{ marginTop: 2 }} color="black">
        The Camelina Knowledge Hub is a comprehensive web-based platform designed to empower scientists, farmers, and the general public with advanced tools and resources for Camelina research, farming, and data exploration.
  </Typography>
  <Button variant="contained" color="primary" sx={styles.button}>
    Learn More
  </Button>
</Box> */}


      {/* About Section */}
      <Container maxWidth="lg" sx={styles.section}>
        <Typography variant="h4" sx={styles.sectionTitle}>
          About UNTWIST
        </Typography>
        <Typography variant="body1" color="textSecondary">
          UNTWIST is a unique consortium aiming to promote the tolerance of Camelina sativa to temperature and water stress.
          Our research aims to contribute to sustainable agriculture by developing plants that are resilient to environmental changes.
        </Typography>
      </Container>

      {/* Our Partners Section */}

      {partners && (
  <Box sx={{ ...styles.sectionPartners }}>
    <Container maxWidth="lg">
      <Typography variant="h4" sx={styles.sectionTitle}>
        Our Partners
      </Typography>

      <Grid container spacing={4}>
        {partners.map((partner, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Typography variant="h6" fontWeight="bold">
              {partner.institute_name} ({partner.institute_identifier})
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {partner.institute_city}, {partner.institute_country}
            </Typography>
            <Typography variant="body2" color="primary">
              <a href={partner.institute_weburl} target="_blank" rel="noopener noreferrer">
                {partner.institute_weburl}
              </a>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Short description of the partner.
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
)}

      {/* Footer */}
      <Footer isDark={isDarkMode}/>


    </>
  );
};

export default WelcomePage;
