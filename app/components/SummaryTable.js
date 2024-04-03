import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Grid } from '@mui/material';
import PlotlyPlots from './PlotlyPlots2';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(accession, Heterozygosity) {
  return { accession, Heterozygosity };
}

export default function SummaryTable(props) {
  const data = props.data;
  const rows = [
    createData('Frozen yoghurt', 159),
  ];

  var plotSchema = {
    inputData: {},
    ploty_type: "bar",
    variablesToPlot: ['accessions', 'Heterozygosity'],
    plotTitle: 'Heterozygosity of the untwist panel',
    xLable: 'accessions',
    yLable: 'Heterozygosity',
    // isDark: isDarkMode,
  };








  return (

    <Grid container columns={2} >
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Accessions </StyledTableCell>
            <StyledTableCell align="right">Heterozygosity (%age)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.accession}
              </StyledTableCell>
              <StyledTableCell align="right">{row.Heterozygosity}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    {/* <PlotlyPlots  plotSchema={plotSchema} /> */}

    </Grid>
  );
}