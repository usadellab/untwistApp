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
          onRelayout={handleRelayout}  // Capture the zoom change event

        />
      )}
    
      
    </div>
  );
};

export default GeoLocator;

