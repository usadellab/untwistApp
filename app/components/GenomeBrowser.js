import React, { useEffect } from "react";
import "@fontsource/roboto";
import {
  createViewState,
  JBrowseLinearGenomeView,
} from "@jbrowse/react-linear-genome-view";

// import {  createViewState, JBrowseCircularGenomeView } from "@jbrowse/react-circular-genome-view";
// import { getSnapshot, onSnapshot } from "mobx-state-tree";
import camregdata from "/public/genomeBrowser/2023_ExpressionDB_TPMs_RNAseqTracks.json";
import GSE102422data from "/public/genomeBrowser/GSE102422_RNAseqTracks.json";

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
    displayMode: "compact"
  },
  ...camregdata,
  ...GSE102422data
];



function View(props) {
  // const defaultSession = JSON.parse(JSON.stringify(data));
  var assemblyName = props.assemblyName || "Camelina";
  var chromosome = props.chromosome || "1";
  var position = parseInt(props.position) || 10000;
  var selectedAnnotationsWindowOption = props.window || 5000;

  var start = position - selectedAnnotationsWindowOption;
  var end = position + selectedAnnotationsWindowOption;

  // console.log(start, end, position)

  const defaultSession = {
    id: "linearGenomeView",
    minimized: false,
    type: "LinearGenomeView",
    offsetPx: 1373.1968112716304,
    bpPerPx: 20.300446358294575,
    displayedRegions: [
      {
        refName: "1",
        start: 0,
        end: 23241285,
        reversed: false,
        assemblyName: "Camelina",
      },
    ],
    tracks: [
      {
        id: "orMmXeJjFKxc3PTw6cYcx",
        type: "ReferenceSequenceTrack",
        configuration: "Camelina-ensemble-genome",
        minimized: false,
        displays: [
          {
            id: "v7Kzc2cLRP_l2H2ch1KdP",
            type: "LinearReferenceSequenceDisplay",
            heightPreConfig: 50,
            configuration:
              "Camelina-ensemble-genome-LinearReferenceSequenceDisplay",
            showForward: true,
            showReverse: true,
            showTranslation: true,
          },
        ],
      },
      {
        id: "McpHHJKxhCpGYSLusE1-I",
        type: "FeatureTrack",
        configuration: "untwist_GFF",
        minimized: false,
        displays: [
          {
            id: "gj-hYSrMZu_JrUNAxqylO",
            type: "LinearBasicDisplay",
            heightPreConfig: 205,
            configuration: "untwist_GFF-LinearBasicDisplay",
          },
        ],
      },
      {
        id: "IZtudhaLOXThi-i9ghs9e",
        type: "VariantTrack",
        configuration: "untwist_VCF",
        minimized: false,
        displays: [
          {
            id: "f3RjJk7t40aesB1DGH9GT",
            type: "LinearVariantDisplay",
            heightPreConfig: 205,
            configuration: "untwist_VCF-LinearVariantDisplay",
            trackShowLabels: true,
            trackShowDescriptions: false,
            trackDisplayMode: "collapse",
          },
        ],
      },
    ],
    hideHeader: false,
    hideHeaderOverview: false,
    hideNoTracksActive: true,
    trackSelectorType: "hierarchical",
    showCenterLine: true,
    showCytobandsSetting: true,
    trackLabels: "",
    showGridlines: true,
  };

  const state = new createViewState({
    assembly: assembly,
    tracks: tracks,
    disableAddTracks: true,
    configuration: {
      /* extra configuration */
    },
    plugins: [
      /* runtime plugin definitions */
    ],
    defaultSession: { name: "my-session-view", view: defaultSession },
    location: {
      refName: chromosome,
      start: start,
      end: end,
      assemblyName: assemblyName,
    },
    onChange: () => {
      /* onChange */
    },
  });

  // onSnapshot(state.session, (snapshot) => {
  //   // const selectedTrackIds = getSnapshot(snapshot.view.trackViews)
  //     // .filter((trackView) => trackView.visible)
  //     // .map((trackView) => trackView.id);

  //   console.log('Selected Track IDs:', JSON.stringify(snapshot.view));
  // });

  return <JBrowseLinearGenomeView viewState={state} />;
  // return <JBrowseCircularGenomeView viewState={state} />;
}

export default View;
