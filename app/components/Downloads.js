import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import { TextField } from "@mui/material";
import axios from "axios";
import { useTokenContext } from "../../contexts/TokenContext";
import { saveAs } from "file-saver";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";

const apiEndpoint = "http://134.94.65.182:5000";

export default function Downloads() {
  const token = useTokenContext();
  const [selectedDtype, setSelectedDtype] = useState(null);
  const [selectedSpp, setSelectedSpp] = useState(null);
  const [itemList, setItemList] = useState(null);

  const [dTypes, setDTypes] = useState([]);
  const [objList, setObjList] = useState(null);
  const [spps, setSpps] = useState(null);

  useEffect(() => {
    axios
      .post(`${apiEndpoint}/getBucketObjectList/?token=${token.apiToken}`)
      .then((response) => {
        let data = response.data;
        setObjList(data);
        setSpps(Object.keys(data));
      });
  }, []);

  const [showPageComponent, setShowPageComponent] = useState(false);

  const handleDtypes = (value) => {
    setSelectedSpp(value.toLowerCase());
    let dtypes = Object.keys(objList[value.toLowerCase()]);
    setDTypes(dtypes);
  };

  const handleSecondDropdownClick = (v) => {
    setShowPageComponent(true);
    setSelectedDtype(dTypeOptions[v]);

    var newItemList = [];
    console.log();

    objList[selectedSpp][dTypeOptions[v]].map((item) => {
      if (item != "") {
        newItemList.push({
          name: item,
          // size: '10 MB',
          downloadLink: `${apiEndpoint}/getBucketObjectData/?bucket_name=${selectedSpp}&object_name=${v}/${item}&token=${token.apiToken}`,
        });
      }
    });

    setItemList(newItemList);
  };

  const handleDownloadClick = (item) => {
    axios
      .post(item.downloadLink, {}, { responseType: "blob" })
      .then((response) => {
        const filename = item.name;

        saveAs(response.data, filename);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #ddd",
  };

  const thStyle = {
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f2f2f2",
  };

  const tdStyle = {
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  };

  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  };

  const dTypeOptions = {
    "DNA methylation data (fastq)" : "DNAmeth",
    "DNA sequencing data (fastq)" : "DNAseq",
    "RNA sequencing data (fastq)" : "RNAseq",
    "Project information" : "Meta",
    "GWAS datasets (plink binary format)" : "Plink",
    "Phenotypic data (tsv)" : "Pheno",
    "Long Read Genomes Assemblies (fasta)" : "LongReadAssemblies",
    "Short Read Genomes Assemblies (fasta)" : "ShortReadAssemblies",
    "Marker data (vcf)" : "VCFdata",
    "Analysis Protocols" : "Analysis",
  }

  const dTypeLabels = {
    DNAmeth: "Raw DNA methylation data for individual accessions",
    DNAseq: "Raw DNA sequencing data for individual accessions",
    RNAseq: "Raw RNA sequencing data for individual accessions",
    Meta: "Project information",
    Plink: "GWAS datasets in plink format",
    Pheno: "Phenotypic datasets collected during the project",
    LongReadAssemblies: "Genomes Assembled with Oxford-nanopore technology",
    ShortReadAssemblies:
      "Genomes Assembled with short read Illumina technology",
    VCFdata:
      "Raw marker data based on DNA sequencing data for individual accessions",
    Analysis: "Protocols for analysis of untwist data",
  };

  return (
    <div>
      <Typography sx={{ mt: 2, ml: 1, marginBottom: 2 }} variant="h5">
        Downloads{" "}
      </Typography>

      <Grid
        container
        sx={{ mt: 2, ml: 0, marginBottom: 2 }}
        columnGap={1}
        spacing={2}
      >
        <Autocomplete
          size="small"
          sx={{ ml: 1, width: 350 }}
          options={spps}
          onChange={(event, value) => handleDtypes(value)}
          renderInput={(params) => (
            <TextField {...params} label="Select a Project" />
          )}
        />

        <Autocomplete
          size="small"
          sx={{ width: 350 }}
          options={Object.keys(dTypeOptions)}
          onChange={(e, v) => {
            handleSecondDropdownClick(v);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select a data type" />
          )}
        />
      </Grid>
      {showPageComponent && (
        <Paper style={{ marginTop: "20px", padding: "10px" }}>
          <Typography variant="h6">{dTypeLabels[selectedDtype]}</Typography>

          <div>
            <TableContainer>
              <Table style={tableStyle}>
                <TableHead>
                  <TableRow>
                    <TableCell style={thStyle}>File Name</TableCell>
                    <TableCell style={thStyle}>Download Link</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemList.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell style={tdStyle}>{item.name}</TableCell>
                      <TableCell style={tdStyle}>
                        <Button
                          variant="outlined"
                          size="small"
                          // style={buttonStyle}
                          onClick={() => handleDownloadClick(item)}
                        >
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Paper>
      )}
    </div>
  );
}
