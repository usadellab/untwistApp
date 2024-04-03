import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import axios from 'axios';

const DatabaseExplorer = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableColumns, setTableColumns] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Fetch the list of tables when the component mounts
    axios.get('/api/postgres/tables')
      .then(response => setTables(response.data))
      .catch(error => console.error('Error fetching tables:', error));
  }, []);

  const handleTableChange = async (event, value) => {
    setSelectedTable(value);

    // Fetch columns and first 60 rows for the selected table
    const response = await axios.get(`/api/table/${value}`);
    setTableColumns(response.data.columns);
    setTableData(response.data.rows);
  };

  return (
    <div>
      <Autocomplete
        options={tables}
        getOptionLabel={(option) => option}
        onChange={handleTableChange}
        renderInput={(params) => <input {...params} placeholder="Select a table" />}
      />

      <Table>
        <TableHead>
          <TableRow>
            {tableColumns.map(column => (
              <TableCell key={column}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {tableColumns.map(column => (
                <TableCell key={column}>{row[column]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DatabaseExplorer;
