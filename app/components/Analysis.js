"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { Autocomplete, List, ListItem, TextField } from "@mui/material";
import { Button } from "@mui/material";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";

import { useSelectedSpecies } from "../../contexts/SelectedSpeciesContext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { useRef } from "react";
import Papa from "papaparse";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { ListItemIcon, ListItemText } from "@mui/material";

import PlotlyPlots from "./PlotlyPlots2";
import MenuItem from "@mui/material/MenuItem";
import { FormControl, InputLabel, Select } from "@mui/material";

import ManhattanPlot from "../components/ManhattanPlot";
import TableComponent from "../components/SimpleTableComponent";

import GeoLocator from "./GeoLocator";

import MessageWithTimer from "./MessageDisplay";
import ConsoleLogCaptureWrapper from "./ConsoleLogCaptureWrapper";

import initSqlJs from "/public/wasm/sql-wasm.js";

import cropData from "/public/cropLocations.json";
import { useTokenContext } from "../../contexts/TokenContext";
import { useApiContext } from "../../contexts/ApiEndPoint";
import { useObjListContext } from "../../contexts/ObjListContext";

import capturedLogs from "./capturedLogs"; // Replace with the actual path to your module

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

export function Analysis(props) {
  const apiEndpoint = useApiContext().apiEndpoint;

  var tool = props.tool;
  const { selectedSpp, setSelectedSpp } = useSelectedSpecies();
  const [waitMsg, setWaitMsg] = useState("");
  var chosenProject = dbID[selectedSpp];

  const [chosenFile, setChosenFile] = React.useState("");
  const [inputFiles, setInputFiles] = React.useState([]);

  // local data
  const inputFile = useRef(null);
  const [data, setData] = useState([]);

  //  GWAS tool
  const [plinkResults, setPlinkResults] = useState([]);
  const [isToggledManhattan, setPlotIsToggledManhattan] = useState(false);
  const [mdsData, setMdsData] = useState(null);
  const [pcaData, setPCAData] = useState(null);
  const [qqData, setQqData] = useState(null);
  const [plinkSigSNPs, setPlinkSigSNPs] = useState([]);
  // const [manhattanData, setManhattanData] = useState(null)
  const [plinkLogs, setPlinkLogs] = useState([]);
  const [mdsLogs, setMdsLogs] = useState([]);

  const [plinkGenes, setPlinkGenes] = useState([]);
  const [mapManData, setMapManData] = useState([]);

  const [pValThreshold, setPValThreshold] = useState("5*10\u207B\u2078");
  const [annotationsDone, setAnnotationsDone] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  // VisPehno
  const [selected_plot_type, setSelectedPlotType] = useState("");
  const [col_names, setColNames] = useState([]);
  const [selectedXvar, setSelectedXvar] = useState("");
  const [selectedYvar, setSelectedYvar] = useState("");
  const [open, setOpen] = useState(false);
  const [isToggled, setPlotIsToggled] = useState(false);
  const [plotSchema, setPlotSchema] = useState({});
  const [isNewSchema, setIsNewSchema] = useState(0);
  const [filteredData, setFilteredData] = useState([]);

  const [plotTitle, setPlotTitle] = useState("");
  const [xLable, setXlable] = useState("");
  const [yLable, setYlable] = useState("");
  const [isMultiTrace, setIsMultiTrace] = useState(false);
  const [state, setState] = useState({});

  const [displayMessage, setDisplayMessage] = useState([]);
  const [showDisplayMessage, setShowDisplayMessage] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);

  const token = useTokenContext();
  const [phenoFile, setPhenoFile] = useState(null);

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
        alert("Error fetching token:", error);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [filters, setFilters] = useState([
    { key: "", comparison: "", value: "", logicalOperator: "" },
  ]);

  const handleParsePhenoData = () => {
    axios
      .post(
        `${apiEndpoint}/getBucketObjectData/?bucket_name=${dbID[selectedSpp]}&object_name=Pheno/${phenoFile}&token=${token.apiToken}`,
        null,
        {
          responseType: "text",
        }
      )
      .then((response) => {
        var text = response.data;
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          delimiter: "\t", // Specify the tab ('\t') as the delimiter
          complete: function (results) {
            const data = results.data;
            setData(data);
          },
          error: function (error) {
            console.error(error.message);
          },
        });
      });
  };

  useEffect(() => {
    handleParsePhenoData();
  }, [phenoFile]);

  // useEffect(() => {
  //   if (data) {
  //     var obj = data[0];
  //     var keys = Object.keys(obj || {});
  //     let colNames = []
  //     if(checked[3]){
  //       setColNames(keys);
  //     }
  //     // keys.map(colname => {

  //     // })
  //   }
  // }, [data]);

  function isSubsetOf(subset, array) {
    return subset.every((element) => array.includes(element));
  }

  function isSubsetOf(set, subset) {
    for (let i = 0; i < set.length; i++) {
      if (subset.indexOf(set[i]) == -1) {
        return false;
      }
    }
    return true;
  }

  function parseQassoc(fileContent, delimiter) {
    const rows = fileContent.split("\n");
    const header = rows
      .shift()
      .split(delimiter)
      .filter((value) => value !== "");
    const resultArray = [];

    rows.forEach((row) => {
      const columns = row.split(delimiter).filter((value) => value !== "");
      const obj = {};

      columns.forEach((column, index) => {
        const key = header[index];
        const value = column;
        obj[key] = value;
      });

      resultArray.push(obj);
    });

    return resultArray;
  }

  //   const [capturedLogs, setCapturedLogs]  = useState([]);

  //   useEffect(() => {
  // const originalConsoleLog = console.log;
  // var newLogs = []

  // console.log = (...args) => {
  //   newLogs.push(args);
  //   originalConsoleLog.apply(console, args);
  //   setCapturedLogs(newLogs)
  // };
  //   }, [displayMessage])

  const handleGWAS = (e, v) => {
    window.Plink().then((Module) => {
      var msgs = [];
      if (tool == "GWAS") {
        var fileNames = {
          "plink.fam": "Plink/" + chosenFile + ".fam",
          "plink.bim": "Plink/plink.bim",
          "plink.bed": "Plink/plink.bed",
          "plink.cov": "Plink/plink.cov",
        };
        msgs.push(`Running GWAS on ${chosenProject} dataset`);
        setDisplayMessage(msgs);
        setShowDisplayMessage(true);
        msgs.push(
          `Input loaded conducting analysis, depending upon the size of data set it will take a while, please do not close your browser`
        );
        setDisplayMessage(msgs);

        Object.keys(fileNames).map((fileName) => {
          let dbName = fileNames[fileName];
          axios
            .post(
              `${apiEndpoint}/getBucketObjectData/?bucket_name=${dbID[selectedSpp]}&object_name=${dbName}&token=${token.apiToken}`,
              {},
              { responseType: "arraybuffer" }
            )
            .then((response) => {
              const blob = new Blob([response.data], {
                type: "application/octet-stream",
              });
              const reader = new FileReader();
              reader.onload = () => {
                const fileContents = reader.result;
                Module.FS.createDataFile(
                  "/", // folder
                  fileName, // filename
                  fileContents, // content
                  true, // read
                  true // write
                );
                if (
                  isSubsetOf(
                    ["plink.bim", "plink.fam", "plink.bed", "plink.cov"],
                    Module.FS.readdir(".")
                  )
                ) {
                  if (v == "without") {
                    var msg =
                      "Running GWAS without correction for population structure";
                    var newDisplayMsg = displayMessage.push(msg);
                    setDisplayMessage(newDisplayMsg);

                    Module.callMain([
                      "--bfile",
                      "plink",
                      "--assoc",
                      "--allow-no-sex",
                    ]);
                  } else {
                    msgs.push(
                      "Running GWAS with correction for population structure"
                    );
                    setDisplayMessage(msgs);
                    Module.callMain([
                      "--bfile",
                      "plink",
                      "--linear",
                      "--covar",
                      "plink.cov",
                      "--covar-name",
                      "COV1,COV2",
                      "--allow-no-sex",
                      "--standard-beta",
                      "--hide-covar",
                      // a very hard lesson learned 'check your input data again and again'
                    ]);
                  }

                  msgs.push(`Analysis complete, parsing output`);
                  setDisplayMessage(msgs);
                  if (isSubsetOf(["plink.assoc"], Module.FS.readdir("."))) {
                    var string = new TextDecoder().decode(
                      Module.FS.readFile("/plink.assoc")
                    );
                  } else if (
                    isSubsetOf(["plink.qassoc"], Module.FS.readdir("."))
                  ) {
                    var string = new TextDecoder().decode(
                      Module.FS.readFile("/plink.qassoc")
                    );
                  } else if (
                    isSubsetOf(["plink.assoc.linear"], Module.FS.readdir("."))
                  ) {
                    var string = new TextDecoder().decode(
                      Module.FS.readFile("/plink.assoc.linear")
                    );
                  }
                  if (string != "") {
                    const multiArray = parseQassoc(string, " ");
                    var filteredArray = multiArray.filter(
                      (obj) => obj["P"] !== "NA"
                    );
                    setPlinkResults(filteredArray);
                    setPlotIsToggledManhattan(true);
                  } else {
                    alert("No significant results found");
                  }
                  Module.FS.readdir(".").map((fileName) => {
                    if (!fileName.search("plink")) {
                      Module.FS.unlink(fileName);
                      // console.log('Cleaning VFS: Removed', fileName)
                    }
                  });
                  msgs.push(`Creating Manhattan plot`);
                  setDisplayMessage(msgs);
                }
              };
              reader.readAsBinaryString(blob);
            });
        });
      } else if (tool == "MDS") {
        var msgs = [];
        var fileNames = {
          "plink.fam": "Plink/Straw_yield(g_per_plants)_INRAE.fam",
          "plink.bim": "Plink/plink.bim",
          "plink.bed": "Plink/plink.bed",
          "plink.genome": "Plink/plink.genome",
        };

        msgs.push(`Running MDS tool on ${chosenProject} dataset`);
        setDisplayMessage(msgs);
        setShowDisplayMessage(true);
        // console.log(`Running MDS tool on ${chosenProject} dataset`)

        msgs.push(
          `Analyzing, depending upon the size of data set it will take a while, please do not close your browser`
        );
        setDisplayMessage(msgs);

        Object.keys(fileNames).map((fileName) => {
          let dbName = fileNames[fileName];
          axios
            .post(
              `${apiEndpoint}/getBucketObjectData/?bucket_name=${dbID[selectedSpp]}&object_name=${dbName}&token=${token.apiToken}`,
              {},
              { responseType: "arraybuffer" }
            )
            .then((response) => {
              const blob = new Blob([response.data], {
                type: "application/octet-stream",
              });
              const reader = new FileReader();
              reader.onload = () => {
                const fileContents = reader.result;
                Module.FS.createDataFile(
                  "/",
                  fileName,
                  fileContents,
                  true,
                  true
                );
                if (
                  isSubsetOf(
                    ["plink.fam", "plink.bim", "plink.bed", "plink.genome"],
                    Module.FS.readdir(".")
                  )
                ) {
                  Module.callMain([
                    "--bfile",
                    "plink",
                    "--read-genome",
                    "plink.genome",
                    "--cluster",
                    "--ppc",
                    "0.0001",
                    "--mds-plot",
                    "2",
                  ]);

                  msgs.push(`Analysis complete, creating MDS plot`);
                  setDisplayMessage(msgs);
                  var string = new TextDecoder().decode(
                    Module.FS.readFile("/plink.mds")
                  );
                  const multiArray = parseQassoc(string, " ");
                  setMdsData(multiArray);
                  setDisplayMessage(msgs);
                }
              };
              reader.readAsBinaryString(blob);
            });
        });
      } else if (tool == "PCA") {
        var fileNames = {
          "precomputed.plink.cov.pca": "Plink/precomputed.plink.cov.pca",
        };
        msgs.push(`Running PCA tool on ${chosenProject} dataset`);
        setDisplayMessage(msgs);
        setShowDisplayMessage(true);
        msgs.push(`Precomputed PCA analysis is loaded`);
        Object.keys(fileNames).map((fileName) => {
          let dbName = fileNames[fileName];
          axios
            .post(
              `${apiEndpoint}/getBucketObjectData/?bucket_name=${dbID[selectedSpp]}&object_name=${dbName}&token=${token.apiToken}`,
              {},
              { responseType: "arraybuffer" }
            )
            .then((response) => {
              const blob = new Blob([response.data], {
                type: "application/octet-stream",
              });
              const reader = new FileReader();
              reader.onload = () => {
                const fileContents = reader.result;
                Module.FS.createDataFile(
                  "/",
                  fileName,
                  fileContents,
                  true,
                  true
                );
                if (
                  isSubsetOf(
                    ["precomputed.plink.cov.pca"],
                    Module.FS.readdir(".")
                  )
                ) {
                  msgs.push(`Analysis complete, creating PCA plot`);
                  setDisplayMessage(msgs);

                  var string = new TextDecoder().decode(
                    Module.FS.readFile("/precomputed.plink.cov.pca")
                  );
                  const multiArray = parseQassoc(string, " ");
                  setPCAData(multiArray);
                  msgs.push(`3. Creating PCA plot`);
                  setDisplayMessage(msgs);
                }
              };
              reader.readAsBinaryString(blob);
            });
        });
      }
    });
  };

  useEffect(() => {
    setShowDisplayMessage(false);
  }, [isToggledManhattan, pcaData, mdsData, plinkResults]);

  // post GWAS processing
  var getSigSNPs = (plinkResults, threshold) => {
    var sigSNPs = [];
    plinkResults.map((locus) => {
      if (locus.P < parseFloat(threshold)) {
        sigSNPs.push(locus.SNP);
      }
    });
    return sigSNPs;
  };

  const handleAnnotations = () => {
    var sigData = getSigSNPs(plinkResults, pVals[pValThreshold]);
    setPlinkSigSNPs(sigData);

    var dbFile = new URL("../../public/Annotations.db", import.meta.url);

    initSqlJs().then((SQL) => {
      fetch(dbFile)
        .then((response) => response.arrayBuffer())
        .then((data) => {
          const db = new SQL.Database(new Uint8Array(data));
          let annotations = [];
          // let mapManAnnotations = [];
          sigData.map((snpID) => {
            var chr = snpID.split("_")[0];
            var pos = parseInt(snpID.split("_")[1]);
            // console.log(chr, pos)
            // query 1kb region
            // const result = db.exec(`SELECT * FROM camelina WHERE start > ${pos - 1000} AND end < ${pos + 1000};`);
            //   const queryGffAnnotations = `SELECT * FROM camelina WHERE  seqid = ${chr} AND start < ${pos} AND end > ${pos};`;

            //   // const query = `
            //   //   SELECT c.*, m.*
            //   //   FROM camelina c
            //   //   JOIN camelinam4 m ON c.IDENTIFIER = m.IDENTIFIER
            //   //   WHERE c.seqid = ${chr} AND c.start < ${pos} AND c.end > ${pos}
            //   // `;

            //   const queryMapManAnnotations = `
            //   SELECT m.*, c.*
            //   FROM camelinam4 m
            //   JOIN camelina c ON c.IDENTIFIER = m.IDENTIFIER
            //   WHERE c.seqid = ${chr} AND c.start < ${pos} AND c.end > ${pos}
            // `;

            const joinedQuery = `SELECT c.*, 
          COALESCE(m.BINCODE, 'NA') AS BINCODE,
          COALESCE(m.NAME, 'NA') AS NAME,
          COALESCE(m.IDENTIFIER, 'NA') AS IDENTIFIER,
          COALESCE(m.DESCRIPTION, 'NA') AS DESCRIPTION,
          COALESCE(m.TYPE, 'NA') AS TYPE
          FROM camelina c
          LEFT JOIN camelinam4 m ON c.IDENTIFIER = m.IDENTIFIER
          WHERE c.seqid = ${chr} AND c.start < ${pos} AND c.end > ${pos};
          `;
            const result = db.exec(joinedQuery);
            result.map((res) => {
              res.values.map((record) => {
                var annot_data = {};
                annot_data["SNP ID"] = snpID;
                annot_data["Chr"] = record[0];
                annot_data["Position"] = snpID.split("_")[1];
                annot_data["REF"] = snpID.split("_")[2];
                annot_data["ALT"] = snpID.split("_")[3];
                annot_data["Source"] = record[1];
                annot_data["Type"] = record[2];
                annot_data["Start"] = record[3];
                annot_data["End"] = record[4];
                // annot_data['score'] = record[5];
                annot_data["Strand"] = record[6];
                // annot_data['Feature Phase'] = record[7];
                annot_data["ID"] = record[8];
                annot_data["Dbxref"] = record[9];
                // annot_data["mercator4v5_0"] = record[10];
                annot_data["NAME"] = record[12];
                annot_data["DESCRIPTION"] = record[11];
                // annot_data["IDENTIFIER"] = record[13]; //this is Mercator identifier field on which the join is performed
                annot_data["DESCRIPTION"] = record[14];
                // annot_data["TYPE"] = record[15];
                annotations.push(annot_data);
              });
            });
          });

          setPlinkGenes(annotations);
          setAnnotationsDone(true);
        })
        .catch((error) => {
          console.error("Error reading database file:", error);
        });
    });
  };

  const pVals = {
    // "5*10\u207B\u00B2": 5e-2, // 5*10^-2
    // "5*10\u207B\u00B3": 5e-3, // 5*10^-3
    "5*10\u207B\u2074": 5e-4, // 5*10^-4
    "5*10\u207B\u2075": 5e-5, // 5*10^-5
    "5*10\u207B\u2076": 5e-6, // 5*10^-6
    "5*10\u207B\u2077": 5e-7, // 5*10^-7
    "5*10\u207B\u2078": 5e-8, // 5*10^-8
  };

  var handleChangePval = (v) => {
    setPValThreshold(v);
  };

  useEffect(() => {
    handleAnnotations();
  }, [plinkResults, pValThreshold]);

  useEffect(() => {
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
        setAnnotationsDone(true);
      }
    };
  }, [plinkResults]);

  const handleStateChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const handleClose = () => {
    handlePLOT();
    setOpen(false);
  };

  useEffect(() => {
    if (
      selected_plot_type == "boxplot" ||
      selected_plot_type == "line" ||
      selected_plot_type == "violin" ||
      selected_plot_type == "raincloud" ||
      selected_plot_type == "heatMap" ||
      selected_plot_type == "density_overlay"
    ) {
      setIsMultiTrace(true);
      setOpen(true);
      var newState = {};
      setState(newState);
    } else {
      setIsMultiTrace(false);
    }
  }, [selected_plot_type]);

  useEffect(() => {
    handlePLOT();
  }, [
    selectedXvar,
    selectedYvar,
    selected_plot_type,
    plotTitle,
    xLable,
    yLable,
    isNewSchema,
    filteredData,
  ]);

  var handlePLOT = () => {
    var schema1 = {
      inputData: data,
      ploty_type: "",
      variablesToPlot: [],
      plotTitle: plotTitle,
      xLable: xLable,
      yLable: yLable,
    };
    if (selected_plot_type === "boxplot") {
      schema1.ploty_type = "boxplot";
      schema1.variablesToPlot = Object.keys(state);
    } else if (selected_plot_type === "violin") {
      schema1.ploty_type = "violin";
      schema1.variablesToPlot = Object.keys(state);
    } else if (selected_plot_type === "line") {
      schema1.ploty_type = "line";
      schema1.variablesToPlot = Object.keys(state);
    } else if (selected_plot_type === "raincloud") {
      schema1.ploty_type = "raincloud";
      schema1.variablesToPlot = Object.keys(state);
    } else if (selected_plot_type === "heatMap") {
      schema1.ploty_type = "heatMap";
      schema1.variablesToPlot = Object.keys(state);
    } else if (selected_plot_type === "density_overlay") {
      schema1.ploty_type = "density_overlay";
      schema1.variablesToPlot = Object.keys(state);
    } else {
      schema1.ploty_type = selected_plot_type;
      schema1.variablesToPlot = [selectedXvar, selectedYvar];
    }

    if (isNewSchema == 0) {
      setPlotSchema(schema1);
    } else {
      var changedSchema = schema1;
      changedSchema.inputData = filteredData;
      setPlotSchema(changedSchema);
    }
  };

  const handleAddFilter = () => {
    setFilters([
      ...filters,
      { key: "", comparison: "", value: "", logicalOperator: "AND" },
    ]);
    setFilteredData(filteredData);
  };

  const handleRemoveFilter = (index) => {
    setFilters((prevFilters) => prevFilters.filter((_, i) => i !== index));
    setFilteredData(filteredData);
  };

  const handleResetFilters = () => {
    setFilters([{ key: "", comparison: "", value: "", logicalOperator: "" }]);
    setFilteredData(data);
  };

  const applyFilters = () => {
    const filteredData = data.filter((item) => {
      return filters.every((filter) => {
        const { key, comparison, value, logicalOperator } = filter;
        if (!key || !comparison || !value) {
          return true;
        }

        const itemValue = item[key];
        switch (comparison) {
          case "=":
            return itemValue === value;
          case "!=":
            return itemValue !== value;
          case "<":
            return itemValue < value;
          case ">":
            return itemValue > value;
          case "<=":
            return itemValue <= value;
          case ">=":
            return itemValue >= value;
          default:
            return true;
        }
      });
    });
    setFilteredData(filteredData);
    setIsNewSchema(+1);
    // console.log(filteredData)
  };

  const autocompleteRef = useRef(null);

  //useEffect(() => {
  // setWaitMsg('')
  // setParseToggled(true)
  // setIspublic(true)
  //setIsMinioData(true)
  // setIsOwnData(false)
  // setValue('0')
  // setUrl('')
  // setToolsUsage('')
  // setChosenProject('')
  // setchosenDataType('')
  // setChosenFile('')
  // setInputFiles([])
  // setMinioGwasUrls({})
  // setPlinkFiles({})
  // setPublicDataSets([])
  // setPlinkResults([])
  // setPlotIsToggledManhattan(false)
  // setGwasOnPubData(false)
  // setMdsData(null)
  // setPCAData(null)
  // setLoading(false)
  // setPlinkSigSNPs([])
  // setPlinkGenes([])
  // setPValThreshold(5e-8)
  // setSNPsprocessed(true)
  // setAnnotationsDone(false)
  // setSelectedPlotType('')
  // setColNames([])
  // setSelectedXvar('')
  // setSelectedYvar('')
  // setOpen(false)
  // setPlotIsToggled(false)
  // setPlotSchema({})
  // setIsNewSchema(0)
  // setFilteredData([])
  // setPlotTitle('')
  // setXlable('')
  // setYlable('')
  // setIsMultiTrace(false)
  // setState({})
  // setAnnotations([])
  // setDisplayMessage([])
  // setShowDisplayMessage(false)
  // setConsoleLogs([]);
  //}, [tool])

  const [checked, setChecked] = useState([false, false, false, false]);

  // Handle checkbox toggle
  const handleToggle = (index) => () => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];

    var obj = data[0];
    var keys = Object.keys(obj || {});
    let colNames = [];
    colNames.push({ title: "Accessions", category: "Germplasm" });

    if (newChecked[3]) {
      keys.map((phenotype) => {
        if (
          !(
            phenotype.includes("under") ||
            phenotype.includes("Metabolite") ||
            phenotype.includes("Accession")
          )
        ) {
          colNames.push({ title: phenotype, category: "Field Phenotypes" });
        } else if (phenotype.includes("under")) {
          colNames.push({
            title: phenotype,
            category: "Greenhouse Phenotypes",
          });
        } else if (phenotype.includes("Metabolite")) {
          colNames.push({ title: phenotype, category: "Metabolites" });
        }
      });

      // Define the desired category order
      const categoryOrder = [
        "Germplasm",
        "Field Phenotypes",
        "Greenhouse Phenotypes",
        "Metabolites",
      ];

      // Group items by category and sort them according to the custom order
      const sortedOptions = colNames.sort((a, b) => {
        const categoryA = a.category;
        const categoryB = b.category;

        const indexA = categoryOrder.indexOf(categoryA);
        const indexB = categoryOrder.indexOf(categoryB);

        if (indexA < indexB) return -1;
        if (indexA > indexB) return 1;

        // If categories are the same, sort alphabetically by title
        return a.title.localeCompare(b.title);
      });

      setColNames(sortedOptions);
    } else {
      newChecked.map((state, index) => {
        if (state && index == 0) {
          keys.map((phenotype) => {
            if (
              !(
                phenotype.includes("under") ||
                phenotype.includes("Metabolite") ||
                phenotype.includes("Accession")
              )
            ) {
              colNames.push({ title: phenotype, category: "Field Phenotypes" });
            }
          });
          const sortedOptions = colNames.sort((a, b) => {
            if (a.category === "Germplasm") return -1;
            return 0;
          });
          setColNames(sortedOptions);
        } else if (state && index == 1) {
          keys.map((phenotype) => {
            if (phenotype.includes("under")) {
              colNames.push({
                title: phenotype,
                category: "Greenhouse Phenotypes",
              });
            }
          });
          const sortedOptions = colNames.sort((a, b) => {
            if (a.category === "Germplasm") return -1;
            return 0;
          });
          setColNames(sortedOptions);
        } else if (state && index == 2) {
          keys.map((phenotype) => {
            if (phenotype.includes("Metabolite")) {
              colNames.push({ title: phenotype, category: "Metabolites" });
            }
          });
          const sortedOptions = colNames.sort((a, b) => {
            if (a.category === "Germplasm") return -1;
            return 0;
          });
          setColNames(sortedOptions);
        }
      });
    }

    setChecked(newChecked);
  };

  const handleToggleAll = () => {
    const allChecked = checked.every((isChecked) => isChecked);
    const newChecked = allChecked
      ? [false, false, false, false]
      : checked.map(() => true);
    setChecked(newChecked);
  };

  const categoryOrder = [
    "Germplasm",
    "Field Phenotypes",
    "Greenhouse Phenotypes",
    "Metabolites",
  ];
  const [itemsByCategory, setItemsByCategory] = useState(null);

  useEffect(() => {
    let newItemsByCategory = {};
    col_names.forEach((item) => {
      if (!newItemsByCategory[item.category]) {
        newItemsByCategory[item.category] = [];
        newItemsByCategory[item.category].push(item.title);
      } else {
        newItemsByCategory[item.category].push(item.title);
      }
    });
    setItemsByCategory(newItemsByCategory);
  }, [checked]);

  return (
    <>
      {!showDisplayMessage || (
        <div>
          {/* <ConsoleLogCaptureWrapper customMessages={displayMessage} />  */}
          <MessageWithTimer messages={displayMessage} />
        </div>
      )}

      {tool != "GWAS" || (
        <Grid sx={{ marginTop: 2, marginBottom: 2, marginRight: 2 }}>
          <Typography sx={{ marginTop: 2, marginBottom: 2 }} variant="h4">
            Genome Wide Association Analyis
          </Typography>

          <Typography variant="p">
            {`This tool allows to perform GWAS analyses on the GWAS datasets available as part of untwist project. The pheotypes are can be selected from the following dropdown menu. The genotypic data consists of 3783751 SNP markers and is prefiltered for minor allele frequency (>= 0.05), Missingness per SNP ( < 0.1), quality score at SNP site ( >= 20) and a min depth ( >= 3). For details on the GWAS datasets please see FAQs`}
          </Typography>
        </Grid>
      )}

      {tool != "VisPheno" || (
        <Grid sx={{ marginTop: 2, marginRight: 2 }}>
          <Typography variant="h4">Visualize Traits</Typography>
          <Typography variant="p">
            {`This tool allows to visualize phenotypes collected as part of untwist project. Phenotypes are avaialable using the drop downs in the plotting Options menu. Users can also perform queries to filter the data based on any combination of phenotypes collected.
           `}
          </Typography>
          <Typography variant="p">
            <br></br>
            <b>Note: </b>In the drop down menu each entry describes{" "}
            <b>
              'Phenotype' _ 'measurement unit' _ 'Stress treatment(if any)' _
              'Growth stage/collection date(if available)' _ 'provider(if
              available)'
            </b>
          </Typography>
          <Typography variant="p">
            {" "}
            <br></br>
            <b>Abbreviations: </b>
            <b> DW: </b> dry weight,
            <b> FW: </b>fresh weight,
            <b> DW_FW: </b> DW/FW,
            <b> DAS: </b>days after sowing,
          </Typography>
        </Grid>
      )}
      {tool != "PCA" || (
        <Grid sx={{ marginTop: 2, marginBottom: 2, marginRight: 2 }}>
          <Typography variant="h4">Principal component Analyis</Typography>

          <Typography variant="p">
            {`This tool visualizes the precomputed PCA coordinates based on the same genotypic data available for GWAS analyisis.`}
          </Typography>
        </Grid>
      )}
      {tool != "MDS" || (
        <Grid sx={{ marginTop: 2, marginBottom: 2, marginRight: 2 }}>
          <Typography variant="h4">Multidimentional Scaling</Typography>

          <Typography variant="p">
            {`This tool computes and visualizes MDS coordinates based on the same genotypic data available for GWAS analyisis.`}
          </Typography>
        </Grid>
      )}

      {tool == "GeoLocator" || (
        <div>
          {tool == "MDS" || tool == "PCA" || tool == "VisPheno" || (
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
                  // defaultValue={''}
                  ref={autocompleteRef}
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
          )}
        </div>
      )}

      <div style={{ padding: 10 }}>
        {/* //////////////////////// Visualize phenotypes /////////////////////////////////////////// */}
        {tool != "VisPheno" || (
          <div>
            <Stack spacing={2}>
              <Item
                sx={{
                  marginTop: 0.5,
                  //  border: 1,
                  borderColor: "lightblue",
                }}
              >
                <Typography
                  sx={{ mt: 1, mb: 1 }}
                  variant="h7"
                  fontWeight="bold"
                >
                  Datasets
                </Typography>

                <div>
                  <Box display="flex" flexDirection="row">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked[0]}
                          onClick={handleToggle(0)}
                          disableRipple
                        />
                      }
                      label="Field phenotypes"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked[1]}
                          onClick={handleToggle(1)}
                          disableRipple
                        />
                      }
                      label="Greenhouse phenotypes"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked[2]}
                          onClick={handleToggle(2)}
                          disableRipple
                        />
                      }
                      label="Metabolites"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked[3]}
                          onClick={handleToggle(3)}
                          disableRipple
                        />
                      }
                      label="All"
                      onChange={handleToggleAll} // Add onChange event for the "All" checkbox
                    />
                  </Box>
                </div>
              </Item>
              <Grid container columnGap={2} columns={2}></Grid>
              {!checked.some((x) => x == true) || (
                <div>
                  <Item
                    sx={{
                      // marginTop: 0.5,
                      //  border: 1,
                      borderColor: "lightblue",
                    }}
                  >
                    <Typography
                      // sx={{ mt: 0, mb: 1 }}
                      variant="h7"
                      fontWeight="bold"
                    >
                      Plotting Options
                    </Typography>

                    <Grid
                      sx={{ mt: 1 }}
                      className="top-grid"
                      container
                      columns={2}
                      columnGap={2}
                    >
                      <Autocomplete
                        size="small"
                        options={[
                          "bar",
                          "line",
                          "histogram",
                          "density_overlay",

                          "boxplot",
                          "scatter",
                          "heatMap",
                          "linReg",
                          "violin",
                          "raincloud",
                        ]}
                        sx={{ width: 200 }}
                        renderInput={(params) => (
                          <TextField {...params} label="choose plot type" />
                        )}
                        onInputChange={(e, v) => setSelectedPlotType(v)}
                      />
                      {isMultiTrace ? (
                        ""
                      ) : (
                        <Grid className="top-grid" columns={2} columnGap={2}>
                          {selected_plot_type == "histogram" ? (
                            <Autocomplete
                              id="grouped-demo"
                              options={col_names}
                              groupBy={(col_names) => col_names.category}
                              getOptionLabel={(col_names) => col_names.title}
                              sx={{ width: 455 }}
                              size="small"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="choose x-variable"
                                />
                              )}
                              renderGroup={(params) => (
                                <li key={params.key}>
                                  <strong>{params.group}</strong>
                                  <ul>{params.children}</ul>
                                </li>
                              )}
                              onInputChange={(e) =>
                                setSelectedXvar(e.target.innerHTML)
                              }
                            />
                          ) : (
                            <Grid
                              // sx={{ marginTop: 2 }}
                              className="top-grid"
                              container
                              columns={2}
                              columnGap={2}
                            >
                              <Autocomplete
                                id="grouped-demo"
                                options={col_names}
                                groupBy={(col_names) => col_names.category}
                                getOptionLabel={(col_names) => col_names.title}
                                sx={{ width: 455 }}
                                size="small"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="choose x-variable"
                                  />
                                )}
                                renderGroup={(params) => (
                                  <li key={params.key}>
                                    <strong style={{ color: "green" }}>
                                      {params.group}
                                    </strong>
                                    <ul>{params.children}</ul>
                                  </li>
                                )}
                                onInputChange={(e) =>
                                  setSelectedXvar(e.target.innerHTML)
                                }
                              />

                              <Autocomplete
                                id="grouped-demo"
                                options={col_names}
                                groupBy={(col_names) => col_names.category}
                                getOptionLabel={(col_names) => col_names.title}
                                sx={{ width: 455 }}
                                size="small"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="choose y-variable"
                                  />
                                )}
                                renderGroup={(params) => (
                                  <li key={params.key}>
                                    <strong style={{ color: "green" }}>
                                      {params.group}
                                    </strong>
                                    <ul>{params.children}</ul>
                                  </li>
                                )}
                                onInputChange={(e) =>
                                  setSelectedYvar(e.target.innerHTML)
                                }
                              />
                            </Grid>
                          )}
                        </Grid>
                      )}
                      <Grid
                        sx={{ marginTop: 2 }}
                        className="top-grid"
                        container
                        columns={3}
                        columnGap={2}
                      >
                        <TextField
                          size="small"
                          sx={{ width: 345 }}
                          onChange={(e) => {
                            setPlotTitle(e.target.value);
                          }}
                          label="Update  plot title (optional)"
                        ></TextField>
                        <TextField
                          size="small"
                          sx={{ width: 345 }}
                          onChange={(e) => {
                            setXlable(e.target.value);
                          }}
                          label="Update  x label (optional)"
                        ></TextField>
                        <TextField
                          size="small"
                          sx={{ width: 345 }}
                          onChange={(e) => {
                            setYlable(e.target.value);
                          }}
                          label="Update  y label (optional)"
                        ></TextField>

                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setPlotIsToggled(true);
                          }}
                        >
                          Plot
                        </Button>
                      </Grid>
                    </Grid>
                  </Item>
                  <Item
                    sx={{
                      marginTop: 0.5,
                      // border: 1,
                      borderColor: "lightblue",
                    }}
                  >
                    <Typography variant="h7" fontWeight="bold">
                      Apply Filters (optional)
                    </Typography>

                    <Grid container spacing={1} sx={{ marginTop: 0.5 }}>
                      {filters.map((filter, index) => (
                        <React.Fragment key={index}>
                          <Grid item>
<Autocomplete
                                id="grouped-demo"
                                options={col_names}
                                groupBy={(col_names) => col_names.category}
                                getOptionLabel={(col_names) => col_names.title}
                                sx={{ width: 455 }}
                                size="small"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="choose y-variable"
                                  />
                                )}
                                renderGroup={(params) => (
                                  <li key={params.key}>
                                    <strong style={{ color: "green" }}>
                                      {params.group}
                                    </strong>
                                    <ul>{params.children}</ul>
                                  </li>
                                )}
                                onChange={(event, newValue) => {

                                  setFilters((prevFilters) =>
                                    prevFilters.map((prevFilter, i) =>
                                      i === index
                                        ? { ...prevFilter, key: newValue.title }
                                        : prevFilter
                                    )
                                  );
                                }}
  
                              />


                          </Grid>

                          <Grid item>
                            <FormControl fullWidth>
                              <InputLabel size="small">Comparison</InputLabel>
                              <Select
                                size="small"
                                sx={{ width: 265 }}
                                value={filter.comparison}
                                onChange={(event) => {
                                  setFilters((prevFilters) =>
                                    prevFilters.map((prevFilter, i) =>
                                      i === index
                                        ? {
                                            ...prevFilter,
                                            comparison: event.target.value,
                                          }
                                        : prevFilter
                                    )
                                  );
                                }}
                              >
                                <MenuItem value="=">=</MenuItem>
                                <MenuItem value="!=">≠</MenuItem>
                                <MenuItem value="<">{"<"}</MenuItem>
                                <MenuItem value=">">{">"}</MenuItem>
                                <MenuItem value="<=">{"≤"}</MenuItem>
                                <MenuItem value=">=">{"≥"}</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item>
                            <TextField
                              size="small"
                              sx={{ width: 265 }}
                              value={filter.value}
                              onChange={(event) => {
                                setFilters((prevFilters) =>
                                  prevFilters.map((prevFilter, i) =>
                                    i === index
                                      ? {
                                          ...prevFilter,
                                          value: event.target.value,
                                        }
                                      : prevFilter
                                  )
                                );
                              }}
                              label="Comparison Value"
                              // fullWidth
                            />
                          </Grid>

                          <Grid item>
                            {index < filters.length - 1 && (
                              <FormControl>
                                <InputLabel sx={{ ml: 1, mr: 1 }} size="small">
                                  Logical Operator
                                </InputLabel>
                                <Select
                                  sx={{ width: 200 }}
                                  size="small"
                                  value={filter.logicalOperator}
                                  onChange={(event) => {
                                    setFilters((prevFilters) =>
                                      prevFilters.map((prevFilter, i) =>
                                        i === index
                                          ? {
                                              ...prevFilter,
                                              logicalOperator:
                                                event.target.value,
                                            }
                                          : prevFilter
                                      )
                                    );
                                  }}
                                >
                                  <MenuItem value="AND">AND</MenuItem>
                                  <MenuItem value="OR">OR</MenuItem>
                                </Select>
                              </FormControl>
                            )}

                            {index === filters.length - 1 && (
                              <Button
                                sx={{ ml: 1, mr: 1, height: 40 }}
                                size="large"
                                variant="outlined"
                                onClick={handleAddFilter}
                              >
                                Add Filter
                              </Button>
                            )}

                            {filters.length > 1 && (
                              <Button
                                sx={{ ml: 2, mr: 2 }}
                                size="small"
                                variant="outlined"
                                onClick={() => handleRemoveFilter(index)}
                              >
                                Remove Filter
                              </Button>
                            )}
                          </Grid>
                        </React.Fragment>
                      ))}

                      <Grid
                        sx={{ mt: 1, mr: 2, ml: 0 }}
                        container
                        xs={12}
                        justifyContent="left"
                      >
                        <Button
                          sx={{ ml: 1, mr: 1 }}
                          size="small"
                          variant="outlined"
                          color="secondary"
                          onClick={handleResetFilters}
                          // fullWidth
                        >
                          Reset Filters
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={applyFilters}
                          // fullWidth
                        >
                          Apply Filters
                        </Button>
                      </Grid>
                    </Grid>
                  </Item>
                </div>
              )}

              {!isToggled || (
                <Item
                  sx={{ marginTop: 4, border: 1, borderColor: "lightblue" }}
                >
                  <PlotlyPlots plotSchema={plotSchema} />
                </Item>
              )}
            </Stack>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
  <DialogTitle>Select variables</DialogTitle>
  <DialogContent>
    <div>
      {categoryOrder
        .filter((category) => itemsByCategory !== null && itemsByCategory[category])
        .map((category) => (
          <div key={category}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginBottom: 2 }}
              color="green"
            >
              {category}
            </Typography>
            <FormGroup
              variant="standard"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row", 
                justifyContent: "flex-start", 
              }}
            >
              {itemsByCategory !== null &&
                itemsByCategory[category]?.map((item) => (
                  <div
                    key={item}
                    style={{ width: "480px", marginRight: "16px" }}
                  >
                    {/* Adjust the width as needed */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleStateChange}
                          name={item}
                        />
                      }
                      label={item}
                    />
                  </div>
                ))}
            </FormGroup>
          </div>
        ))}
    </div>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      OK
    </Button>
  </DialogActions>
