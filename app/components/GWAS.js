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
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PlotlyPlots from "./PlotlyPlots2";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";
import TableComponent from "../components/SimpleTableComponent";
import MessageWithTimer from "./MessageDisplay";
import { useTokenContext } from "../../contexts/TokenContext";
import { useApiContext } from "../../contexts/ApiEndPoint";
import { useUntwistThemeContext } from "../../contexts/ThemeContext";
import { UntwistThemeProvider } from "../../contexts/ThemeContext";
import View from "./GenomeBrowser";
import { useAppDataContext } from "@/contexts/AppDataContext";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });


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


var dbID = {
  Camelina: "camelina",
  Brassica: "brassica",
};

export default function GWAS() {
  const apiEndpoint = useApiContext().apiEndpoint;
  const { isDarkMode, toggleTheme } = useUntwistThemeContext();
  const { selectedSpp, setSelectedSpp } = useSelectedSpecies();
  const {
    plinkResults,setPlinkResults,
    manhattanIsDone, setManhattanIsDone,
    manhattanPlotData, setManhattanPlotData,
    isGwasDone, setIsGwasDone,
    plinkGenes, setPlinkGenes,
    pValThreshold, setPValThreshold,
    annotationsDone, setAnnotationsDone,
    tabValue, setTabValue,
    updateAnnotations, setUpdateAnnotations,
    startGWAS, setStartGwas,
    qqData, setQqData,
    qqIsDone, setQQisDone,
    chosenFile, setChosenFile,
    inputFiles, setInputFiles,
  } = useAppDataContext();

  const [displayMessage, setDisplayMessage] = useState([]);
  const [showDisplayMessage, setShowDisplayMessage] = useState(false);
  const token = useTokenContext();
  const [phenoFile, setPhenoFile] = useState(null);
  const [gwasCorrectionOption, setGwasCorrectionOption] = useState(null);
  const [manplotChrClicked, setManplotChrClicked] = useState(null);
  const [gbPosition, setGbPosition] = useState(0);
  const [selectedAnnotationsWindowOption, setSelectedAnnotationsWindowOption] =
    useState("1kb");

  const handleGWAScorrection = (selectedOption) => {
    setGwasCorrectionOption(selectedOption);
  };

  const runGWAS = () => {
    setManhattanIsDone(false);
    setIsGwasDone(false)
    setStartGwas(true);
    setModalIsOpen(true);
  };

  const handlePointClick = (event) => {
    // Extract data from the clicked poin
    const chromosome = event.points[0].data.name.split("_")[1];
    const position = event.points[0].x;
    setManplotChrClicked(chromosome);
    setGbPosition(position);
  };

  useEffect(() => {
    if (gbPosition != 0) {
      setTabValue(3);
    }
  }, [gbPosition]);

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
        let phenoFile = response.data[dbID[selectedSpp]].Pheno[1];
        setPhenoFile(phenoFile);
      })
      .catch((error) => {
        alert("Error fetching getBucketObjectList from server", error);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

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
      const plinkWorker = new Worker("/plink-worker.js"); 
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

  useEffect(() => {
    if (updateAnnotations) {
      // axios
      // .post(
      //   `${apiEndpoint}/annotations`,
      //   {
      //     species: "camelina",
      //     snpID : '1_5543979_C_T',
      //     chromosome: 1,
      //     position: 5543979,
      //     winSize : 10000000,
      //     token: token.apiToken

      //   },
      //   { responseType: "application/json" }
      // )
      // .then((response) => {
      //   console.log(response.data);
      // })
      // .catch((error) => {
      //   console.error(error);
      // });

      const winSize = annotationsWindowOptions[selectedAnnotationsWindowOption];
      var sigData = getSigSNPs(plinkResults, pVals[pValThreshold]);
      var msgs = [];

      // if(sigData.length >= 1 ){
      //   // console.log('SNPs', sigData)
      //   axios
      //   .post(
      //     `${apiEndpoint}/annotateSNPlist`,
      //     {
      //       species: "camelina",
      //       snpList: sigData,
      //       winSize: winSize,
      //       token: token.apiToken,
      //     },
      //     { responseType: "application/json" }
      //   )
      //   .then((response) => {
      //     var plinkGenesupdated = JSON.parse(response.data);
      //     // console.log(plinkGenesupdated)
      //     if(plinkGenesupdated.length > 0){
      //       setAnnotationsDone(true)
      //       setPlinkGenes(plinkGenesupdated);

      //     }else{
      //       setAnnotationsDone(false)
      //       setPlinkGenes([]);
      //     }
      //   })
      //   .catch((error) => {
      //     alert('Error fetching Annotations', error);
      //   });
      // }else{
      //   setPlinkGenes([]);
      // }

      const sqlWorker = new Worker("/wasm/sql-worker.js"); // Adjust the path to your worker script
      sqlWorker.postMessage({
        cmd: "getAnnotations",
        sigData: sigData,
        winSize: winSize,
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
    }
    setUpdateAnnotations(false);
  }, [updateAnnotations]);



  useEffect(() => {
    setShowDisplayMessage(false);
  }, [isGwasDone]);

  // post GWAS processing
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
    "10\u207B\u2079": 9,  // 5*10^-9
    "10\u207B\u00B9\u2070": 10,  // 5*10^-10
    "10\u207B\u00B9\u00B9": 11,  // 5*10^-11
    "10\u207B\u00B9\u00B2": 12,  // 5*10^-12
    "10\u207B\u00B9\u00B3": 13,  // 5*10^-13
    "10\u207B\u00B9\u2074": 14,  // 5*10^-14
    "10\u207B\u00B9\u2075": 15   // 5*10^-15

  };

  var handleChangePval = (v) => {
    setPValThreshold(v);
  };

  const annotationsWindowOptions = {
    "1kb": 1000,
    "2kb": 2000,
    "5kb": 5000,
    "10kb": 10000,
    "0.5Mb": 500000,
    "1 Mb": 1000000,
    "2 Mb": 2000000,
  };

  const handleAnnotationsWindowOptions = (newVal) => {
    setSelectedAnnotationsWindowOption(newVal);
    // console.log('win size', newVal)
  };

  const handleUpdateAnnotations = () => {
    setUpdateAnnotations(true);
    // setAnnotationsDone(false);
  };

  useEffect(() => {
    setAnnotationsDone(true);
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

  useEffect(() => {
      // setManhattanIsDone(false);
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
        }
      };
  
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

        <div style={{ padding: 10 }}>
          <Grid
            container
            direction="row"
            // justifyContent="space-between"
            // alignItems="baseline"
            sx={{
              marginTop: 1,
              marginLeft: 1,
              mb: 2,

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
                onClick={() => {
                  if((gwasCorrectionOption !== null) && (chosenFile !== null)){
                    runGWAS()
                  }else{
                    alert('Please select a trait and a correction option')
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
                  <CircularProgress color="success" />
                  <CircularProgress color="inherit" />
                </Stack>
              ) : (
                <div>
                  <Typography sx={{ ml: 1, mt: 1 }} variant="h5">
                    Results
                  </Typography>

                  <Tabs value={tabValue} onChange={handleChange}>
                    <Tab label="Manhattan Plot" {...a11yProps(0)} />
                    <Tab label="QQ PLOT" {...a11yProps(1)} />
                    <Tab label="Annotations" {...a11yProps(2)} />
                    <Tab label="Genome View" {...a11yProps(3)} />
                  </Tabs>

                  <TabPanel value={tabValue} index={0}>
                    <Plot
                      data={manhattanPlotData.data}
                      layout={{
                        ...manhattanPlotData.layout,
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
                      }}
                      onClick={handlePointClick}
                    />
                  </TabPanel>

                  <TabPanel value={tabValue} index={1}>
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

                  <TabPanel value={tabValue} index={2}>
                    <Grid
                      container
                      gap={2}
                      sx={{
                        marginTop: 2,
                        marginBottom: 4,
                        // border: 1,
                        xs: 2,
                        md: 3,
                        borderColor: "lightblue",
                      }}
                    >
                      <Autocomplete
                        size="smalll"
                        sx={{ width: 200 }}
                        value={selectedAnnotationsWindowOption}
                        onChange={(event, newValue) =>
                          handleAnnotationsWindowOptions(newValue)
                        }
                        options={Object.keys(annotationsWindowOptions)}
                        renderInput={(params) => (
                          <TextField {...params} label="Set Flanking Region" />
                        )}
                      />

                      <Autocomplete
                        size="smalll"
                        defaultValue={pValThreshold}
                        options={Object.keys(pVals)}
                        sx={{ width: 200 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Pvalue Threshold"
                          />
                        )}
                        onChange={(e, v) => {
                          handleChangePval(v);
                          // setAnnotationsDone(!annotationsDone);
                        }}
                      />

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={handleUpdateAnnotations}
                      >
                        Update
                      </Button>
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
                        <CircularProgress color="success" />
                        <CircularProgress color="inherit" />
                      </Stack>
                    ) : (
                      <TableComponent sx={{ marginTop: 2 }} data={plinkGenes} />
                    )}
                  </TabPanel>

                  <TabPanel value={tabValue} index={3}>
                    <View
                      chromosome={manplotChrClicked}
                      position={gbPosition}
                    />
                  </TabPanel>
                </div>
              )}
            </div>
          )}
        </div>
      </UntwistThemeProvider>
    </>
  );
}
