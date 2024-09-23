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

"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { Autocomplete, TextField } from "@mui/material";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";

import { useSelectedSpecies } from "../../contexts/SelectedSpeciesContext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PlotlyPlots from "./PlotlyPlots2";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import TableComponent from "../components/SimpleTableComponent";

import MessageWithTimer from "./MessageDisplay";
import { useTokenContext } from "../../contexts/TokenContext";
import { useApiContext } from "../../contexts/ApiEndPoint";
import { useUntwistThemeContext } from "../../contexts/ThemeContext";
import { UntwistThemeProvider } from "../../contexts/ThemeContext";
import View from "./GenomeBrowser";


import { useAppDataContext } from "@/contexts/AppDataContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.primary,
}));

var dbID = {
  Camelina: "camelina",
  Brassica: "brassica",
};

export default function GWAS() {

  const apiEndpoint = useApiContext().apiEndpoint;
  const { isDarkMode, toggleTheme } = useUntwistThemeContext();
  const { selectedSpp, setSelectedSpp } = useSelectedSpecies();
  const {chosenFile, setChosenFile} = useAppDataContext();
  const {inputFiles, setInputFiles} = useAppDataContext();
  const {startGWAS, setStartGwas} = useAppDataContext();
  const {plinkResults, setPlinkResults} = useAppDataContext();
  const {isGwasDone, setIsGwasDone} = useAppDataContext();
  const {qqData, setQqData} = useAppDataContext();
  const {manhattanPlotData, setManhattanPlotData} = useAppDataContext();
  const {qqIsDone, setQQisDone} = useAppDataContext();
  const {manhattanIsDone, setManhattanIsDone} = useAppDataContext();
  const {plinkGenes, setPlinkGenes} = useAppDataContext();
  const {pValThreshold, setPValThreshold} = useAppDataContext();
  const {annotationsDone, setAnnotationsDone} = useAppDataContext();
  const {updateAnnotations, setUpdateAnnotations} = useAppDataContext();
  const {showGenomeView, setShowGenomeView} = useAppDataContext();
  const {gbPosition, setGbPosition} = useAppDataContext();
  const {selectedAnnotationsWindowOption, setSelectedAnnotationsWindowOption} = useAppDataContext();


  const [displayMessage, setDisplayMessage] = useState([]);
  const token = useTokenContext();
  const [gwasCorrectionOption, setGwasCorrectionOption] = useState(null);
  const [manplotChrClicked, setManplotChrClicked] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const {activeTab, setActiveTab} = useAppDataContext();


  const setDefaults = () => {
    // setPlinkResults([]);
    // setManhattanPlotData(null);
    setStartGwas(false);
    setIsGwasDone(false);
    // setQqData(null);
    setQQisDone(false);
    setManhattanIsDone(false);
    // setPlinkGenes([]);
    setPValThreshold("10\u207B\u2078");
    setAnnotationsDone(false);
    setActiveTab(0);
    setUpdateAnnotations(false);
    setShowGenomeView(false);
    setGbPosition(0);
    setSelectedAnnotationsWindowOption("1 kb");
  }



  const handleGWAScorrection = (selectedOption) => {
    setGwasCorrectionOption(selectedOption);
  };


  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue); // Update the active tab index when a tab is clicked
  };

  const changeTabDynamically = (newValue) => {
    setActiveTab(newValue);
  };


  const runGWAS = () => {
    setDefaults();
    setStartGwas(true);
    setModalIsOpen(true);
  };

  const handlePointClick = (event) => {
    // Extract data from the clicked poin
    const chromosome = event.points[0].data.name.split("_")[1];
    const position = event.points[0].x;
    setManplotChrClicked(chromosome);
    setGbPosition(position);
    setShowGenomeView(true);
    changeTabDynamically(3);
  };


  const handleAnnotationsWindowOptions = (newVal) => {
    setSelectedAnnotationsWindowOption(newVal);
  };

  const handleUpdateAnnotations = () => {
    setUpdateAnnotations(true);
  };


  var getSigSNPs = (plinkResults, threshold) => {
    var sigSNPs = [];
    plinkResults.map((locus) => {
      var pvalue = Math.abs(Math.log10(locus.P));
      if (pvalue >= parseFloat(threshold)) {
        sigSNPs.push(locus.SNP);
      }
    });
    return sigSNPs;
  };

  const pVals = {
    // "5*10\u207B\u00B2": 5e-2, // 5*10^-2
    // "5*10\u207B\u00B3": 5e-3, // 5*10^-3
    "10\u207B\u2074": 4, // 5*10^-4
    "10\u207B\u2075": 5, // 5*10^-5
    "10\u207B\u2076": 6, // 5*10^-6
    "10\u207B\u2077": 7, // 5*10^-7
    "10\u207B\u2078": 8, // 5*10^-8
    "10\u207B\u2079": 9, // 5*10^-9
    "10\u207B\u00B9\u2070": 10, // 5*10^-10
    "10\u207B\u00B9\u00B9": 11, // 5*10^-11
    "10\u207B\u00B9\u00B2": 12, // 5*10^-12
    "10\u207B\u00B9\u00B3": 13, // 5*10^-13
    "10\u207B\u00B9\u2074": 14, // 5*10^-14
    "10\u207B\u00B9\u2075": 15, // 5*10^-15
  };

  var handleChangePval = (v) => {
    setPValThreshold(v);
  };

  const annotationsWindowOptions = {
    "1 kb": 1000,
    "2 kb": 2000,
    "5 kb": 5000,
    "10 kb": 10000,
    "50 kb": 50000,
    "1 Mb": 1000000,
  };

  useEffect(() => {
    axios
      .post(`${apiEndpoint}/getBucketObjectList/?token=${token.apiToken}`)
      .then((response) => {
        let gwasFiles = [];
        let plinkFolder = response.data[dbID[selectedSpp]].Plink;
        plinkFolder.map((file) => {
          if (file.includes("fam")) {
            gwasFiles.push(file.split(".")[0]);
          }
        });
        setInputFiles(gwasFiles);
        // let phenoFile = response.data[dbID[selectedSpp]].Pheno[1];
        // setPhenoFile(phenoFile);
      })
      .catch((error) => {
        alert("Error fetching getBucketObjectList from server", error);
      });
  }, []);

  useEffect(() => {
    if (modalIsOpen) {
      const interval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [modalIsOpen]);

  useEffect(() => {
    if (startGWAS) {
      var msgs = [];
      const plinkWorker = new Worker("/plink-worker.js"); // Adjust the path to your worker script
      plinkWorker.postMessage({
        cmd: "runGWAS",
        token: token.apiToken,
        fam: chosenFile,
        spp: "camelina",
        correction: gwasCorrectionOption,
      });
      plinkWorker.onmessage = (e) => {
        if (e.data.cmd === "processed") {
          setPlinkResults(e.data.res);
          setIsGwasDone(true);
          setModalIsOpen(false);
          setTimeElapsed(0);
        } else if (e.data.cmd === "message") {
          msgs.push(e.data.res);
          setDisplayMessage(msgs);
        }
      };
    }

    setStartGwas(false);
    setTimeElapsed(0);
  }, [startGWAS]);

  // const handlePlinkResDownload = () => {
  //   // Prepare TSV data
  //   // console.log(plinkResults)
  //   const tsvData = [
  //     Object.keys(plinkResults[0]).join('\t'), // Header row
  //     ...plinkResults.map(item => Object.values(item).join('\t')) // Data rows
  //   ].join('\n');

  //   // Convert the TSV string to a Blob
  //   const blob = new Blob([tsvData], { type: 'text/tsv' });

  //   // Create a download link
  //   const downloadLink = document.createElement('a');
  //   downloadLink.href = URL.createObjectURL(blob);
  //   downloadLink.download = 'data.tsv';

  //   // Trigger the click event on the link to start the download
  //   downloadLink.click();
  // };

  useEffect(() => {
    if (updateAnnotations) {
      setAnnotationsDone(false);
      const winSize = annotationsWindowOptions[selectedAnnotationsWindowOption];
      var sigData = getSigSNPs(plinkResults, pVals[pValThreshold]);
      if(sigData.length > 0){
        var msgs = [];
        const sqlWorker = new Worker("/wasm/sql-worker.js"); 
        sqlWorker.postMessage({
          cmd: "getAnnotations",
          sigData: sigData,
          winSize: winSize,
          species : 'camelina',
          token : token.apiToken
        });
        sqlWorker.onmessage = (e) => {
          if (e.data.cmd === "processed") {
            setPlinkGenes(e.data.res);
            setAnnotationsDone(true);
          } else if (e.data.cmd === "message") {
            msgs.push(e.data.res);
            setDisplayMessage(msgs);
          }
        };
      }else{
        setPlinkGenes([]);
        setAnnotationsDone(true);

      }
      }



    setUpdateAnnotations(false);
  }, [updateAnnotations]);

  useEffect(() => {
    setUpdateAnnotations(false)
    handleUpdateAnnotations();
  }, [pValThreshold, selectedAnnotationsWindowOption]);

  useEffect(() => {
    // setAnnotationsDone(true);
    handleUpdateAnnotations();
  }, [plinkResults]);

  useEffect(() => {
    setQQisDone(false);
    const qqWorker = new Worker(
      new URL("../../public/workers/qqWorker.js", import.meta.url)
    );
    qqWorker.postMessage({
      cmd: "processQQplotData",
      plinkRes: plinkResults,
    });
    qqWorker.onmessage = (e) => {
      if (e.data.cmd === "processed") {
        setQqData(e.data.result);
        setQQisDone(true);
      }
    };
  }, [plinkResults]);

  // useEffect(() => {

  //   setManhattanIsDone(false);
  //   const manhattanWorker = new Worker(
  //     new URL("../../public/workers/ManhattanWorker.js", import.meta.url)
  //   );
  //   manhattanWorker.postMessage({
  //     cmd: "processManhattanPlotData",
  //     plinkRes: plinkResults,
  //     isDark: isDarkMode,
  //   });
  //   manhattanWorker.onmessage = (e) => {
  //     if (e.data.cmd === "processed") {
  //       setManhattanPlotData(e.data.result);
  //       setManhattanIsDone(true);
  //     }
  //   };

  // }, [plinkResults]);

  useEffect(() => {
      const manhattanWorker = new Worker(
        new URL("../../public/workers/ManhattanWorker.js", import.meta.url)
      );
      manhattanWorker.postMessage({
        cmd: "processManhattanPlotData",
        plinkRes: plinkResults,
        isDark: isDarkMode,
      });
      manhattanWorker.onmessage = (e) => {
        if (e.data.cmd === "processed") {
          setManhattanPlotData(e.data.result);
          setManhattanIsDone(true);
      };
    }
  }, [plinkResults]);

  return (
    <>
      <UntwistThemeProvider values={{ isDarkMode, toggleTheme }}>
        {!modalIsOpen || (
          <MessageWithTimer
            messages={displayMessage}
            timeElapsed={timeElapsed}
          />
        )}

        <Grid sx={{ ml: 2, marginTop: 2, marginBottom: 2, marginRight: 2 }}>
          <Typography sx={{ marginTop: 2, marginBottom: 2 }} variant="h4">
            Genome Wide Association Analysis
          </Typography>

          <Typography variant="p">
            {`This tool allows to perform GWAS analyses on the GWAS datasets available as part of untwist project. The pheotypes are can be selected from the following dropdown menu. The genotypic data consists of 3783751 SNP markers and is prefiltered for minor allele frequency (>= 0.05), Missingness per SNP ( < 0.1), quality score at SNP site ( >= 20) and a min depth ( >= 3). For details on the GWAS datasets please see FAQs`}
          </Typography>
        </Grid>

        <div>
          <Grid
            sx={{
              display: "flex",
              "& > :not(style)": {
                m: 0.5,
                color: "primary.main",
                padding: 0.1,
                marginLeft: 2,
              },
            }}
          >
            <Autocomplete
              size="small"
              defaultValue={chosenFile}
              // ref={autocompleteRef}
              options={inputFiles}
              sx={{ width: 558 }}
              renderInput={(params) => (
                <TextField {...params} label="Select a Trait" />
              )}
              onInputChange={(e, v) => {
                setChosenFile(v);
              }}
            />
          </Grid>
        </div>

        <div style={{ padding: 15 }}>
          <div>
            <Grid
              container
              direction="row"
              // justifyContent="space-between"
              // alignItems="baseline"
              sx={{
                marginTop: -2,
                marginLeft: 1,
                mb: 1,

                // border: 1,
                // xs: 2,
                // md: 3,
                // borderColor: "lightblue",
              }}
            >
              <div>
                <label>
                  <Checkbox
                    sx={{ ml: -1.5 }}
                    checked={gwasCorrectionOption === "without"}
                    onChange={() => handleGWAScorrection("without")}
                  />
                  Single Marker GWAS
                </label>
                <label>
                  <Checkbox
                    sx={{ ml: 3 }}
                    checked={gwasCorrectionOption === "with"}
                    onChange={() => handleGWAScorrection("with")}
                  />
                  Population corrected GWAS
                </label>
                <Button
                  size="small"
                  sx={{ ml: 3 }}
                  variant="contained"
                  onClick={
                    () => {
                      if(gwasCorrectionOption == null){
                        alert('Please select one of the check boxes')
                      }else if(chosenFile == ""){
                        alert("Please select a Phenotype")
                      }else{
                        runGWAS();
                      }
                    }}
                >
                  Run
                </Button>
              </div>
            </Grid>

            {!isGwasDone || (
              <div>
                {!manhattanIsDone ? (
                  <Stack
                    sx={{ mt: 5, ml: 5, color: "grey.500" }}
                    spacing={2}
                    direction="row"
                  >
                    <Typography variant="h4" color={"blue"}>
                      Computing Manhattan Plot ...
                    </Typography>
                    <CircularProgress color="secondary" />
                    {/* <CircularProgress color="success" />
                    <CircularProgress color="inherit" /> */}
                  </Stack>
                ) : (
                  <div>
                    <Typography sx={{ ml: 1, mt: 1 }} variant="h5">
                      Results
                    </Typography>

                    <Tabs value={activeTab} onChange={handleChangeTab}>

                      <Tab label="Manhattan Plot" {...a11yProps(0)} />
                      <Tab label="QQ PLOT" {...a11yProps(1)} />
                      <Tab label="Annotations" {...a11yProps(2)} />
                      <Tab label="Genome View" {...a11yProps(3)} />
                    </Tabs>
                    

{/* <Tabs value={activeTab} onChange={handleChangeTab}>
        <Tab label="Manhattan Plot" />
        <Tab label="QQ PLOT" />
        <Tab label="Annotations" />
        <Tab label="Genome View" />
      </Tabs> */}

                    <TabPanel value={activeTab} index={0}>
                      <Grid container direction="column" rowSpacing={1}>
                        <Grid item>
                          <Typography variant="h6" color={"green"}>
                            Options:
                          </Typography>
                        </Grid>

                        <Grid item>
                          <Typography variant="h7">
                            1. Hover over any point to get information on the
                            exact genomic coordinates of the corresponding SNP
                            and p-value
                          </Typography>
                        </Grid>

                        <Grid item>
                          <Typography variant="h7">
                            2. Clicking on the point (SNP) will navigates to the
                            corresponding genomic location in the Genome View,
                            showing a 1 kb flanking window
                          </Typography>
                        </Grid>
                      </Grid>

                      <Plot
                        data={manhattanPlotData.data}
                        layout={{
                          ...manhattanPlotData.layout,
                          title : `<b>${manhattanPlotData.layout.title.text}: ${chosenFile}</b>`,
                          plot_bgcolor: isDarkMode ? "#000000" : "#FFFFFF",
                          paper_bgcolor: isDarkMode ? "#000000" : "#FFFFFF",
                          font: {
                            color: isDarkMode ? "#FFFFFF" : "#000000", // Set default text color for the entire plot
                          },
                          xaxis: {
                            ...manhattanPlotData.layout.xaxis,
                            tickmode: "none",
                          },
                          yaxis: {
                            tickformat: "g",
                            tickfont: {
                              color: isDarkMode ? "#FFFFFF" : "#000000",
                            },
                            title: {
                              text: manhattanPlotData.layout.yaxis.title.text,
                              font: {
                                color: isDarkMode ? "#FFFFFF" : "#000000", // Set text color for axis label
                                // ... other font properties for the title
                              },
                            },
                          },
                          displaylogo: false,
                          displayModeBar: false,
                          displayModeBarButtonsToRemove: [
                            "lasso2d",
                            "select2d",
                          ],
                        }}
                        onClick={(e) => {handlePointClick(e)}}
                      />

                    </TabPanel>

                    <TabPanel value={activeTab} index={1}>
                      {!qqIsDone ? (
                        <Stack
                          sx={{ color: "grey.500" }}
                          spacing={2}
                          direction="row"
                        >
                          <CircularProgress color="secondary" />
                          <CircularProgress color="success" />
                          <CircularProgress color="inherit" />
                        </Stack>
                      ) : (
                        <PlotlyPlots
                          plotSchema={{
                            ploty_type: "qqplot",
                            inputData: qqData,
                            variablesToPlot: [
                              "expectedQuantiles",
                              "sortedPValues",
                            ],
                            plotTitle: "QQ Plot",
                            xLable: "Expected Quantiles",
                            yLable: "Observed p-values",
                            isDark: isDarkMode,
                          }}
                        />
                      )}
                    </TabPanel>

                    <TabPanel value={activeTab} index={2}>
                      <Grid
                        container
                        // direction="rows"
                        // justifyContent="space-evenly"
                        // alignItems="stretch"
                        gap={2}
                        sx={{
                          marginTop: -2,
                          marginBottom: 1,
                          // border: 1,
                          xs: 2,
                          md: 3,
                          borderColor: "lightblue",
                        }}
                      >
                        <Grid container direction="row" rowSpacing={1}>
                          <Grid item>
                            <Typography variant="h7" color={"green"}>
                              Description:{" "}
                            </Typography>

                            <Typography variant="h7">
                              This module facilitates the discovery of
                              significant SNPs and their functional annotations.
                              Users can specify a p-value threshold
                              (default=5x10<sup>-8</sup>), along with a flanking
                              window (default=1kb).
                            </Typography>
                          </Grid>

                          <Grid item>
                            <Typography variant="h7" color={"green"}>
                              Note:{" "}
                            </Typography>
                            <Typography variant="h7">
                              The results presented below pertain to the
                              Manhattan plot and exclusively display genes
                              associated with significant SNPs at user defined
                              threshold and window interval. It is important to
                              note that while a gene may be located proximate to
                              a SNP (which can still be visualized in the Genome
                              View), it will not be included in these findings
                              if the SNP does not fall within user defined
                              significance pvalue threshold and window size.{" "}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Autocomplete
                          size="smalll"
                          sx={{ width: 200, mt: 2 }}
                          value={selectedAnnotationsWindowOption}
                          onChange={(event, newValue) => {
                            handleAnnotationsWindowOptions(newValue);
                            setAnnotationsDone(false);
                          }}
                          options={Object.keys(annotationsWindowOptions)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Set Flanking Region"
                            />
                          )}
                        />

                        <Autocomplete
                          size="smalll"
                          defaultValue={pValThreshold}
                          options={Object.keys(pVals)}
                          sx={{ width: 200, mt: 2 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Pvalue Threshold"
                            />
                          )}
                          onChange={(e, v) => {
                            setAnnotationsDone(false);
                            handleChangePval(v);
                            // setAnnotationsDone(!annotationsDone);
                          }}
                        />
                      </Grid>


                      {!annotationsDone ? (
                        <Stack
                          sx={{ mt: 5, ml: 5, color: "grey.500" }}
                          spacing={2}
                          direction="row"
                        >
                          <Typography variant="h4" color={"blue"}>
                            Computing Annotations ...
                          </Typography>
                          <CircularProgress color="secondary" />
                          {/* <CircularProgress color="success" />
                          <CircularProgress color="inherit" /> */}
                        </Stack>
                      ) : (
                        <TableComponent sx={{ mt: 2 }} data={plinkGenes} />
                      )}
                    </TabPanel>

                    <TabPanel value={activeTab} index={3}>
                      {!showGenomeView ? (
                        <Typography variant="h7">
                          {" "}
                          Please select a locus from <b>MANHATTAN PLOT</b> by
                          clicking on a data point (SNP)
                        </Typography>
                      ) : (
                        <div>
                          <Typography sx={{ mb: 2 }}>
                            {" "}
                            <b>Note: </b>This window is based on the selected
                            SNP from Manhattan plot. The default range of the
                            view is set to 1 kb flanking region of the SNP
                            clicked from Manhattan plot. This means that
                            selected SNP is next to the middle dotted line seen
                            in this window. The size of the flanking range can
                            be set by clicking the zoom Button above or changing
                            the window size from ANNOTATIONS tab as well.
                          </Typography>

                          <View
                            chromosome={manplotChrClicked}
                            position={gbPosition}
                            window={
                              annotationsWindowOptions[
                                selectedAnnotationsWindowOption
                              ]
                            }
                          />
                        </div>
                      )}
                    </TabPanel>

                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </UntwistThemeProvider>
    </>
  );
}
