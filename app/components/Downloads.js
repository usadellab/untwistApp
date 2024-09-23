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

"use client"
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import { TextField } from "@mui/material";
import axios from "axios";
import { useTokenContext } from "@/contexts/TokenContext";
import { saveAs } from "file-saver";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { Box, Card, CardContent, Checkbox } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);



const apiEndpoint = "/api";

export default function Downloads() {
  const [selectedDtype, setSelectedDtype] = useState(null);
  const [selectedSpp, setSelectedSpp] = useState('camelina');
  const [itemList, setItemList] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedDataType, setSelectedDataType] = useState(null);


  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };



  const [dTypes, setDTypes] = useState([]);
  const [objList, setObjList] = useState(null);
  const [spps, setSpps] = useState(null);

  const {apiToken, setApiToken} = useTokenContext();


  useEffect(() => {
    axios
      .post(`${apiEndpoint}/getBucketObjectList/?token=${apiToken}`)
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

  // const handleSecondDropdownClick = (v) => {

  //   setSelectedDtype(dTypeOptions[v]);

  //   var newItemList = [];
  //   objList[selectedSpp][dTypeOptions[v]].map((item) => {
  //     if (item != "") {
  //       newItemList.push({
  //         name: item,
  //         // size: '10 MB',
  //         downloadLink: `${apiEndpoint}/getBucketObjectData/?bucket_name=${selectedSpp}&object_name=${dTypeOptions[v]}/${item}&token=${apiToken}`,
  //       });
  //     }
  //   });
  //   setItemList(newItemList);
  //   setShowPageComponent(true);

  // };


  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #ddd",
  };

  const thStyle = {
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    // backgroundColor: "#f2f2f2",
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
    "DNAmeth" : "DNA methylation data (fastq)",
    "DNAseq" : "DNA sequencing data (fastq)",
    "RNAseq" : "RNA sequencing data (fastq)",
    "Meta" : "Project information",
    "Plink" : "GWAS datasets (plink binary format)",
    "Pheno" : "Phenotypic data (tsv)",
    "LongReadAssemblies" : "Long Read Genomes Assemblies (fasta)",
    "ShortReadAssemblies" : "Short Read Genomes Assemblies (fasta)",
    "VCFdata" : "Marker data (vcf)",
    "Analysis" : "Analysis Protocols"
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




  const renderDataCards = () => {
    if (!objList || !selectedSpp) return null;
  
    const screenWidth = window.innerWidth;
    let cardsPerRow = 1;
  
    if (screenWidth >= 600) {
      cardsPerRow = 2;
    }
  
    if (screenWidth >= 960) {
      cardsPerRow = 3;
    }
  
    if (screenWidth >= 1280) {
      cardsPerRow = 4;
    }
  
    const cardWidthPercentage = 100 / cardsPerRow;
  
    return (
      <Grid container spacing={2}>
        {Object.keys(objList[selectedSpp]).map((dataType) => (
          <Grid key={dataType} item xs={12} sm={6} md={4} lg={3} style={{ width: `${cardWidthPercentage}%` }}>
            <Card sx={{ height : 150, margin: '1px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '8px' }} onClick={(e) => handleCardClick(e,dataType)}>
              <CardContent>
                <Typography variant="h6">{dataType}</Typography>
                <Typography>{dTypeLabels[dataType]}</Typography>
                {/* <img src="/path/to/dummy/image.jpg" alt="Dummy Image" style={{ width: '100%', marginTop: '10px' }} /> */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

 
  const renderItems = () => {
    if (!selectedSpp || !selectedDataType) return null;
  
    const itemList = objList[selectedSpp][selectedDataType].filter(item => item.trim() !== '');
  
    const columns = [
      { field: 'checkbox', headerName: 'Select', width: 100, headerClassName: 'header-checkbox', renderCell: (params) => <Checkbox sx={{ ml: 2 }} checked={selectedItems.includes(params.row.name)} onChange={() => handleCheckboxChange(params.row.name)} /> },
      { field: 'name', headerName: 'File Name', width: 500, headerClassName: 'header-name' }
    ];
  
    const rows = itemList.map((itemName, index) => ({ id: index, name: itemName }));
  
    return (

      <div style={{ height: 1000, width: '100%', border: '2px solid #ccc' }}>
        {itemList.length > 0 ?

        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          pageSize={5}
          rowsPerPageOptions={[5]}
          className="custom-datagrid"
          headerClassName="custom-header"
        />

        : <Typography>No data is available under this category</Typography>


      }

      </div>
    );
  };
  
  
  const handleCardClick = (e, dataType) => {
    setSelectedDataType(dataType);
    setSelectedItems([]); // Clear selected items when a new card is clicked
    setTabValue(1)
  };


  const handleCheckboxChange = (itemName) => {
    const selectedIndex = selectedItems.indexOf(itemName);
    let newSelectedItems = [...selectedItems];

    if (selectedIndex === -1) {
      // Item was not previously selected
      newSelectedItems.push(itemName);
    } else {
      // Item was previously selected, remove it
      newSelectedItems.splice(selectedIndex, 1);
    }

    setSelectedItems(newSelectedItems);
  };


//   const handleDownloadClick = () => {
//     selectedItems.forEach((item, index) => { 
//         if (item !== "") {
//             const downloadLink = `${apiEndpoint}/getBucketObjectFile?bucket_name=${selectedSpp}&object_name=${selectedDataType}/${item}&token=${apiToken}`;
//             axios
//                 .post(downloadLink, {}, { responseType: "blob" })
//                 .then((response) => {
//                     // Extract filename from response headers or use a predefined filename
//                     saveAs(response.data, item);
//                 })
//                 .catch((error) => {
//                     console.error("Error downloading file:", error);
//                 });
//         }
//     });
// };


const handleDownloadClick = () => {
  selectedItems.forEach((item, index) => {
      if (item !== "") {
          const downloadLink = `${apiEndpoint}/getBucketObjectFile?bucket_name=${selectedSpp}&object_name=${selectedDataType}/${item}&token=${apiToken}`;

          // Create a new XMLHttpRequest object
          const xhr = new XMLHttpRequest();
          xhr.open('POST', downloadLink);
          xhr.responseType = 'blob'; // Set response type to blob

          // Event listener for progress updates
          xhr.addEventListener('progress', (event) => {
              // Update progress indicator or UI element
              console.log('Download progress:', event.loaded, '/', event.total);
          });

          // Event listener for when the response is received
          xhr.addEventListener('load', () => {
              if (xhr.status === 200) {
                  // Create a new Blob object from the response data
                  const blob = new Blob([xhr.response], { type: xhr.getResponseHeader('Content-Type') });

                  // Create a temporary URL for the blob object
                  const url = window.URL.createObjectURL(blob);

                  // Create a link element to initiate the download
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = item; // Specify the download filename
                  document.body.appendChild(a);
                  a.click(); // Trigger the click event to start the download
                  document.body.removeChild(a); // Clean up the link element
                  window.URL.revokeObjectURL(url); // Release the object URL
              } else {
                  console.error('Error downloading file:', xhr.statusText);
              }
          });

          // Event listener for errors
          xhr.addEventListener('error', () => {
              console.error('Network error occurred while downloading file.');
          });

          // Send the request
          xhr.send();
      }
  });
};




  return (
    <div>

<Typography sx={{ mt: 1, ml: 2, marginBottom: 2 }} variant="h4">
        Downloads
      </Typography>

<Box sx={{  ml: 2, width: '100%' }}>
  <Box sx={{ borderBottom: 1, borderColor: 'divider', textAlign: 'left' }}>
    <Tabs value={tabValue} onChange={handleTabChange} centered={false}>
      <Tab label="Categories" />
      <Tab label="Items" />
    </Tabs>
  </Box>

  <TabPanel value={tabValue} index={0}>
    
  <Grid>
        {!selectedSpp || (
          <div>
              {renderDataCards()}
          </div>
        )}
      </Grid>

  </TabPanel>

  <TabPanel value={tabValue} index={1}>

    <Typography>{dTypeOptions[selectedDataType]}</Typography>
    

  <Grid>
  {!showPageComponent || 
  <div>
     {!(itemList.length >= 1) ?  (<h5 style={{ marginTop: "20px", padding: "10px" }} >No data is yet available for the selected category</h5>) : (

      <div>
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
      </div>)

    }
        </div>

        }

  </Grid>

  <div>
    
      <Grid container spacing={2} padding={5}>
        {renderItems()}
        <Button
        sx={{mt:1}}
        variant="contained"
        disabled={selectedItems.length === 0}
        onClick={handleDownloadClick}
      >
        Download Selected Items
      </Button>
      </Grid>

    </div>

        
  </TabPanel>
</Box>







        </div>




  );
}
