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

