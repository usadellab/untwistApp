import React from 'react';

const TableComponent = (props) => {
var data = props.data;

if (!data || data.length === 0) {
return <div>No Results Found, try changing the threshold</div>;
}

// Find the unique list of keys from all the objects in the input data array
const allKeys = Array.from(new Set(data.flatMap((item) => Object.keys(item))));

// Move 'Dbxref' to the end of the keys array (if it exists)
const dbxrefIndex = allKeys.indexOf('Dbxref');
if (dbxrefIndex !== -1) {
allKeys.splice(dbxrefIndex, 1);
allKeys.push('Dbxref');
}

// Create new objects for each item in the data array with all the unique keys
const newData = data.map((item) => {
const newItem = {};
allKeys.forEach((key) => {
    newItem[key] = item[key] || 'NA';
});
return newItem;
});

return (
<div style={{ overflowX: 'auto' }}>
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
    <thead>
        <tr style={{ background: '#f2f2f2' }}>
        <th style={{ padding: '8px', border: '1px solid #ddd', whiteSpace: 'nowrap' }}>
            Serial No
        </th>
        {allKeys.map((column) => (
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
        {newData.map((item, index) => (
        <tr key={index}>
            <td style={{ padding: '8px', border: '1px solid #ddd', whiteSpace: 'nowrap' }}>
            {index + 1}
            </td>
            {allKeys.map((column) => (
            <td
                key={column}
                style={{ padding: '8px', border: '1px solid #ddd', wordWrap: 'break-word' }}
            >
                {item[column]}
            </td>
            ))}
        </tr>
        ))}
    </tbody>
    </table>
</div>
);
};

export default TableComponent;
