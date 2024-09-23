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
