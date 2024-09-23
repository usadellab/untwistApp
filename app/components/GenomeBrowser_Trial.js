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

import React, { useEffect, useState } from "react";
import "@fontsource/roboto";
// import {
//   createViewState,
//   JBrowseLinearGenomeView,
// } from "@jbrowse/react-linear-genome-view";
import { Button, Grid } from "@mui/material";
// import { getSnapshot, onSnapshot } from "mobx-state-tree";

// import {
//   createViewState,
//   JBrowseCircularGenomeView,
// } from '@jbrowse/react-circular-genome-view'


import LinearGenomeView1 from "./LinearGenomeView";
import CircularGenomeView1 from "./CircularGenomeView";

const assembly = {
  name: "Camelina",
  sequence: {
    type: "ReferenceSequenceTrack",
    trackId: "Camelina-ensemble-genome",
    adapter: {
      type: "BgzipFastaAdapter",
      fastaLocation: {
        uri: "/genomeBrowser/camelinaGenome.fa.gz",
        // locationType: 'UriLocation',
      },
      faiLocation: {
        uri: "/genomeBrowser/camelinaGenome.fa.gz.fai",
        // locationType: 'UriLocation',
      },
      gziLocation: {
        uri: "/genomeBrowser/camelinaGenome.fa.gz.gzi",
        // locationType: 'UriLocation',
      },
    },
  },
};

