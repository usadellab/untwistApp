// 'use client'

// import React, { useState, useEffect, useRef } from 'react';
// import { Grid } from '@mui/material';
// import * as d3 from 'd3';
// import cropData from "/public/cropLocations.json";


// const GeoLocator = (props) => {
//   const svgRef = useRef(null);
//   const [selectedMarker, setSelectedMarker] = useState(null);

//   const data = cropData // props.data;
//   const markerData = [];

//   data.forEach((item) => {
//     if (item.origin && item.latitude !== 0 && item.longitude !== 0) {
//       const markerInfo = {
//         Cultivar: item.cultivar,
//         Country: item.origin,
//         Name1: item.metadata.Name1,
//         Name2: item.metadata.Name2,
//         Name3: item.metadata.Name3,
//         Origin: item.metadata.Origin,
//         Provider: item.metadata.Provider,
//         latitude: item.latitude,
//         longitude: item.longitude,
//       };
//       markerData.push(markerInfo);
//     }
//   });


//   useEffect(() => {
//     const width = 1000;
//     const height = 700;
//     const viewBoxWidth = 2000;
//     const viewBoxHeight = 2000;

//     function updateAttributes(event) {
//       const currentZoom = event.transform.k;

//       svg
//         .selectAll('circle')
//         .attr('r', 5 / currentZoom);

//       svg
//         .selectAll('text')
//         .style('font-size', `${10 / currentZoom}px`);
//     }

//     const zoom = d3.zoom()
//       .scaleExtent([1, 8])
//       .on('zoom', (event) => {
//         svg.attr('transform', event.transform);
//         updateAttributes(event);
//       });

//     const svg = d3.select(svgRef.current)
//       .attr('width', width)
//       .attr('height', height)
//       .style('background-color', 'lightblue');

//     svg.append('rect')
//       .attr('fill', 'blue')
//       .attr('opacity', 0.5);

//     svg.call(zoom);

//     const projection = d3.geoMercator()
//       .scale(200)
//       .translate([width / 2, height / 2]);

//     const path = d3.geoPath().projection(projection);

//     d3.json('./worldgeo.json').then((world) => {
//       svg
//         .selectAll('path')
//         .data(world.features)
//         .enter()
//         .append('path')
//         .attr('d', path)
//         .style('fill', 'lightgray')
//         .style('stroke', 'white');

//       svg
//         .selectAll('circle')
//         .data(markerData)
//         .enter()
//         .append('circle')
//         .attr('cx', (d) => projection([d.longitude, d.latitude])[0])
//         .attr('cy', (d) => projection([d.longitude, d.latitude])[1])
//         .attr('r', 5)
//         .attr('fill', 'green')
//         .attr('stroke', 'red')
//         .on('click', (event, d) => {
//           setSelectedMarker(d);
//         });

//       svg
//         .selectAll('text')
//         .data(world.features)
//         .enter()
//         .append('text')
//         .attr('x', (d) => path.centroid(d)[0])
//         .attr('y', (d) => path.centroid(d)[1])
//         .text((d) => d.properties.name)
//         .style('text-anchor', 'middle')
//         .style('alignment-baseline', 'middle')
//         .style('font-size', '10px')
//         .style('fill', 'black');

//       svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(1));

//       if (selectedMarker) {
//         svg.select('.popup-container').remove();

//         const popup = svg
//           .append('foreignObject')
//           .attr('class', 'popup-container')
//           .attr('x', 1)
//           .attr('y', 1)
//           .attr('width', 300)
//           .attr('height', 500);

//         popup
//           .append('xhtml:body')
//           .html(
//             `<div style="position: absolute; top: 20px; left: 30px; border: 2px solid #000; padding: 10px; background-color: white;" >
//               <h6>Germplasm Info</h6>
//               <table>
//                 <tr><td>Cultivar:</td><td>${selectedMarker.Cultivar}</td></tr>
//                 <tr><td>Country:</td><td>${selectedMarker.Country}</td></tr>
//                 <tr><td>Name1:</td><td>${selectedMarker.Name1}</td></tr>
//                 <tr><td>Name2:</td><td>${selectedMarker.Name2}</td></tr>
//                 <tr><td>Name3:</td><td>${selectedMarker.Name3}</td></tr>
//                 <tr><td>Origin:</td><td>${selectedMarker.Origin}</td></tr>
//                 <tr><td>Provider:</td><td>${selectedMarker.Provider}</td></tr>
//               </table>
//             </div>`
//           );
//       }
//     });
//   }, [selectedMarker, markerData]);

//   return (
//     <Grid sx={{ml:-60, mt:-40}}>
//       <svg ref={svgRef}></svg>
//     </Grid>
//   );
// };

// export default GeoLocator;

// import React, { useState } from 'react';
// import { Grid } from '@mui/material';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import cropData from "/public/cropLocations.json";

