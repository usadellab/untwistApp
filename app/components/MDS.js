"use client";
import * as React from "react";
import { Button } from "@mui/material";
import axios from "axios";

import { useSelectedSpecies } from "../../contexts/SelectedSpeciesContext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import PlotlyPlots from "./PlotlyPlots2";

import MessageWithTimer from "./MessageDisplay";
import { useUntwistThemeContext } from "../../contexts/ThemeContext"
import { UntwistThemeProvider } from "../../contexts/ThemeContext";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { useTokenContext } from "../../contexts/TokenContext";

var dbID = {
  Camelina: "camelina",
  Brassica: "brassica",
};

export default function MDS(props) {
  const { isDarkMode, toggleTheme } = useUntwistThemeContext();
  const [startMDS, setStartMDS] = useState(false);
  const {mdsData, setMdsData} = useAppDataContext()
  const [displayMessage, setDisplayMessage] = useState([]);
  const {apiToken, setApiToken} = useTokenContext();

  const runMDS = () => {
    setStartMDS(true);
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
    if (startMDS) {
      var msgs = [];
      const plinkWorker = new Worker("/wasm/plink-worker.js"); // Adjust the path to your worker script
      plinkWorker.postMessage({
        cmd: "runMDS",
        token: apiToken,
        spp: "camelina",
      });
      plinkWorker.onmessage = (e) => {
        if (e.data.cmd === "processed") {
          setMdsData(e.data.res);
          localStorage.setItem('mdsData', JSON.stringify(e.data.res, " "));
          setModalIsOpen(false);
          setTimeElapsed(0);
        } else if (e.data.cmd === "message") {
          msgs.push(e.data.res);
          setDisplayMessage(msgs);
        }
      };
    }
    setStartMDS(false);
    setTimeElapsed(0);
  }, [startMDS]);

  // useEffect(() => {
  //   const localMdsData = JSON.parse(localStorage.getItem('mdsData'));
  //   if (localMdsData) {
  //     setMdsData(localMdsData);
  //   }
  // }, []);


  return (
    <>
    <UntwistThemeProvider values={{isDarkMode, toggleTheme}}>

      {!modalIsOpen || (
        <MessageWithTimer messages={displayMessage} timeElapsed={timeElapsed} />
      )}

        <Grid sx={{ ml:2,marginTop: 2, marginBottom: 2, marginRight: 2 }}>
          <Typography variant="h4">Multidimentional Scaling</Typography>

          <Typography variant="p">
            {`This tool computes and visualizes MDS coordinates based on the same genotypic data available for GWAS analyisis.`}
          </Typography>
        </Grid>
          <div padding={2}>
            <Button
              sx={{ marginLeft: 1, marginBottom:2  }}
              variant="contained"
              onClick={runMDS}
              color="primary"
            >
              perform MDS
            </Button>

            {!mdsData || (
              <div>
                <PlotlyPlots
                  plotSchema={{
                    ploty_type: "mds",
                    inputData: mdsData,
                    variablesToPlot: ["C1", "C2"],
                    plotTitle: "Multidimentional Scaling",
                    xLable: "MDS Coordinate 1",
                    yLable: "MDS Coordinate 2",
                    isDark : isDarkMode
                  }}
                />
              </div>
            )}
          </div>


    </UntwistThemeProvider>

    </>
  );
}


