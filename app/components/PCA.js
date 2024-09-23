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

'use client'
import React from "react";
import PlotlyPlots from "./PlotlyPlots2";
import { Typography, Button, Grid } from "@mui/material";
import { useUntwistThemeContext } from "../../contexts/ThemeContext";
import axios from "axios";
import { useApiContext } from "../../contexts/ApiEndPoint";
import { useTokenContext } from "../../contexts/TokenContext";
import { useAppDataContext } from "../../contexts/AppDataContext";


export default function PCA() {
  const { pcaData, setPCAData } = useAppDataContext();
  const { isDarkMode, toggleTheme } = useUntwistThemeContext();
  const apiEndpoint = useApiContext().apiEndpoint;
  const {apiToken, setApiToken} = useTokenContext();


  // console.log(isDarkMode)

  const handlePCA = () => {
    setPCAData(null);
    function parseQassoc(fileContent, delimiter) {
      const rows = fileContent.split("\n");
      const header = rows
        .shift()
        .split(delimiter)
        .filter((value) => value !== "");
      const resultArray = [];

      rows.forEach((row) => {
        const columns = row.split(delimiter).filter((value) => value !== "");
        const obj = {};

        columns.forEach((column, index) => {
          const key = header[index];
          const value = column;
          obj[key] = value;
        });

        resultArray.push(obj);
      });

      return resultArray;
    }


    axios
      .post(
        `${apiEndpoint}/getBucketObjectData/?bucket_name=camelina&object_name=Plink/precomputed.plink.cov.pca&token=${apiToken}`,
        { responseType: "text/plain" }
      )
      .then((response) => {
        setPCAData(parseQassoc(response.data, "\t"));
      });
  };

  return (
    <Grid sx={{ ml: 2, marginTop: 2, marginBottom: 2, marginRight: 2 }}>
      <Typography variant="h4">Principal component Analysis</Typography>

      <Typography variant="p">
        {`This tool visualizes the precomputed PCA coordinates based on the same genotypic data available for GWAS analyisis.`}
      </Typography>

      <div padding={2}>
        <Button
          sx={{ marginLeft: 1, marginBottom: 2 }}
          variant="contained"
          onClick={handlePCA}
          color="primary"
        >
          PCA plot
        </Button>

        {!pcaData || (
          <div>
            <PlotlyPlots
              plotSchema={{
                ploty_type: "pca",
                inputData: pcaData,
                variablesToPlot: ["COV1", "COV2"],
                plotTitle: "Principle Component Analysis",
                xLable: "PC1",
                yLable: "PC2",
                isDark: isDarkMode,
              }}
            />
          </div>
        )}
      </div>
    </Grid>
  );
}
