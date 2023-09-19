"use client";

import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import HomeIcon from "@mui/icons-material/Home";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import StorageIcon from "@mui/icons-material/Storage";
import { Documentation } from "./Documentation";
import { Tools } from "./Tools";
import { FAQs } from "./FAQs";
import { Contact } from "./Contact";
import { UserContext } from "../../contexts/ToolContext";
import { useState} from "react";
import { useSelectedSpecies } from "../../contexts/SelectedSpeciesContext";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import QuizIcon from "@mui/icons-material/Quiz";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import ForestIcon from "@mui/icons-material/Forest";

import { Analysis } from "./Analysis";
import DataSetMaker from "./DataSetMaker";
import Downloads from "./Downloads";
import WelcomePage from "./WelcomePage";

const drawerWidth = 240;

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
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
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
  // whiteSpace: 'nowrap',
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export function MiniDrawer() {
  const { selectedSpp, setSelectedSpp } = useSelectedSpecies();

  const homePage = <WelcomePage />;
  // const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [content, setContent] = useState(homePage);
  const [appBarTitle, setAppBarTitle] = useState(
    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
      {" "}
      UNTWIST KNOWLEDGE HUB{" "}
    </Typography>
  );
  const [genomicsDropDown, setgenomicsDropDown] = React.useState(false);
  const [filedDataDropDown, setFiledDataDropDown] = React.useState(false);

  const loadPlink = () => {
    const initializeModule = async () => {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "wasm/plink.js";
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };
    initializeModule();
  };

  const handleGenomics = () => {
    setgenomicsDropDown(!genomicsDropDown);
    loadPlink();
  };

  const handleFieldData = () => {
    setFiledDataDropDown(!filedDataDropDown);
  };

  const ToggleDrawer = () => {
    setOpen(!open);
  };

  const handleDrawerContent = (text) => {
    if (text == "Documentation") {
      var newContent = <Documentation />;
    } else if (text == "Tools") {
      var newContent = <Tools />;
    } else if (text == "FAQs") {
      var newContent = <FAQs />;
    } else if (text == "Contact") {
      var newContent = <Contact />;
    } else if (text == "Home") {
      var newContent = <WelcomePage />;
    } else if (text == "VisPheno") {
      var newContent = <Analysis tool={"VisPheno"} />;
    } else if (text == "GWAS") {
      var newContent = <Analysis tool={"GWAS"} />;
    } else if (text == "MDS") {
      var newContent = <Analysis tool={"MDS"} />;
    } else if (text == "PCA") {
      var newContent = <Analysis tool={"PCA"} />;
    } else if (text == "VisPheno") {
      var newContent = <Analysis tool={"VisPheno"} />;
    } else if (text == "Germplasm") {
      var newContent = <Analysis tool={"GeoLocator"} />;
      setAppBarTitle(
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {" "}
          Find Geographic origin of the Germplasm used in the project{" "}
        </Typography>
      );
    } else if (text == "Select Dataset") {
      var newContent = <DataSetMaker />;
      setAppBarTitle(
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {" "}
          Select Dataset{" "}
        </Typography>
      );
    } else if (text == "Downloads") {
      var newContent = <Downloads />;
      setAppBarTitle(
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {" "}
          Downloads{" "}
        </Typography>
      );
    }
    setContent(newContent);
  };

  const handleAppBarTitle = (text) => {
    if (text == "Documentation") {
      var newAppBarTitle = (
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {" "}
          Documentation{" "}
        </Typography>
      );
    } else if (text == "Tools") {
      var newAppBarTitle = (
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {" "}
          Tools{" "}
        </Typography>
      );
    } else if (text == "FAQs") {
      var newAppBarTitle = (
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {" "}
          FAQs{" "}
        </Typography>
      );
    } else if (text == "Contacts") {
      var newAppBarTitle = (
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {" "}
          Contacts{" "}
        </Typography>
      );
    } else if (text == "Home") {
      var newAppBarTitle = (
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {" "}
          UNTWIST KNOWLEDGE HUB{" "}
        </Typography>
      );
    } else if (text == "GWAS") {
      var newAppBarTitle = (
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {" "}
          Genomics : GWAS Analyis Tool{" "}
        </Typography>
      );
    } else if (text == "MDS") {
      var newAppBarTitle = (
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {" "}
          Genomics : MDS Analyis Tool{" "}
        </Typography>
      );
    } else if (text == "PCA") {
      var newAppBarTitle = (
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {" "}
          Genomics : PCA Analyis Tool{" "}
        </Typography>
      );
    } else if (text == "VisPheno") {
      var newAppBarTitle = (
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {" "}
          Genomics : Phenotypic data visulaization Tool{" "}
        </Typography>
      );
    } else if (text == "Germplasm") {
      var newAppBarTitle = (
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {" "}
          Find Geographic origin of the Germplasm used in the project{" "}
        </Typography>
      );
    }

    setAppBarTitle(newAppBarTitle);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open} color="default" enableColorOnDark>
          <Toolbar>
            <MenuIcon sx={{ marginRight: 2 }} onClick={ToggleDrawer} />

            {appBarTitle}
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <DrawerHeader></DrawerHeader>

          <Divider />

          <div>
            <List sx={{ marginLeft: 1 }}>
              <ListItemButton
                onClick={() => {
                  handleDrawerContent("Home");
                  handleAppBarTitle("Home");
                }}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </List>

            {/* <List sx={{ marginLeft: 1 }}>
              <ListItemButton
                onClick={() => {
                  handleDrawerContent("Select Dataset");
                }}
              >
                <ListItemIcon>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText primary="Select Dataset" />
              </ListItemButton>
            </List> */}

            <List sx={{ marginLeft: 1 }}>
              <ListItemButton
                onClick={() => {
                  if (selectedSpp === "") {
                    setContent(<DataSetMaker />);
                  } else {
                    handleFieldData();
                  }
                }}
              >
                <ListItemIcon>
                  <ForestIcon />
                </ListItemIcon>
                <ListItemText primary="Field Data" />
                {filedDataDropDown ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </List>

            <Collapse in={filedDataDropDown} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem>
                  <ListItemButton
                    onClick={() => {
                      handleDrawerContent("Germplasm");
                    }}
                  >
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary="Germplasm" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>

            <List sx={{ marginLeft: 1 }}>
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
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Genomics" />
                {genomicsDropDown ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </List>

            <Collapse in={genomicsDropDown} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem>
                  <ListItemButton
                    onClick={() => {
                      handleDrawerContent("VisPheno");
                      handleAppBarTitle("VisPheno");
                    }}
                  >
                    <ListItemIcon>{/* <StarBorder /> */}</ListItemIcon>
                    <ListItemText primary="VisPheno" />
                  </ListItemButton>
                </ListItem>

                <ListItem>
                  <ListItemButton
                    onClick={() => {
                      handleDrawerContent("GWAS");
                      handleAppBarTitle("GWAS");
                    }}
                  >
                    <ListItemIcon>{/* <StarBorder /> */}</ListItemIcon>
                    <ListItemText primary="GWAS" />
                  </ListItemButton>
                </ListItem>

                <ListItem>
                  <ListItemButton
                    onClick={() => {
                      handleDrawerContent("PCA");
                      handleAppBarTitle("PCA");
                    }}
                  >
                    <ListItemIcon>{/* <StarBorder /> */}</ListItemIcon>
                    <ListItemText primary="PCA" />
                  </ListItemButton>
                </ListItem>

                <ListItem>
                  <ListItemButton
                    onClick={() => {
                      handleDrawerContent("MDS");
                      handleAppBarTitle("MDS");
                    }}
                  >
                    <ListItemIcon>{/* <StarBorder /> */}</ListItemIcon>
                    <ListItemText primary="MDS" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>

            <List sx={{ marginLeft: 1 }}>
              <ListItemButton onClick={() => handleDrawerContent("Downloads")}>
                <ListItemIcon>
                  <DownloadIcon />
                </ListItemIcon>
                <ListItemText primary="Downloads" />
              </ListItemButton>

              <ListItemButton
                onClick={() => {
                  handleDrawerContent("FAQs");
                  handleAppBarTitle("FAQs");
                }}
              >
                <ListItemIcon>
                  <QuizIcon />
                </ListItemIcon>
                <ListItemText primary="FAQs" />
              </ListItemButton>

              <ListItemButton
                onClick={() => {
                  handleDrawerContent("Contacts");
                  handleAppBarTitle("Contacts");
                }}
              >
                <ListItemIcon>
                  <PermContactCalendarIcon />
                </ListItemIcon>
                <ListItemText primary="Contacts" />
              </ListItemButton>
            </List>
          </div>
        </Drawer>
        <UserContext.Provider value={{ content, setContent }}>
          <Box sx={{ ml: 2 }}>
            <DrawerHeader />
            {content}
          </Box>
        </UserContext.Provider>
      </Box>
    </>
  );
}
