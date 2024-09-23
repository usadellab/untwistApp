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

import React from 'react';

const TableComponent = (props) => {
  const data = props.data;

  if (!data || data.length === 0) {
    return <div>No Results Found, try changing the threshold</div>;
  }

  // Define the desired column order
  const columnOrder = ['Chr', 'Position', 'REF/ALT allele', 'Gene Id', 'Protein Name', 'DESCRIPTION'];

  // Columns for which unique values should be maintained
  const uniqueColumns = ['Chr']; // ['SNP ID', 'Chr', 'Position', 'REF/ALT allele'];

  // Create an object to store previous values for each unique column
  const prevValuesMap = {};
  uniqueColumns.forEach((column) => {
    prevValuesMap[column] = null;
  });

  // Find the unique list of keys from all the objects in the input data array
  const allKeys = Array.from(new Set(data.flatMap((item) => Object.keys(item))));

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {columnOrder.map((column) => (
              <th
                key={column}
                style={{ padding: '8px', border: '1px solid #ddd', whiteSpace: 'nowrap' }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const newItem = {};
            columnOrder.forEach((key) => {
              if (uniqueColumns.includes(key)) {
                if (key === 'SNP ID') {
                  // Reset previous values to empty strings when 'SNP ID' changes
                  prevValuesMap[key] = item[key] !== prevValuesMap[key] ? item[key] : '';
                } else {
                  newItem[key] = item[key] !== prevValuesMap[key] ? item[key] : '';
                  prevValuesMap[key] = item[key];
                }
              } else {
                newItem[key] = item[key] || 'NA';
              }
            });

            return (
              <tr key={index}>
                {columnOrder.map((column) => (
                  <td
                    key={column}
                    style={{ padding: '8px', border: '1px solid #ddd', wordWrap: 'break-word' }}
                  >
                    {newItem[column]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
