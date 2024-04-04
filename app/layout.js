'use client'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import QuizIcon from "@mui/icons-material/Quiz";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import ForestIcon from "@mui/icons-material/Forest";
import PlaceIcon from "@mui/icons-material/Place";
import InsightsIcon from "@mui/icons-material/Insights";
import { createTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { Switch } from '@mui/material';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PersonIcon from '@mui/icons-material/Person';

import { SelectedSpeciesProvider } from '@/contexts/SelectedSpeciesContext';
import { AppDataContextProvider, useAppDataContext } from "@/contexts/AppDataContext";
import { ApiContextProvider } from "@/contexts/ApiEndPoint";
import { TokenProvider } from "@/contexts/TokenContext";
import QueryStatsIcon from '@mui/icons-material/QueryStats';


import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { UntwistThemeProvider, useUntwistThemeContext } from '@/contexts/ThemeContext';

import Login from './components/LoginPage';
import Cookies from 'js-cookie';

const drawerWidth = 240;


const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const openedMixin = (theme) => ({
width: drawerWidth,
transition: theme.transitions.create("width", {
  easing: theme.transitions.easing.sharp,
  duration: theme.transitions.duration.enteringScreen,
}),
overflowX: "hidden",
});

const closedMixin = (theme) => ({
transition: theme.transitions.create("width", {
  easing: theme.transitions.easing.sharp,
  duration: theme.transitions.duration.leavingScreen,
}),
overflowX: "hidden",
width: `calc(${theme.spacing(7)} + 1px)`,
[theme.breakpoints.up("sm")]: {
  width: `calc(${theme.spacing(7)} + 10px)`,
},
});


const DrawerHeader = styled("div")(({ theme }) => ({
// display: "flex",
alignItems: "left",
// justifyContent: "flex-end",
// padding: theme.spacing(0, 1),
// necessary for content to be below app bar
...theme.mixins.toolbar,
backgroundColor: theme.palette.background.default,
color: theme.palette.text.primary,
height: '1500vh', //'100%', //'1500vh', // Set the height to 100% of the viewport height
width: "100%", // Set the height to 100% of the viewport height
marginTop : "50pt",
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: open ? "#f0f0f0" : '#f0f0f0',

  ...(open && {
    marginLeft: drawerWidth,
    width: -100, //`calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      backgroundColor: "#f0f0f0", 
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      backgroundColor: "#927692", 
    },
  }),
}));


function parseToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const payload = JSON.parse(atob(base64));
    return payload.exp;
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
}

function isTokenExpired(token) {
  const expirationTimestamp = parseToken(token);
  if (expirationTimestamp === null) {
    // Token parsing error
    return true; // Consider it expired
  }

  // Convert the expiration timestamp to milliseconds
  const expirationDate = new Date(expirationTimestamp * 1000);
  const currentDate = new Date();

  // Compare the current date to the token's expiration date
  return currentDate > expirationDate;
}