const tracks = [
  {
    type: "FeatureTrack",
    trackId: "untwist_GFF",
    name: "Structural Annotations",
    assemblyNames: ["Camelina"],
    category: ["Annotation"],
    adapter: {
      type: "Gff3TabixAdapter",
      gffGzLocation: {
        uri: "/genomeBrowser/genomic.gff.gz",
        locationType: "UriLocation",
      },
      index: {
        location: {
          uri: "/genomeBrowser/genomic.gff.gz.tbi",
          locationType: "UriLocation",
        },
      },
    },
  },
  {
    type: "VariantTrack",
    trackId: "untwist_VCF",
    name: "Untwist Variant",
    assemblyNames: ["Camelina"],
    category: ["Variation data"],
    adapter: {
      type: "VcfTabixAdapter",
      vcfGzLocation: {
        uri: "/genomeBrowser/UNT54.lifted.sorted.vcf.bgzip",
        locationType: "UriLocation",
      },
      index: {
        location: {
          uri: "/genomeBrowser/UNT54.lifted.sorted.vcf.bgzip.tbi",
          locationType: "UriLocation",
        },
      },
    },
  },
  {
    type: 'QuantitativeTrack',
    trackId: 'RNA_seq_counts_DH55_root_rep1',
    name: 'DH55: root(control-rep1)',
    assemblyNames: ["Camelina"],
    category: ["Expression Counts"],
    adapter: {
      type: 'BigWigAdapter',
      bigWigLocation: {
        uri: "/genomeBrowser/DH55_root_rep1.bw", // Replace with the actual URL to your BigWig file
      },
    },
  },
  {
    type: 'QuantitativeTrack',
    trackId: 'RNA_seq_counts_DH55_root_rep2',
    name: 'DH55: root(control-rep2)',
    assemblyNames: ["Camelina"],
    category: ["Expression Counts"],
    adapter: {
      type: 'BigWigAdapter',
      bigWigLocation: {
        uri: "/genomeBrowser/DH55_root_rep2.bw", // Replace with the actual URL to your BigWig file
      },
    },
  },

  {
    type: 'QuantitativeTrack',
    trackId: 'RNA_seq_counts_DH55_root_rep3',
    name: 'DH55: root(control-rep3)',
    assemblyNames: ["Camelina"],
    category: ["Expression Counts"],
    adapter: {
      type: 'BigWigAdapter',
      bigWigLocation: {
        uri: "/genomeBrowser/DH55_root_rep3.bw", // Replace with the actual URL to your BigWig file
      },
    },
  },

  {
    type: 'QuantitativeTrack',
    trackId: 'RNA_seq_counts_DH55_salt_root_rep1',
    name: 'DH55: root(salt-rep1)',
    assemblyNames: ["Camelina"],
    category: ["Expression Counts"],
    adapter: {
      type: 'BigWigAdapter',
      bigWigLocation: {
        uri: "/genomeBrowser/DH55_salt_root_rep1.bw", // Replace with the actual URL to your BigWig file
      },
    },
  },

  {
    type: 'QuantitativeTrack',
    trackId: 'RNA_seq_counts_DH55_salt_root_rep2',
    name: 'DH55: root(salt-rep2)',
    assemblyNames: ["Camelina"],
    category: ["Expression Counts"],
    adapter: {
      type: 'BigWigAdapter',
      bigWigLocation: {
        uri: "/genomeBrowser/DH55_salt_root_rep2.bw", // Replace with the actual URL to your BigWig file
      },
    },
  },

  {
    type: 'QuantitativeTrack',
    trackId: 'RNA_seq_counts_DH55_salt_root_rep3',
    name: 'DH55: root(salt-rep3)',
    assemblyNames: ["Camelina"],
    category: ["Expression Counts"],
    adapter: {
      type: 'BigWigAdapter',
      bigWigLocation: {
        uri: "/genomeBrowser/DH55_salt_root_rep3.bw", // Replace with the actual URL to your BigWig file
      },
    },
  },
  {
    type: 'QuantitativeTrack',
    trackId: 'RNA_seq_counts_DH55_shoot_rep1',
    name: 'DH55: shoot(control-rep1)',
    assemblyNames: ["Camelina"],
    category: ["Expression Counts"],
    adapter: {
      type: 'BigWigAdapter',
      bigWigLocation: {
        uri: "/genomeBrowser/DH55_shoot_rep1.bw", // Replace with the actual URL to your BigWig file
      },
    },
  },
  {
    type: 'QuantitativeTrack',
    trackId: 'RNA_seq_counts_DH55_shoot_rep2',
    name: 'DH55: shoot(control-rep2)',
    assemblyNames: ["Camelina"],
    category: ["Expression Counts"],
    adapter: {
      type: 'BigWigAdapter',
      bigWigLocation: {
        uri: "/genomeBrowser/DH55_shoot_rep2.bw", // Replace with the actual URL to your BigWig file
      },
    },
  },
  {
    type: 'QuantitativeTrack',
    trackId: 'RNA_seq_counts_DH55_shoot_rep3',
    name: 'DH55: shoot(control-rep3)',
    assemblyNames: ["Camelina"],
    category: ["Expression Counts"],
    adapter: {
      type: 'BigWigAdapter',
      bigWigLocation: {
        uri: "/genomeBrowser/DH55_shoot_rep3.bw", // Replace with the actual URL to your BigWig file
      },
    },
  },

  {
    type: 'QuantitativeTrack',
    trackId: 'RNA_seq_counts_DH55_salt_shoot_rep1',
    name: 'DH55: shoot(salt-rep1)',
    assemblyNames: ["Camelina"],
    category: ["Expression Counts"],
    adapter: {
      type: 'BigWigAdapter',
      bigWigLocation: {
        uri: "/genomeBrowser/DH55_salt_shoot_rep1.bw", // Replace with the actual URL to your BigWig file
      },
    },
  },
  {
    type: 'QuantitativeTrack',
    trackId: 'RNA_seq_counts_DH55_salt_shoot_rep2',
    name: 'DH55: shoot(salt-rep2)',
    assemblyNames: ["Camelina"],
    category: ["Expression Counts"],
    adapter: {
      type: 'BigWigAdapter',
      bigWigLocation: {
        uri: "/genomeBrowser/DH55_salt_shoot_rep2.bw", // Replace with the actual URL to your BigWig file
      },
    },
  },
  {
    type: 'QuantitativeTrack',
    trackId: 'RNA_seq_counts_DH55_salt_shoot_rep3',
    name: 'DH55: shoot(salt-rep3)',
    assemblyNames: ["Camelina"],
    category: ["Expression Counts"],
    adapter: {
      type: 'BigWigAdapter',
      bigWigLocation: {
        uri: "/genomeBrowser/DH55_salt_shoot_rep3.bw", // Replace with the actual URL to your BigWig file
      },
    },
  },  
];




