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

// 'use client'
// import React from 'react';
// import { useRef, useEffect } from 'react';
// // import PhyloTree from './PhyloTree';
// // import Tree from 'react-phylotree';

// import Tree from 'phylotree';

// const PhyloTreeComp = () => {

// const treeRef = useRef(null);

// useEffect(() => {

// const newickString = "(C:2,((A:2,B:3):3,(D:2,E:1):2):2);"
// if (treeRef.current) {
//     treeRef.current.newick = newickString;
// }
// }, []);

// return (
// <div style={{ width: '100%', height: '400px' }}>
//     <h2>Phylogenetic Tree</h2>
//     <Tree ref={treeRef} width={600} height={400} />
// </div>
// );
// };

// export default PhyloTreeComp;



// import React, { useRef, useEffect } from 'react';
// import Phylocanvas from 'phylocanvas';

// const PhyloTreeComp = () => {
//   const treeRef = useRef(null);

//   useEffect(() => {
//     const newickString = "(C:2,((A:2,B:3):3,(D:2,E:1):2):2);";
//     if (treeRef.current) {
//         const phylocanvas = Phylocanvas.create(treeRef.current, {
//             dimensions: {
//                 width: 600,
//                 height: 400
//             }
//         });
//         phylocanvas.load(newickString);
//     }
//   }, []);

//   return (
//     <div style={{ width: '100%', height: '400px' }}>
//         <h2>Phylogenetic Tree</h2>
//         <div ref={treeRef}></div>
//     </div>
//   );
// };

// export default PhyloTreeComp;

import React from 'react'
// import Tree from 'react-phylotree';
import { useRef, useEffect } from 'react';



export default function PhyloTreeComp() {
    console.log(Tree)

    const newickString = "(A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5,(F:0.3,G:0.4,(H:0.2,I:0.3)J:0.5)K:0.6)L;";


    return (
      <div>
        <h2>Phylogenetic Tree</h2>
        {/* <Tree newick={newickString} /> */}
      </div>
    );
  };
  