export default function RootLayout({ children }) {
  const router = useRouter()
  const { selectedSpp, setSelectedSpp } = useState("camelina");
  const [genomicsDropDown, setgenomicsDropDown] = React.useState(false);
  const [open, setOpen] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(lightTheme)
  const [leftMarginChildren, setLeftMargin] = useState(30)
  const [isDark, setIsDark] = useState(false);
  const {isDarkMode, toggleTheme} = useUntwistThemeContext();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check for the presence of a token in cookies on page load
    try {
      const token = Cookies.get("token");
  
      // Check if the token exists before proceeding
      if (token) {
        if (isTokenExpired(token)) {
          setAuthenticated(false);
        } else {
          setAuthenticated(true);
        }
      } else {
        console.log('Token not found. Looks like you are here for the first time.');
      }
    } catch (error) {
      console.error('Error checking token:', error);
    }
  }, []);
  

  const updateAuthenticationStatus = (status) => {
    setAuthenticated(status);
  };

  const changeTheme = () => {
    setIsDark(!isDark);
  };

  const [appBarTitle, setAppBarTitle] = useState(
    <Typography variant="h6" sx={{
        // mx: 2,
        // display: { md: 'flex' },
        // fontFamily: '-apple-system',
        // fontWeight: 700,
        // letterSpacing: '.3rem',
        // color: 'green', //'inherit',
        // textDecoration: 'none',
    }}>
      UNTWIST KNOWLEDGE HUB
    </Typography>
  );

  const handleAppBarTitle = (text) => {
    const newTitle = <Typography variant="h6" sx={{
      mx: 2,
      // display: { md: 'flex' },
      // fontFamily: '-apple-system',
      // fontWeight: 700,
      // letterSpacing: '.2rem',
      // color: 'green', //'inherit',
      // textDecoration: 'none',
  }}>
    {text}
  </Typography>

setAppBarTitle(newTitle)


  }

  const handleGenomics = () => {
    setgenomicsDropDown(!genomicsDropDown);
  };


  const ToggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const newTheme = isDark ? darkTheme : lightTheme ;
    setSelectedTheme(newTheme)
  },[isDark])

