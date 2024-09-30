///////////////////////////////////////////////////////////////////////////////////////////// Leaflet

// 'use client'

// // import React, { useState, useEffect } from "react";
// // import { Grid, Typography } from "@mui/material";
// // import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// // import "leaflet/dist/leaflet.css";
// // import L from "leaflet"; // Import Leaflet library
// // import { capitalizeFirstLetter } from "./utils";
// // import axios from "axios";
// // import { useTokenContext } from "@/contexts/TokenContext";
// // import { useApiContext } from "@/contexts/ApiEndPoint";
// // import '../globals.css';

// // const GeoLocator = ({ studyId }) => {
// //   const { apiEndpoint } = useApiContext();
// //   const [germplasmData, setGermplasmData] = useState([]);
// //   const [selectedMarker, setSelectedMarker] = useState(null);
// //   const [clickedMarker, setClickedMarker] = useState(null); // New state variable
// //   const token = useTokenContext();

// //   const valuesToRemove = [
// //     "biological_material_city",
// //     "id",
// //     "investigation_identifier",
// //     "study_identifier",
// //   ];

// //   function removeKeysWithValues(objArray, valuesToRemove) {
// //     const cleanedObjArray = objArray.map((materialData) => {
// //       const cleanedMaterialData = {};
// //       Object.keys(materialData).forEach((key) => {
// //         if (!valuesToRemove.includes(key)) {
// //           cleanedMaterialData[key] = materialData[key];
// //         }
// //       });
// //       return cleanedMaterialData;
// //     });
// //     setGermplasmData(cleanedObjArray);
// //   }

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await axios.post(
// //           `${apiEndpoint}/germplasm?studyId=${studyId}&token=${token.apiToken}`
// //         );
// //         // Check if the response is valid and has the expected structure
// //         if (
// //           response &&
// //           response.data &&
// //           response.data.result &&
// //           response.data.result.data
// //         ) {
// //           const materialData = response.data.result.data;
// //           removeKeysWithValues(materialData, valuesToRemove);
// //         } else {
// //           console.error("Unexpected response structure:", response);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching data:", error);
// //         // ... error handling omitted for brevity
// //       }
// //     };

// //     if (token.apiToken) {
// //       fetchData();
// //     }
// //   }, [studyId, token.apiToken]); // Add token.apiToken to the dependency array

// //   const greenIcon = L.icon({
// //     iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-orange.png",
// //     iconSize: [38 / 2.5, 95 / 2.5],
// //     popupAnchor: [0, -15],
// //   });

// //   return (
// //     <>
// //       <Typography
// //         variant="h7"
// //         fontWeight={"bold"}
// //         fontSize={"12pt"}
// //         sx={{ ml: 1 }}
// //       >
// //         Geographical distribution of the Germplasm used within the selected
// //         study
// //       </Typography>

// //       <Grid>
// //         <MapContainer
// //           center={[40, 40]}
// //           zoom={4}
// //           style={{ width: "100%", height: "1000px" }}
// //         >
// //           <TileLayer
// //             url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
// //             minZoom={3}
// //             maxZoom={17}
// //           />

// //           {germplasmData.map((marker, index) => (
// //             <Marker
// //               key={index}
// //               icon={greenIcon}
// //               position={[
// //                 marker.biological_material_latitude,
// //                 marker.biological_material_longitude,
// //               ]}
// //               eventHandlers={{
// //                 click: () => {
// //                   setClickedMarker(marker); // Store clicked marker
// //                   setSelectedMarker(marker);
// //                 },
// //               }}
// //             />
// //           ))}

// //           {selectedMarker && (
// //             <Popup
// //               position={[
// //                 selectedMarker.biological_material_latitude,
// //                 selectedMarker.biological_material_longitude,
// //               ]}
// //               onClose={() => {
// //                 if (clickedMarker && clickedMarker.id !== selectedMarker.id) {
// //                   setSelectedMarker(null);
// //                 }
// //               }}
// //               className="custom-popup"
// //               closeOnClick={true}
// //               anchorOrigin={{
// //                 vertical: 'top',
// //                 horizontal: 'center',
// //               }}
// //             >
// //               <div>
// //                 <h2>Germplasm Info</h2>
// //                 <table>
// //                   <tbody>
// //                     {Object.keys(selectedMarker).map((key, index) => (
// //                       <tr key={index}>
// //                         <td className="custom-key-text">
// //                           {capitalizeFirstLetter(
// //                             key.replace("biological_material_", "").replace("_", " ")
// //                           )}
// //                           :
// //                         </td>
// //                         <td className="custom-value-text">
// //                           {selectedMarker[key]}
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </Popup>
// //           )}
// //         </MapContainer>
// //       </Grid>
// //     </>
// //   );
// // };

// // export default GeoLocator;

///////////////////////////////////////////////////////////////////////////////////////////// Plotly + D3 + geoJson

'use client'

import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import worldGeoJson from "/public/worldgeo.json"; 
import * as d3 from 'd3';
import axios from "axios";
import { useTokenContext } from "@/contexts/TokenContext";
import { useApiContext } from "@/contexts/ApiEndPoint";
import '../globals.css';

const GeoLocator = ({studyId}) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [germplasmData, setGermplasmData] = useState([]);
  const [popupPosition, setPopupPosition] = useState([0, 0]);
  const [plotLayout, setPlotLayout] = useState({
    showlegend: false,
    width: '100%',  // Set width to 100% to fill the container
    height: 800,    // Maintain your desired height
    geo: {
        showcountries: true,
        showland: true,
        showocean: true,
        oceancolor: "#f0f0f0",
        showcoastlines: true,
        coastlinecolor: '#d3d3d3',
        landcolor: '#e0e0e0',
        projection: {
            type: 'mercator',
            scale: 2,
        },
        center: {
            lat: 40,
            lon: 50,
        },
    },
    margin: {
        l: 0,  // No left margin
        r: 0,  // No right margin
        t: 0,  // No top margin
        b: 0,  // No bottom margin
    },
    // Optional title configuration if you want to include it later
    // title: {
    //     text: 'Crop Locations in Asia and Europe',
    //     x: 0.5,
    //     xanchor: 'center',
    //     font: {
    //         size: 16,
    //         family: 'Arial, sans-serif',
    //         color: 'black',
    //     }
    // },
});


  const { apiEndpoint } = useApiContext();
  const token = useTokenContext();

  const valuesToRemove = [
    "biological_material_city",
    "id",
    "investigation_identifier",
    "study_identifier",
  ];

  function removeKeysWithValues(objArray, valuesToRemove) {
    const cleanedObjArray = objArray.map((materialData) => {
      const cleanedMaterialData = {};
      Object.keys(materialData).forEach((key) => {
        if (!valuesToRemove.includes(key)) {
          cleanedMaterialData[key] = materialData[key];
        }
      });
      return cleanedMaterialData;
    });

    setGermplasmData(cleanedObjArray);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${apiEndpoint}/germplasm?studyId=${studyId}&token=${token.apiToken}`
        );
        if (
          response &&
          response.data &&
          response.data.result &&
          response.data.result.data
        ) {
          const materialData = response.data.result.data;
          removeKeysWithValues(materialData, valuesToRemove);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (token.apiToken) {
      fetchData();
    }
  }, [studyId, token.apiToken]);

  useEffect(() => {
    const getCountryData = () => {
      const countries = worldGeoJson.features;
      return countries.map((country) => {
        const centroid = d3.geoCentroid(country);
        return {
          name: country.properties.name,
          lat: centroid[1],
          lon: centroid[0],
        };
      });
    };

    setCountryData(getCountryData());
  }, []);

  // Handle marker click
  const handleClick = (event) => {
    const pointIndex = event.points[0].pointIndex;
    const clickedMarker = germplasmData[pointIndex];
    setSelectedMarker(clickedMarker);
    // setPopupPosition([clickedMarker.biological_material_latitude, clickedMarker.biological_material_longitude]);
    setPopupPosition([172, 280]);
  };

  // Store the zoom level before re-rendering
  const handleRelayout = (layoutUpdate) => {
    if (layoutUpdate && layoutUpdate['geo.center'] && layoutUpdate['geo.projection.scale']) {
      setPlotLayout((prevLayout) => ({
        ...prevLayout,
        geo: {
          ...prevLayout.geo,
          center: layoutUpdate['geo.center'],   // Preserve map center
          projection: {
            ...prevLayout.geo.projection,
            scale: layoutUpdate['geo.projection.scale'],  // Preserve zoom level
          },
        },
      }));
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}> 

      {!germplasmData.length > 0 || (
        <Plot
          data={[
            {
              type: 'scattergeo',
              mode: 'markers',
              lat: germplasmData.map((d) => d.biological_material_latitude),
              lon: germplasmData.map((d) => d.biological_material_longitude),
              marker: {
                symbol: "triangle-down",
                size: 16,
                color: '#DE3163', 
                opacity: 0.8,
              },
              hovertemplate: germplasmData.map((d) =>
                `<b style="color: #2980b9;">Identifier:</b> <span style="color: #2c3e50;">${d.biological_material_identifier}</span><br>` +
                `<b style="color: #2980b9;">Names:</b> <span style="color: #2c3e50;">${d.biological_material_names}</span><br>` +
                `<b style="color: #2980b9;">Genus:</b> <span style="color: #2c3e50;">${d.biological_material_genus}</span><br>` +
                `<b style="color: #2980b9;">Species:</b> <span style="color: #2c3e50;">${d.biological_material_species}</span><br>` +
                `<b style="color: #2980b9;">Scientific Name:</b> <span style="color: #2c3e50;">${d.biological_material_organism}</span><br>` +
                `<b style="color: #2980b9;">Infraspecific Name:</b> <span style="color: #2c3e50;">${d.biological_material_infraspecific_name}</span><br>` +
                `<b style="color: #2980b9;">Source:</b> <span style="color: #2c3e50;">${d.biological_material_source}</span><br>` +
                `<b style="color: #2980b9;">Source ID:</b> <span style="color: #2c3e50;">${d.biological_material_source_id}</span><br>` +
                `<b style="color: #2980b9;">Source Latitude:</b> <span style="color: #2c3e50;">${d.biological_material_latitude}</span><br>` +
                `<b style="color: #2980b9;">Source Longitude:</b> <span style="color: #2c3e50;">${d.biological_material_longitude}</span><br>` +
                `<extra></extra>`
              ),
              hoverinfo: 'text',
              hoverlabel: {
                align: "left", 
                bordercolor: '#34495e',
                bgcolor: '#f5b7b1',
                font: {
                  size: 14, 
                  color: '#2c3e50' 
                }
              }
              
        
            },
            {
              type: 'scattergeo',
              mode: 'text',
              text: countryData.map((d) => d.name),
              lat: countryData.map((d) => d.lat),
              lon: countryData.map((d) => d.lon),
              textfont: {
                size: 10,
                color: 'black',
                family: 'Arial, sans-serif',
              },
              hoverinfo: 'none',
            },
          ]}
          layout={plotLayout}  // Apply the layout with preserved zoom and center
          // onClick={handleClick}  // i have disable the onclick but it works as well
          onRelayout={handleRelayout}  // Capture the zoom change event

        />
      )}


      {selectedMarker && (
        <div
          style={{
            position: 'absolute',
            top: `${popupPosition[0]}px`,
            left: `${popupPosition[1]}px`,
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 10000,
          }}
          onClick={(e) => e.stopPropagation()}  // Prevent closing the popup when clicking inside
        >
          <button
            onClick={() => setSelectedMarker(null)}  // Close the popup when clicked
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            &times; {/* The 'X' symbol */}
          </button>

          <h2>Germplasm Info</h2>
          <table>
            <tbody>
              {Object.keys(selectedMarker).map((key, index) => (
                <tr key={index}>
                  <td className="custom-key-text">
                    {key.replace('biological_material_', '').replace('_', ' ').replace(/^./, str => str.toUpperCase())}:
                  </td>
                  <td className="custom-value-text">
                    {selectedMarker[key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    
      
    </div>
  );
};

export default GeoLocator;

