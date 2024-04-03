"use client"
import React, { useRef, useEffect } from 'react';
import Tree from 'react-phylotree';

const PhyloTree = ({ newickString }) => {
  const treeRef = useRef(null);

  useEffect(() => {
    if (newickString && treeRef.current) {
      // Access the Tree component through the current property of the ref
      treeRef.current.newick = newickString;
    }
  }, [newickString]);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Tree ref={treeRef} width={600} height={400} />
    </div>
  );
};

export default PhyloTree;