useEffect(() => {
  if(open){
    setLeftMargin(30)
  }else{
    setLeftMargin(8)
  }
}, [open])

  var gwasIconPic = new URL("/public/manhattan.png", import.meta.url);
  var pcaIconPic = new URL("/public/pca.png", import.meta.url);
  var mdsIconPic = new URL("/public/mds.png", import.meta.url);

  return (
    <html lang="en">


      <ApiContextProvider>
        <TokenProvider>
        <StyledThemeProvider theme={selectedTheme}>
  <MuiThemeProvider theme={selectedTheme}>
              <AppDataContextProvider>
      <SelectedSpeciesProvider>



      <body className={inter.className}>
      {  !authenticated ? (
    // router.push('/login');
    <Login updateAuthenticationStatus={updateAuthenticationStatus} />
) : (
  <div>
<AppBar position="fixed" open={open} color="default" enableColorOnDark>
          <Toolbar>
            <MenuIcon sx={{ marginRight: 2 }} onClick={ToggleDrawer} />

            {appBarTitle}
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <Divider />
          <div>
              <ListItemButton
                sx={{ mt: 8 }}
                onClick={(e) => {
                  handleAppBarTitle("Home")
                  router.push("/router?component=home");
                }}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>

            <ListItemButton
              onClick={() => {
                handleAppBarTitle("Germplasm");
                router.push("/router?component=germplasm");
              }}
            >
              <ListItemIcon>
                <PlaceIcon />
              </ListItemIcon>
              <ListItemText primary="Germplasm" />
            </ListItemButton>

            <ListItemButton
              onClick={() => {
                handleAppBarTitle("Visualization of phenotyic data");
                router.push("/router?component=vispheno");

              }}
            >
              <ListItemIcon>
                <ForestIcon />
              </ListItemIcon>
              <ListItemText primary="Phenotypic Data" />
            </ListItemButton>

            <ListItemButton
              onClick={() => {
                if (selectedSpp === "") {
                  setContent(<DataSetMaker />);
                } else {
                  handleGenomics();
                }
              }}
            >
              <ListItemIcon>
                <InsightsIcon />
              </ListItemIcon>
              <ListItemText primary="Genomics" />
              {genomicsDropDown ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={genomicsDropDown} timeout="auto" unmountOnExit>

            {/* <ListItemButton
                  onClick={() => {
                    handleAppBarTitle("Summary Statistics");
                    router.push("/router?component=summary_statistics");

                  }}
                >
                  <ListItemIcon>
                  <QueryStatsIcon/> 
</ListItemIcon>
<ListItemText primary="Summary Statistics" />
</ListItemButton> */}



                <ListItemButton
                  onClick={() => {
                    handleAppBarTitle("GWAS");
                    router.push("/router?component=gwas");

                  }}
                >
                  <ListItemIcon>
<Avatar sx={{ width: 25, height: 25 }} alt="Icon" src={gwasIconPic}></Avatar>

                  </ListItemIcon>
                  <ListItemText primary="GWAS" />
                </ListItemButton>


                <ListItemButton
                  onClick={() => {
                    handleAppBarTitle("PCA");
                    router.push("/router?component=pca");
                  }}
                >
                  <ListItemIcon>
                  <Avatar sx={{ width: 25, height: 25 }} alt="Icon" src={pcaIconPic}></Avatar>

                  </ListItemIcon>
                  <ListItemText primary="PCA" />
                </ListItemButton>

                <ListItemButton
                  onClick={() => {
                    handleAppBarTitle("MDS");
                    router.push("/router?component=mds");
                  }}
                >
                  <ListItemIcon>
                  <Avatar sx={{ width: 25, height: 25 }} alt="Icon" src={mdsIconPic}></Avatar>

                  </ListItemIcon>
                  <ListItemText primary="MDS" />
                </ListItemButton>



                {/* <ListItemButton
                  onClick={() => {
                    handleAppBarTitle("Phylogenetics");
                    router.push("/router?component=PhyloTreeComp");
                  }}
                >
                  <ListItemIcon>
                  <Avatar sx={{ width: 25, height: 25 }} alt="Icon" src={mdsIconPic}></Avatar>

                  </ListItemIcon>
                  <ListItemText primary="PhyloTree" />
                </ListItemButton> */}


            </Collapse>

            <ListItemButton
              onClick={() => {
                handleAppBarTitle("Genome Browser");
                router.push("/router?component=jb");

              }}
            >
              <ListItemIcon>
                <Avatar sx={{ width: 25, height: 25 }} alt="Icon" src='/dna-icon.png' />
              </ListItemIcon>
              <ListItemText primary="Genome Browser" />
            </ListItemButton>

            <ListItemButton 
            onClick={() => {
              handleAppBarTitle("Downloads");
              router.push("/router?component=downloads");
        }}
            >
              <ListItemIcon>
                <DownloadIcon />
              </ListItemIcon>
              <ListItemText primary="Downloads" />
            </ListItemButton>

            <ListItemButton
              onClick={() => {
                handleAppBarTitle("FAQs");
                router.push("/router?component=faqs");
              }}
            >
              <ListItemIcon>
                <QuizIcon />
              </ListItemIcon>
              <ListItemText primary="FAQs" />
            </ListItemButton>

            <ListItemButton
              onClick={() => {
                handleAppBarTitle("People");
                router.push("/router?component=people");
              }}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="People" />
            </ListItemButton>



            <ListItemButton
              onClick={() => {
                handleAppBarTitle("Contact");
                router.push("/router?component=contact");
              }}
            >
              <ListItemIcon>
                <PermContactCalendarIcon />
              </ListItemIcon>
              <ListItemText primary="Contact" />
            </ListItemButton>

            {/* <UntwistThemeProvider value={{isDarkMode, toggleTheme}}>

            <ListItemButton onClick={toggleTheme}>
              <ListItemIcon>
                <Switch
                  sx={{ ml: -2 }}
                  checked={isDark}
                  onChange={changeTheme}
                  inputProps={{ "aria-label": "toggle theme" }}
                />
              </ListItemIcon>
              <ListItemText
                primary="Dark Theme"
              />
            </ListItemButton>
            </UntwistThemeProvider> */}

          </div>

          
        </Drawer>
        
<DrawerHeader sx={{marginLeft : leftMarginChildren, marginTop : 8,  width: '80%',  height: '1500vh'}}>
  

<div>{children}</div>
</DrawerHeader>
</div>
)
}

      </body>

      </SelectedSpeciesProvider>
      </AppDataContextProvider>
      </MuiThemeProvider>
</StyledThemeProvider>
      </TokenProvider>
      </ApiContextProvider>
    </html>
  )
}