// var greenIcon = L.icon({
//   iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-orange.png', //'https://leafletjs.com/examples/custom-icons/leaf-red.png', // 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
//   // shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',

//   iconSize:     [38/3, 95/3], // size of the icon
//   // shadowSize:   [50, 64], // size of the shadow
//   // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
//   // shadowAnchor: [4, 62],  // the same for the shadow
//   popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
// });


// const GeoLocator = (props) => {
//   const [selectedMarker, setSelectedMarker] = useState(null);

//   const data = cropData; // props.data;
//   const markerData = data.filter(item => item.origin && item.latitude !== 0 && item.longitude !== 0);

//   return (
//     <Grid>
//       <MapContainer
//         center={[25, 20]}
//         zoom={3}
//         style={{ width: '100%', height: '1000px' }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         {markerData.map((marker, index) => (
//           <Marker
//             key={index}
//             icon={greenIcon} 
//             position={[marker.latitude, marker.longitude]}

//             eventHandlers={{
//               click: () => setSelectedMarker(marker),
//             }}
//           />
//         ))}
//         {selectedMarker && (
//           <Popup
//             position={[selectedMarker.latitude, selectedMarker.longitude]}
//             onClose={() => setSelectedMarker(null)}
//           >
//             <div>
//               <h6>Germplasm Info</h6>
//               <table>
//                 <tbody>
//                   <tr>
//                     <td>Cultivar:</td>
//                     <td>{selectedMarker.cultivar}</td>
//                   </tr>
//                   <tr>
//                     <td>Country:</td>
//                     <td>{selectedMarker.origin}</td>
//                   </tr>
//                   <tr>
//                     <td>Name1:</td>
//                     <td>{selectedMarker.metadata.Name1}</td>
//                   </tr>
//                   <tr>
//                     <td>Name2:</td>
//                     <td>{selectedMarker.metadata.Name2}</td>
//                   </tr>
//                   <tr>
//                     <td>Name3:</td>
//                     <td>{selectedMarker.metadata.Name3}</td>
//                   </tr>
//                   <tr>
//                     <td>Origin:</td>
//                     <td>{selectedMarker.metadata.Origin}</td>
//                   </tr>
//                   <tr>
//                     <td>Provider:</td>
//                     <td>{selectedMarker.metadata.Provider}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </Popup>
//         )}
//       </MapContainer>
//     </Grid>
//   );
// };

// export default GeoLocator;


import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import cropData from "/public/cropLocations.json";
import L from 'leaflet'; // Import Leaflet library

const GeoLocator = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);

  const data = cropData;
  const markerData = data.filter(item => item.origin && item.latitude !== 0 && item.longitude !== 0);

  // Define Leaflet icon
var greenIcon = L.icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-orange.png', 
  // iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png', 
  // iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
  // shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',

  iconSize:     [38/2.5, 95/2.5], // size of the icon
  // shadowSize:   [50, 64], // size of the shadow
  // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  // shadowAnchor: [4, 62],  // the same for the shadow
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

  return (
    <Grid>
      <MapContainer
        center={[40, 40]}
        zoom={4}
        style={{ width: '100%', height: '1000px' }}
      >
        {/* Use the world map tile layer */}
        <TileLayer
          url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
          minZoom={3}
  maxZoom= {17}
  // attribution= '&copy; <a href="https://carto.com/">carto.com</a> contributors'
        />
        {/* Render markers */}
        {markerData.map((marker, index) => (
          <Marker
            key={index}
            icon={greenIcon}
            position={[marker.latitude, marker.longitude]}
            eventHandlers={{
              click: () => setSelectedMarker(marker),
            }}
          />
        ))}
        {/* Render popup */}
        {selectedMarker && (
          <Popup
            position={[selectedMarker.latitude, selectedMarker.longitude]}
            onClose={() => setSelectedMarker(null)}
          >
            <div>
              <h6>Germplasm Info</h6>
              <table>
                <tbody>
                  <tr>
                    <td>Cultivar:</td>
                    <td>{selectedMarker.cultivar}</td>
                  </tr>
                  <tr>
                    <td>Country:</td>
                    <td>{selectedMarker.origin}</td>
                  </tr>
                  <tr>
                    <td>Name1:</td>
                    <td>{selectedMarker.metadata.Name1}</td>
                  </tr>
                  <tr>
                    <td>Name2:</td>
                    <td>{selectedMarker.metadata.Name2}</td>
                  </tr>
                  <tr>
                    <td>Name3:</td>
                    <td>{selectedMarker.metadata.Name3}</td>
                  </tr>
                  <tr>
                    <td>Origin:</td>
                    <td>{selectedMarker.metadata.Origin}</td>
                  </tr>
                  <tr>
                    <td>Provider:</td>
                    <td>{selectedMarker.metadata.Provider}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Popup>
        )}
      </MapContainer>
    </Grid>
  );
};

export default GeoLocator;
