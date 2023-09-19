import React, { useState, useEffect } from 'react';
import { Typography } from "@mui/material";

import dynamic from 'next/dynamic'
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

const GeoLocator = (props) => {
    const data = props.data;
    const latitudes = [];
    const longitudes = [];
    const text = [];
    const markerData = [];
    data.forEach((item) => {
        if (item.origin && item.latitude !== 0 && item.longitude !== 0) {
            latitudes.push(item.latitude);
            longitudes.push(item.longitude);
            text.push(item.metadata.text || '');

            const markerInfo = {
                Cultivar: item.cultivar,
                Country : item.origin,
                Name1: item.metadata.Name1,
                Name2: item.metadata.Name2,
                Name3: item.metadata.Name3,
                Origin: item.metadata.Origin,
                Provider: item.metadata.Provider,
            };

            markerData.push(markerInfo);
        }
    });

    const [selectedMarker, setSelectedMarker] = useState(null);

    const handleMarkerClick = (event) => {
        setSelectedMarker(markerData[event.points[0].pointIndex]);
    };

    const closePopup = () => {
        setSelectedMarker(null);
    };

    useEffect(() => {
        const handleBackgroundClick = (event) => {
            if (
                event.target.classList.contains('popup-background') ||
                event.target.classList.contains('popup-content')
            ) {
                closePopup();
            }
        };

        window.addEventListener('mousedown', handleBackgroundClick);

        return () => {
            window.removeEventListener('mousedown', handleBackgroundClick);
        };
    }, []);

    const trace = {
        type: 'scattergeo',
        locationmode: 'country names',
        lon: longitudes,
        lat: latitudes,
        text,
        mode: 'markers',
        marker: {
            size: 10,
            opacity: 0.7,
            color: 'red', 
            line: {
                color: 'rgb(0, 0, 0)',
                width: 1,
            },
        },
        // hovertemplate:
        // '<b>%{text}</b><br>' +
        // '<table>' +
        // '<tr><td>Cultivar:</td><td>%{customdata.Cultivar}</td></tr>' +
        // '<tr><td>Origin:</td><td>%{customdata.origin}</td></tr>' +
        // // '<tr><td>Reseq:</td><td>%{customdata.reseq}</td></tr>' +
        // // '<tr><td>Versus CAM:</td><td>%{customdata.versusCam}</td></tr>' +
        // '<tr><td>Name1:</td><td>%{customdata.Name1}</td></tr>' +
        // '<tr><td>Name2:</td><td>%{customdata.Name2}</td></tr>' +
        // '<tr><td>Name3:</td><td>%{customdata.Name3}</td></tr>' +
        // '<tr><td>Provider:</td><td>%{customdata.Provider}</td></tr>' +
        // '</table>',
        // hoverinfo: 'none',
        hovertemplate : "Click",
        
        customdata: markerData,
    };

    const layout = {
        title: {
            text: 'Geo Location of Plant Material',
            font: {
                size: 36,
                color: 'black',
                family: 'Courier New, monospace',
                weight: 'bold',
            },
            x: 2, 
        },
        geo: {
            projection: {
                type: 'mercator',
            },
            showland: true,
        },
        height: 1100,
        width: 1100,
        margin: {
            l: 0, 
            r: 0, 
            t: 50, 
            b: 0,
        },
        paper_bgcolor: 'rgba(0,0,0,0)', 
        clickmode: 'event+select',
    };

    return (
        <div>
            <Plot
                data={[trace]}
                layout={layout}
                onSelected={handleMarkerClick}
                config={{ displayModeBar: false }}
            />
            {selectedMarker && (
                <div className="popup-background">
                    <div className="popup-content">
                        <Typography variant='h6' fontWeight={'bold'}>Germplasm Info</Typography>
                        <table>
                            <tbody>
                                {Object.entries(selectedMarker).map(([key, value]) => (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <style jsx>{`
                .popup-background {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .popup-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
                }
            `}</style>
        </div>
    );
};

export default GeoLocator;