</Dialog>


          </div>
        )}

        {/* /////////////////////////// GWAS ////////////////////////////////////////////////////////////// */}

        {tool != "GWAS" || (
          <div>
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
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={(e) => {
                  if (chosenProject && chosenFile) {
                    handleGWAS(e, "without");
                  } else {
                    alert("Please choose genotypic and phenotypic datasets");
                  }
                }}
                sx={{ width: 240, mr: 2 }}
              >
                Single Marker GWAS
              </Button>
              <Button
                sx={{ width: 300 }}
                variant="contained"
                color="secondary"
                size="large"
                onClick={(e) => {
                  if (chosenProject && chosenFile) {
                    handleGWAS(e, "with");
                  } else {
                    alert("Please choose genotypic and phenotypic datasets");
                  }
                }}
              >
                Population-Corrected GWAS
              </Button>
            </Grid>

            {!isToggledManhattan || (
              <div>
                <Typography sx={{ ml: 1, mt: 1 }} variant="h5">
                  {" "}
                  Results
                </Typography>

                <Tabs value={tabValue} onChange={handleChange}>
                  <Tab label="Manhattan Plot" {...a11yProps(0)} />
                  <Tab label="QQ PLOT" {...a11yProps(1)} />
                  <Tab label="Annotations" {...a11yProps(2)} />
                  {/* <Tab label="Functional Gene Annotations" {...a11yProps(3)} /> */}
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                  {/* <Plot data={manhattanData.data} layout={manhattanData.layout} /> */}
                  <ManhattanPlot inputArray={plinkResults} />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  {/* <Plot data={qqData.data} layout={qqData.layout} /> */}

                  <PlotlyPlots
                    plotSchema={{
                      ploty_type: "qqplot",
                      inputData: qqData,
                      variablesToPlot: ["expectedQuantiles", "sortedPValues"],
                      plotTitle: "QQ Plot",
                      xLable: "Expected Quantiles",
                      yLable: "Observed p-values",
                    }}
                  />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  <Grid
                    container
                    direction="column"
                    justifyContent="space-evenly"
                    alignItems="stretch"
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
                    {/* <Button
                      sx={{ marginTop: 5 }}
                      variant="contained"
                      size="large"
                      onClick={handleAnnotations}
                    >
                      Annotate
                    </Button> */}

                    <Autocomplete
                      defaultValue={"5*10\u207B\u2078"}
                      options={Object.keys(pVals)}
                      // sx={{ width: 200}}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Pvalue Threshold"
                        />
                      )}
                      onChange={(e, v) => {
                        handleChangePval(v);
                      }}
                    />
                  </Grid>
                  {!annotationsDone || (
                    <div>
                      <TableComponent sx={{ marginTop: 2 }} data={plinkGenes} />
                    </div>
                  )}
                </TabPanel>
              </div>
            )}
          </div>
        )}

        {/* /////////////////////////// MDS ////////////////////////////////////////////////////////////////// */}
        {tool != "MDS" || (
          <div padding={2}>
            <Button
              sx={{ marginLeft: 1 }}
              variant="contained"
              onClick={handleGWAS}
              color="primary"
            >
              perform MDS
            </Button>

            {!mdsData || (
              <div>
                <PlotlyPlots
                  plotSchema={{
                    ploty_type: "mds",
                    inputData: mdsData,
                    variablesToPlot: ["C1", "C2"],
                    plotTitle: "Multidimentional Scaling",
                    xLable: "MDS Coordinate 1",
                    yLable: "MDS Coordinate 2",
                  }}
                />

                {/* <div>
<Typography sx={{mt:4, marginBottom:4}} variant="h6"> Plink Logs</Typography>
{mdsLogs.map((item, index) => {
  if (!item[0].includes('rebuilding')) {
    return <div key={index}>{item[0]}</div>;
  }
  return null; // If the condition is not met, return null to exclude the item
})}
</div> */}
              </div>
            )}
          </div>
        )}

        {tool != "PCA" || (
          <div padding={2}>
            <Button
              sx={{ marginLeft: 1 }}
              variant="contained"
              onClick={handleGWAS}
              color="primary"
            >
              PCA plot
            </Button>

            {!pcaData || (
              <div>
                <PlotlyPlots
                  plotSchema={{
                    ploty_type: "pca",
                    inputData: pcaData,
                    variablesToPlot: ["COV1", "COV2"],
                    plotTitle: "Principle Component Analysis",
                    xLable: "PC1",
                    yLable: "PC2",
                  }}
                />
              </div>
            )}
          </div>
        )}

        {tool != "GeoLocator" || <GeoLocator data={cropData} />}
      </div>
    </>
  );
}