function View(props) {
  const [isViewLinear, setIsViewLinear] = useState(true)

  // const defaultSession = JSON.parse(JSON.stringify(data));
  var assemblyName = props.assemblyName || "Camelina"
  var chromosome = props.chromosome || "1"
  var position = parseInt(props.position) || 10000
  var selectedAnnotationsWindowOption = props.window || 5000;

  var start = position - selectedAnnotationsWindowOption;
  var end = position + selectedAnnotationsWindowOption;

  // console.log(start, end, position)

//   const defaultSession = {
//     id: "linearGenomeView",
//     minimized: false,
//     type: "LinearGenomeView",
//     offsetPx: 0,
//     bpPerPx: 0.7541478129713424,
//     displayedRegions: [
//       {
//         refName: chromosome,
//         start: start,
//         end: end,
//         reversed: false,
//         assemblyName: assemblyName
//     }
//     ],
//     tracks: [
//         {
//             id: "orMmXeJjFKxc3PTw6cYcx",
//             type: "ReferenceSequenceTrack",
//             configuration: "Camelina-ensemble-genome",
//             minimized: false,
//             displays: [
//                 {
//                     id: "v7Kzc2cLRP_l2H2ch1KdP",
//                     type: "LinearReferenceSequenceDisplay",
//                     heightPreConfig: 160,
//                     configuration: "Camelina-ensemble-genome-LinearReferenceSequenceDisplay",
//                     showForward: true,
//                     showReverse: true,
//                     showTranslation: true
//                 }
//             ]
//         },
//         {
//             id: "McpHHJKxhCpGYSLusE1-I",
//             type: "FeatureTrack",
//             configuration: "untwist_GFF",
//             minimized: false,
//             displays: [
//                 {
//                     id: "77HW-PCKCc3-hiYkHZWQx",
//                     type: "LinearBasicDisplay",
//                     configuration: "untwist_GFF-LinearBasicDisplay"
//                 }
//             ]
//         },
//         {
//             id: "IZtudhaLOXThi-i9ghs9e",
//             type: "VariantTrack",
//             configuration: "untwist_VCF",
//             minimized: false,
//             displays: [
//                 {
//                     id: "f3RjJk7t40aesB1DGH9GT",
//                     type: "LinearVariantDisplay",
//                     configuration: "untwist_VCF-LinearVariantDisplay"
//                 }
//             ]
//         }
//     ],
//     hideHeader: false,
//     hideHeaderOverview: false,
//     hideNoTracksActive: true,
//     trackSelectorType: "hierarchical",
//     showCenterLine: true,
//     showCytobandsSetting: true,
//     trackLabels: "",
//     showGridlines: true
// }




  // const state = new createViewState({
  //   assembly: assembly,
  //   tracks: tracks,
  //   configuration: {
  //     /* extra configuration */
  //   },
  //   plugins: [
  //     /* runtime plugin definitions */
  //   ],
  //   // defaultSession: {name : 'my-session-view', view : defaultSession},
  //   location:  {
  //           refName: chromosome,
  //           start: start,
  //           end: end,
  //           assemblyName: assemblyName
  //         },
  //   onChange: () => {
  //     /* onChange */
  //   },
  // })

  var viewStateData = {
    assembly: assembly,
    tracks: tracks,
    configuration: {
      /* extra configuration */
    },
    plugins: [
      /* runtime plugin definitions */
    ],
    // defaultSession: {name : 'my-session-view', view : defaultSession},
    location:  {
            refName: chromosome,
            start: start,
            end: end,
            assemblyName: assemblyName
          },
    onChange: () => {
      /* onChange */
    },
  }



  // onSnapshot(state.session, (snapshot) => {
  //   // const selectedTrackIds = getSnapshot(snapshot.view.trackViews)
  //     // .filter((trackView) => trackView.visible)
  //     // .map((trackView) => trackView.id);

  //   console.log('Selected Track IDs:', JSON.stringify(snapshot.view));
  // });


  // const handleView = () => {
  //   setIsViewLinear(!isViewLinear)
  //   console.log(isViewLinear)
  // }



  return  ( <>
  <Grid sx={{mt: 1, ml:0, mb:1}} container spacing={2}>
    <Grid item >

    <Button variant="outlined" onClick={(e) => {setIsViewLinear(true)}} >Linear View</Button>

    </Grid>

    <Grid item >
  <Button variant="outlined" onClick={(e) => {setIsViewLinear(false)}}>Circular View</Button>

    </Grid>
    

  </Grid>

  {  !isViewLinear ? 
  
  <CircularGenomeView1  />
  
  :
  
  <LinearGenomeView1 viewStateData={viewStateData}/>

}
  </>)
}

export default View;
