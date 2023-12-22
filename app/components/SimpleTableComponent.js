// import React from 'react';

// const TableComponent = (props) => {
//     var data = props.data;

//     if (!data || data.length === 0) {
//       return <div>No Results Found, try changing the threshold</div>;
//     }
  
//     // Columns for which unique values should be maintained
//     const uniqueColumns = ['SNP ID', 'Chr', 'Position', 'REF/ALT allele'];
  
//     // Create an object to store previous values for each unique column
//     const prevValuesMap = {};
//     uniqueColumns.forEach((column) => {
//       prevValuesMap[column] = null;
//     });
  
//     // Find the unique list of keys from all the objects in the input data array
//     const allKeys = Array.from(new Set(data.flatMap((item) => Object.keys(item))));
  
//     return (
//       <div style={{ overflowX: 'auto' }}>
//         <table style={{ borderCollapse: 'collapse', width: '100%' }}>
//           <thead>
//             <tr >
//               {/* <th style={{ padding: '8px', border: '1px solid #ddd', whiteSpace: 'nowrap' }}>
//                 Serial No
//               </th> */}
//               {allKeys.map((column) => (
//                 <th
//                   key={column}
//                   style={{ padding: '8px', border: '1px solid #ddd', whiteSpace: 'nowrap' }}
//                 >
//                   {column}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item, index) => {
//               const newItem = {};
//               allKeys.forEach((key) => {
//                 if (uniqueColumns.includes(key)) {
//                   if (key === 'SNP ID') {
//                     // Reset previous values to empty strings when 'SNP ID' changes
//                     prevValuesMap[key] = item[key] !== prevValuesMap[key] ? item[key] : '';
//                   } else {
//                     newItem[key] = item[key] !== prevValuesMap[key] ? item[key] : '';
//                     prevValuesMap[key] = item[key];
//                   }
//                 } else {
//                   newItem[key] = item[key] || 'NA';
//                 }
//               });
  
//               return (
//                 <tr key={index}>
//                   {/* <td style={{ padding: '8px', border: '1px solid #ddd', whiteSpace: 'nowrap' }}>
//                     {index + 1}
//                   </td> */}
//                   {allKeys.map((column) => (
//                     <td
//                       key={column}
//                       style={{ padding: '8px', border: '1px solid #ddd', wordWrap: 'break-word' }}
//                     >
//                       {newItem[column]}
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

// export default TableComponent;


import React from 'react';

const TableComponent = (props) => {
  const data = props.data;

  if (!data || data.length === 0) {
    return <div>No Results Found, try changing the threshold</div>;
  }

  // Define the desired column order
  const columnOrder = ['Chr', 'Position', 'REF/ALT allele', 'ID', 'Protein Name', 'DESCRIPTION'];

  // Columns for which unique values should be maintained
  const uniqueColumns = ['SNP ID', 'Chr', 'Position', 'REF/ALT allele'];

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
