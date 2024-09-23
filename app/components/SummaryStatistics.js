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

"use client";
import * as React from "react";
import { Button, Stack } from "@mui/material";
import axios from "axios";

import { useSelectedSpecies } from "../../contexts/SelectedSpeciesContext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import PlotlyPlots from "./PlotlyPlots2";

import MessageWithTimer from "./MessageDisplay";
import { useUntwistThemeContext } from "../../contexts/ThemeContext";
import { UntwistThemeProvider } from "../../contexts/ThemeContext";
import {
  AppDataContextProvider,
  useAppDataContext,
} from "../../contexts/AppDataContext";
import { useTokenContext } from "../../contexts/TokenContext";
import { Paper } from "@material-ui/core";
import SummaryTable from "./SummaryTable";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import ChromosomePlot from "./ChromoMap";
import ChromosomeMap from "./ChromosomePlot";

import chrLengths from "/public/chromsizes.json";
import BarPlot from "./BarPlot";
import LinesCanvas from "./Lines";
var dbID = {
  Camelina: "camelina",
  Brassica: "brassica",
};

export default function SummaryStatistics(props) {
  const { isDarkMode, toggleTheme } = useUntwistThemeContext();
  const { startSummarize, setStartSummarize } = useAppDataContext();
  const { hweData, setHWEData } = useAppDataContext();
  const { hweIsDone, setHWEisDone } = useAppDataContext();
  const { hwePlotData, setHWEplotData } = useAppDataContext();
  const { showHWEplot, setShowHWEplot } = useAppDataContext();
  const { chromosomeData, setChromosomeData } = useAppDataContext();
  const [displayMessage, setDisplayMessage] = useState([]);
  const { apiToken, setApiToken } = useTokenContext();
  const [displayChrPlot, setDisplayChrPlot] = useState(false);

  const [checkedItems, setCheckedItems] = useState({
    Heterozygosity: false,
    HWE: false,
    AF: false,
    all: false,
  });

  const handleCheckboxChange = (name) => {
    if (name === "all") {
      const allChecked = !checkedItems.all;

      setCheckedItems({
        Heterozygosity: allChecked,
        HWE: allChecked,
        AF: allChecked,
        all: allChecked,
      });
    } else {
      setCheckedItems((prev) => ({
        ...prev,
        [name]: !prev[name],
        all: false,
      }));
    }
  };

  const runSummaryStatistics = () => {
    setHWEisDone(false);
    setStartSummarize(true);
    setModalIsOpen(true);
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (modalIsOpen) {
      const interval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [modalIsOpen]);

  useEffect(() => {
    if (startSummarize) {
      const statistics = Object.keys(checkedItems).filter(
        (key) => checkedItems[key]
      );
      var msgs = [];
      const plinkWorker = new Worker("/plink-worker.js"); // Adjust the path to your worker script
      plinkWorker.postMessage({
        cmd: "runSummaryStatistics",
        statistics: statistics,
        token: apiToken,
        spp: "camelina",
        // threshold : 0.00000005, the threshold can be provided here as well as on the plotting stage
      });
      plinkWorker.onmessage = (e) => {
        if (e.data.cmd === "processedHWE") {
          setHWEData(e.data.res);
          setModalIsOpen(false);
          setStartSummarize(false);
          setTimeElapsed(0);
          setHWEisDone(true);
        } else if (e.data.cmd === "message") {
          msgs.push(e.data.res);
          setDisplayMessage(msgs);
        }
      };
    }
    setStartSummarize(false);

    setTimeElapsed(0);
  }, [startSummarize]);


  // useEffect(() => {
  //   setHWEisDone(true)
  //   setChromosomeData([{name : 'Chr 1', length : 23241285, positions : [1000000, 2000000, 4000000, 23241285] }]    )
  // })





  useEffect(() => {
    if (hweIsDone) {
      const chromMapWorker = new Worker("/workers/ChromMapWorker.js"); // Adjust the path to your worker script
      chromMapWorker.postMessage({
        cmd: "calculateHweMap",
        hweData: hweData,
        token: apiToken,
        spp: "camelina",
        ChrLengths: chrLengths,
      });
      chromMapWorker.onmessage = (e) => {
        if (e.data.cmd === "processedHweMap") {
          setChromosomeData(e.data.result);
          setShowHWEplot(true);
          setDisplayChrPlot(true)
        }
      };
    }
  }, [hweIsDone]);

  


  return (
    <>
      <UntwistThemeProvider values={{ isDarkMode, toggleTheme }}>
        <AppDataContextProvider>
          {!modalIsOpen || (
            <MessageWithTimer
              messages={displayMessage}
              timeElapsed={timeElapsed}
            />
          )}

          <Grid sx={{ ml: 2, marginTop: 2, marginBottom: 2, marginRight: 2 }}>
            <Typography variant="h4">Summary Statistics</Typography>

            <Typography variant="p">
              {`This tool computes and visualizes MDS coordinates based on the same genotypic data available for GWAS analyisis.`}
            </Typography>
          </Grid>

          <Grid
            container
            direction="row"
            // justifyContent="space-between"
            alignItems="flex-start"
          >
            <Stack direction="row" spacing={2}>
              {Object.keys(checkedItems).map((name, index) => (
                <FormControlLabel
                  key={name}
                  control={
                    <Checkbox
                      checked={checkedItems[name]}
                      onChange={() => handleCheckboxChange(name)}
                      disableRipple
                    />
                  }
                  label={name}
                />
              ))}
            </Stack>

            <Button
              sx={{ marginLeft: 4, marginBottom: 2 }}
              variant="contained"
              onClick={runSummaryStatistics}
              color="primary"
            >
              Compute Summary Statistics
            </Button>
          </Grid>

          {!showHWEplot || (
            <div style={{ padding: "20px" }}>
              <Typography
                variant="h6"
                sx={{
                  display: { md: "flex" },
                  fontFamily: "-apple-system",
                  textDecoration: "none",
                }}
              >
                The exact test of HWE
              </Typography>

              <Typography variant="body1" paragraph>
                <b>Description: </b> The test is grounded on the null hypothesis
                that observed genotype frequencies do not significantly differ
                from those predicted for a population in equilibrium. A
                noteworthy p-value (highlighted in green) signifies a departure
                from Hardy-Weinberg Equilibrium (HWE), implying potential
                factors such as inbreeding, population stratification, and
                genotyping issues. In samples of affected individuals, these
                deviations may also offer insights into potential associations.
                The subsequent analysis is conducted using Plink software, with
                the exact test of HWE implementation based on the methodology
                outlined by Wigginton et al. (2005).
              </Typography>

              <Typography variant="body1" paragraph>
                <b>Reference: </b> Wigginton JE, Cutler DJ, Abecasis GR. A note
                on exact tests of Hardy-Weinberg equilibrium. Am J Hum Genet.
                2005 May;76(5):887-93. doi: 10.1086/429864. Epub 2005 Mar 23.
                PMID: 15789306; PMCID: PMC1199378.
              </Typography>

              {/* <ChromosomePlot data={chromosomeData} threshold={0.001} /> */}

              <h3>Chromosome Plot</h3>

              {/* <ChromosomePlot
  data={[
    { name: 'chr 1', length: 1000, positions: [5, 100, 150] },
    { name: 'chr 2', length: 800, positions: [10, 30, 80, 499 ] }
    // Add more chromosomes as needed
  ]}
/> */}

{/* <BarPlot  data={[
    { name: 'chr 1', length: 10000, positions: [5, 100, 150, 500] },
    { name: 'chr 2', length: 8000, positions: [10, 30, 80, 499 ] }
    // Add more chromosomes as needed
  ]} /> */}

{!displayChrPlot ||

<div dangerouslySetInnerHTML={{ __html: chromosomeData }} />
}


            </div>
          )}



        </AppDataContextProvider>
      </UntwistThemeProvider>
    </>
  );
}
