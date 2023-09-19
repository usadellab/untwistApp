import React from 'react';
import { Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

import Projectdata from "/public/projectDataDescription.json";

const ProjectDataDescription = (props) => {
    const data = Projectdata;
    // const data = Projectdata[props.spp];
    const keys = Object.keys(data);
    return (
        <>

<Typography sx={{mt:2, margrinBottom:2}} variant='h8' color='green' > {`UNTWIST Project data for ${props.spp}. is setup. Below is a description of the dataset. Now you can proceed to analysis.`} </Typography>

        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Species</TableCell>
                        <TableCell>Available Data</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {keys.map((key) => (
                        <TableRow key={key}>
                            <TableCell component="th" scope="row">
                                {key}
                            </TableCell>
                            <TableCell>
                                <Table>
                                    <TableBody>
                                        {Object.keys(data[key]).map((innerKey) => (
                                            <TableRow key={innerKey}>
                                                <TableCell>{innerKey}</TableCell>
                                                <TableCell>
                                                    {typeof data[key][innerKey] === 'object' ? (
                                                        <ul>
                                                            {Object.keys(data[key][innerKey]).map((subKey) => (
                                                                <li key={subKey}>
                                                                    <strong>{subKey}:</strong> {data[key][innerKey][subKey]}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : Array.isArray(data[key][innerKey]) ? (
                                                        <ul>
                                                            {data[key][innerKey].map((item, index) => (
                                                                <li key={index}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    ) : innerKey === 'urls' ? (
                                                        <ul>
                                                            {data[key][innerKey].map((url, index) => (
                                                                <li key={index}>
                                                                    <a
                                                                        href={url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        {url}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        data[key][innerKey]
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </>
    );
};

export default ProjectDataDescription;
