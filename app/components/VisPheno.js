"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { Autocomplete, TextField } from "@mui/material";
import { Button } from "@mui/material";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";

import { SelectedSpeciesProvider, useSelectedSpecies } from "../../contexts/SelectedSpeciesContext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { useRef } from "react";
import Papa from "papaparse";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import PlotlyPlots from "./PlotlyPlots2";
import MenuItem from "@mui/material/MenuItem";
import { FormControl, InputLabel, Select } from "@mui/material";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import { useTokenContext } from "../../contexts/TokenContext";
import { useApiContext } from "../../contexts/ApiEndPoint";
import { useUntwistThemeContext } from "../../contexts/ThemeContext";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.primary,
}));

var dbID = {
  Camelina: "camelina",
  Brassica: "brassica",
};

export function VisPheno() {
  const apiEndpoint = useApiContext().apiEndpoint;
  const { isDarkMode, toggleTheme } = useUntwistThemeContext();

  console.log(isDarkMode);
  const { selectedSpp, setSelectedSpp } = useSelectedSpecies();

  const [data, setData] = useState([]);

  // VisPehno
  const [selected_plot_type, setSelectedPlotType] = useState("");
  const [col_names, setColNames] = useState([]);
  const [col_names2, setColNames2] = useState([]);

  const [selectedXvar, setSelectedXvar] = useState("");
  const [selectedYvar, setSelectedYvar] = useState("");
  const [open, setOpen] = useState(false);
  const [isToggled, setPlotIsToggled] = useState(false);
  const [plotSchema, setPlotSchema] = useState({});
  const [isNewSchema, setIsNewSchema] = useState(0);
  const [filteredData, setFilteredData] = useState([]);

  const [plotTitle, setPlotTitle] = useState("");
  const [xLable, setXlable] = useState("");
  const [yLable, setYlable] = useState("");
  const [isMultiTrace, setIsMultiTrace] = useState(false);
  const [state, setState] = useState({});

  const token = useTokenContext();
  const [phenoFile, setPhenoFile] = useState(null);

  useEffect(() => {
    axios
      .post(`${apiEndpoint}/getBucketObjectList/?token=${token.apiToken}`)
      .then((response) => {
        let gwasFiles = [];
        let plinkFolder = response.data[dbID[selectedSpp]].Plink;
        plinkFolder.map((file) => {
          if (file.includes("fam")) {
            gwasFiles.push(file.split(".")[0]);
          }
        });
        // setInputFiles(gwasFiles);
        let phenoFile = response.data[dbID[selectedSpp]].Pheno[1];
        setPhenoFile(phenoFile);
      })
      .catch((error) => {
        alert("Error fetching getBucketObjectList from server", error);
      });
  }, []);

  const [filters, setFilters] = useState([
    { key: "", comparison: "", value: "", logicalOperator: "" },
  ]);

  const handleParsePhenoData = () => {
    axios
      .post(
        `${apiEndpoint}/getBucketObjectData/?bucket_name=${dbID[selectedSpp]}&object_name=Pheno/${phenoFile}&token=${token.apiToken}`,
        null,
        {
          responseType: "text",
        }
      )
      .then((response) => {
        var text = response.data;
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          delimiter: "\t",
          complete: function (results) {
            const data = results.data;
            setData(data);
          },
          error: function (error) {
            alert("Error fetching getBucketObjectData from server:", error);
          },
        });
      });
  };

  useEffect(() => {
    handleParsePhenoData();
  }, [phenoFile]);

  const handleStateChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const handleClose = () => {
    handlePLOT();
    setOpen(false);
  };

  useEffect(() => {
    if (
      selected_plot_type == "boxplot" ||
      selected_plot_type == "line" ||
      selected_plot_type == "violin" ||
      selected_plot_type == "raincloud" ||
      selected_plot_type == "heatMap" ||
      selected_plot_type == "density_overlay"
    ) {
      setIsMultiTrace(true);
      setOpen(true);
      var newState = {};
      setState(newState);
    } else {
      setIsMultiTrace(false);
    }
  }, [selected_plot_type]);

  useEffect(() => {
    handlePLOT();
  }, [
    selectedXvar,
    selectedYvar,
    selected_plot_type,
    plotTitle,
    xLable,
    yLable,
    isNewSchema,
    filteredData,
  ]);

  var handlePLOT = () => {
    var schema1 = {
      inputData: data,
      ploty_type: "",
      variablesToPlot: [],
      plotTitle: plotTitle,
      xLable: xLable,
      yLable: yLable,
      isDark: isDarkMode,
    };
    if (selected_plot_type === "boxplot") {
      schema1.ploty_type = "boxplot";
      schema1.variablesToPlot = Object.keys(state);
    } else if (selected_plot_type === "violin") {
      schema1.ploty_type = "violin";
      schema1.variablesToPlot = Object.keys(state);
    } else if (selected_plot_type === "line") {
      schema1.ploty_type = "line";
      schema1.variablesToPlot = Object.keys(state);
    } else if (selected_plot_type === "raincloud") {
      schema1.ploty_type = "raincloud";
      schema1.variablesToPlot = Object.keys(state);
    } else if (selected_plot_type === "heatMap") {
      schema1.ploty_type = "heatMap";
      schema1.variablesToPlot = Object.keys(state);
    } else if (selected_plot_type === "density_overlay") {
      schema1.ploty_type = "density_overlay";
      schema1.variablesToPlot = Object.keys(state);
    } else {
      schema1.ploty_type = selected_plot_type;
      schema1.variablesToPlot = [selectedXvar, selectedYvar];
    }

    if (isNewSchema == 0) {
      setPlotSchema(schema1);
    } else {
      var changedSchema = schema1;
      changedSchema.inputData = filteredData;
      setPlotSchema(changedSchema);
    }
  };

  const handleAddFilter = () => {
    setFilters([
      ...filters,
      { key: "", comparison: "", value: "", logicalOperator: "AND" },
    ]);
    setFilteredData(filteredData);
  };

  const handleRemoveFilter = (index) => {
    setFilters((prevFilters) => prevFilters.filter((_, i) => i !== index));
    setFilteredData(filteredData);
  };

  const handleResetFilters = () => {
    setFilters([{ key: "", comparison: "", value: "", logicalOperator: "" }]);
    setFilteredData(data);
  };

  const applyFilters = () => {
    const filteredData = data.filter((item) => {
      return filters.every((filter) => {
        const { key, comparison, value, logicalOperator } = filter;
        if (!key || !comparison || !value) {
          return true;
        }

        const itemValue = item[key];
        switch (comparison) {
          case "=":
            return itemValue === value;
          case "!=":
            return itemValue !== value;
          case "<":
            return itemValue < value;
          case ">":
            return itemValue > value;
          case "<=":
            return itemValue <= value;
          case ">=":
            return itemValue >= value;
          default:
            return true;
        }
      });
    });
    setFilteredData(filteredData);
    setIsNewSchema(+1);
    // console.log(filteredData)
  };

  const [checked, setChecked] = useState([false, false, false, false]);

  useEffect(() => {
    var newYcols = col_names.filter((obj) => obj.category !== "Germplasm");
    setColNames2(newYcols);
  }, [col_names]);

  // Handle checkbox toggle
  const handleToggle = (index) => () => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];

    var obj = data[0];
    var keys = Object.keys(obj || {});
    let colNames = [];
    colNames.push({ title: "Accessions", category: "Germplasm" });

    if (newChecked[3]) {
      keys.map((phenotype) => {
        if (
          !(
            phenotype.includes("under") ||
            phenotype.includes("Lipid") ||
            phenotype.includes("Accession")
          )
        ) {
          colNames.push({ title: phenotype, category: "Field Phenotypes" });
        } else if (phenotype.includes("under")) {
          colNames.push({
            title: phenotype,
            category: "Greenhouse Phenotypes",
          });
        } else if (phenotype.includes("Lipid")) {
          colNames.push({ title: phenotype, category: "Lipids" });
        }
      });

      // Define the desired category order
      const categoryOrder = [
        "Germplasm",
        "Field Phenotypes",
        "Greenhouse Phenotypes",
        "Lipids",
      ];

      // Group items by category and sort them according to the custom order
      const sortedOptions = colNames.sort((a, b) => {
        const categoryA = a.category;
        const categoryB = b.category;

        const indexA = categoryOrder.indexOf(categoryA);
        const indexB = categoryOrder.indexOf(categoryB);

        if (indexA < indexB) return -1;
        if (indexA > indexB) return 1;

        // If categories are the same, sort alphabetically by title
        return a.title.localeCompare(b.title);
      });

      setColNames(sortedOptions);
    } else {
      newChecked.map((state, index) => {
        if (state && index == 0) {
          keys.map((phenotype) => {
            if (
              !(
                phenotype.includes("under") ||
                phenotype.includes("Lipid") ||
                phenotype.includes("Accession")
              )
            ) {
              colNames.push({ title: phenotype, category: "Field Phenotypes" });
            }
          });
          const sortedOptions = colNames.sort((a, b) => {
            if (a.category === "Germplasm") return -1;
            return 0;
          });
          setColNames(sortedOptions);
        } else if (state && index == 1) {
          keys.map((phenotype) => {
            if (phenotype.includes("under")) {
              colNames.push({
                title: phenotype,
                category: "Greenhouse Phenotypes",
              });
            }
          });
          const sortedOptions = colNames.sort((a, b) => {
            if (a.category === "Germplasm") return -1;
            return 0;
          });
          setColNames(sortedOptions);
        } else if (state && index == 2) {
          keys.map((phenotype) => {
            if (phenotype.includes("Lipid")) {
              colNames.push({ title: phenotype, category: "Lipids" });
            }
          });
          const sortedOptions = colNames.sort((a, b) => {
            if (a.category === "Germplasm") return -1;
            return 0;
          });
          setColNames(sortedOptions);
        }
      });
    }

    setChecked(newChecked);
  };

  const handleToggleAll = () => {
    const allChecked = checked.every((isChecked) => isChecked);
    const newChecked = allChecked
      ? [false, false, false, false]
      : checked.map(() => true);
    setChecked(newChecked);
  };

  const categoryOrder = [
    "Germplasm",
    "Field Phenotypes",
    "Greenhouse Phenotypes",
    "Lipids",
  ];
  const [itemsByCategory, setItemsByCategory] = useState(null);

  useEffect(() => {
    let newItemsByCategory = {};
    col_names.forEach((item) => {
      if (!newItemsByCategory[item.category]) {
        newItemsByCategory[item.category] = [];
        newItemsByCategory[item.category].push(item.title);
      } else {
        newItemsByCategory[item.category].push(item.title);
      }
    });
    setItemsByCategory(newItemsByCategory);
  }, [checked]);

  return (
    <>
      <Grid sx={{ ml: 2, marginTop: 2, marginRight: 2 }}>
        <Typography variant="h4">Visualize Traits</Typography>
        <Typography variant="p">
          {`This tool allows to visualize phenotypes collected as part of untwist project. Phenotypes are available using the drop downs in the plotting Options menu. Users can also perform queries to filter the data based on any combination of phenotypes collected.
           `}
        </Typography>
        <Typography variant="p">
          <br></br>
          <b>Note: </b>In the drop down menu each entry describes{" "}
          <b>
            'Phenotype' _ 'measurement unit' _ 'Stress treatment(if any)' _
            'Growth stage/collection date(if available)' _ 'provider(if
            available)'
          </b>
        </Typography>
        <Typography variant="p">
          {" "}
          <br></br>
          <b>Abbreviations: </b>
          <b> DW: </b> dry weight,
          <b> FW: </b>fresh weight,
          <b> DW_FW: </b> DW/FW,
          <b> DAS: </b>days after sowing,
        </Typography>
      </Grid>

      <Grid sx={{ ml: 2, marginTop: 2, marginRight: 2 }}>
        <Stack spacing={2}>
          <Item
            style={{
              background: isDarkMode ? "black" : "white",
              color: isDarkMode ? "white" : "black",
            }}
            sx={{
              marginTop: 0.5,
              border: 1,
              borderColor: "blue",
            }}
          >
            <Typography sx={{ mt: 1, mb: 1 }} variant="h7" fontWeight="bold">
              Datasets
            </Typography>

            <div>
              <Box display="flex" flexDirection="row">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked[0]}
                      onClick={handleToggle(0)}
                      disableRipple
                    />
                  }
                  label="Field phenotypes"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked[1]}
                      onClick={handleToggle(1)}
                      disableRipple
                    />
                  }
                  label="Greenhouse phenotypes"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked[2]}
                      onClick={handleToggle(2)}
                      disableRipple
                    />
                  }
                  label="Lipids"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked[3]}
                      onClick={handleToggle(3)}
                      disableRipple
                    />
                  }
                  label="All"
                  onChange={handleToggleAll} // Add onChange event for the "All" checkbox
                />
              </Box>
            </div>
          </Item>

          <Grid container columnGap={12} columns={2}></Grid>
          {!checked.some((x) => x == true) || (
            <div>
              <Item
                style={{
                  background: isDarkMode ? "black" : "white",
                  color: isDarkMode ? "white" : "black",
                }}
                sx={{
                  marginTop: -3.5,
                  border: 1,
                  borderColor: "blue",
                  backgroundColor: isDarkMode ? "grey" : "white",
                }}
              >
                <Typography
                  // sx={{ mt: 0, mb: 1 }}
                  variant="h7"
                  fontWeight="bold"
                >
                  Plotting Options
                </Typography>

                <Grid
                  sx={{ mt: 1 }}
                  className="top-grid"
                  container
                  columns={2}
                  columnGap={2}
                >
                  <Autocomplete
                    size="small"
                    options={[
                      "bar",
                      "line",
                      "histogram",
                      "density_overlay",

                      "boxplot",
                      "scatter",
                      "heatMap",
                      "linReg",
                      "violin",
                      "raincloud",
                    ]}
                    sx={{ width: 200 }}
                    renderInput={(params) => (
                      <TextField {...params} label="choose plot type" />
                    )}
                    onInputChange={(e, v) => setSelectedPlotType(v)}
                  />
                  {isMultiTrace ? (
                    ""
                  ) : (
                    <Grid className="top-grid" columns={2} columnGap={2}>
                      {selected_plot_type == "histogram" ? (
                        <Autocomplete
                          id="grouped-demo"
                          options={col_names}
                          groupBy={(col_names) => col_names.category}
                          getOptionLabel={(col_names) => col_names.title}
                          sx={{ width: 455 }}
                          size="small"
                          renderInput={(params) => (
                            <TextField {...params} label="choose x-variable" />
                          )}
                          renderGroup={(params) => (
                            <li key={params.key}>
                              <strong>{params.group}</strong>
                              <ul>{params.children}</ul>
                            </li>
                          )}
                          onInputChange={(e) =>
                            setSelectedXvar(e.target.innerHTML)
                          }
                        />
                      ) : (
                        <Grid
                          // sx={{ marginTop: 2 }}
                          className="top-grid"
                          container
                          columns={2}
                          columnGap={2}
                        >
                          <Autocomplete
                            id="grouped-demo"
                            options={col_names}
                            groupBy={(col_names) => col_names.category}
                            getOptionLabel={(col_names) => col_names.title}
                            sx={{ width: 455 }}
                            size="small"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="choose x-variable"
                              />
                            )}
                            renderGroup={(params) => (
                              <li key={params.key}>
                                <strong style={{ color: "green" }}>
                                  {params.group}
                                </strong>
                                <ul>{params.children}</ul>
                              </li>
                            )}
                            onInputChange={(e) =>
                              setSelectedXvar(e.target.innerHTML)
                            }
                          />

                          <Autocomplete
                            id="grouped-demo"
                            options={col_names2}
                            groupBy={(col_names2) => col_names2.category}
                            getOptionLabel={(col_names2) => col_names2.title}
                            sx={{ width: 455 }}
                            size="small"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="choose y-variable"
                              />
                            )}
                            renderGroup={(params) => (
                              <li key={params.key}>
                                <strong style={{ color: "green" }}>
                                  {params.group}
                                </strong>
                                <ul>{params.children}</ul>
                              </li>
                            )}
                            onInputChange={(e) =>
                              setSelectedYvar(e.target.innerHTML)
                            }
                          />
                        </Grid>
                      )}
                    </Grid>
                  )}
                  <Grid
                    sx={{ marginTop: 2 }}
                    className="top-grid"
                    container
                    columns={3}
                    columnGap={2}
                  >
                    <TextField
                      size="small"
                      sx={{ width: 345 }}
                      onChange={(e) => {
                        setPlotTitle(e.target.value);
                      }}
                      label="Update  plot title (optional)"
                    ></TextField>
                    <TextField
                      size="small"
                      sx={{ width: 345 }}
                      onChange={(e) => {
                        setXlable(e.target.value);
                      }}
                      label="Update  x label (optional)"
                    ></TextField>
                    <TextField
                      size="small"
                      sx={{ width: 345 }}
                      onChange={(e) => {
                        setYlable(e.target.value);
                      }}
                      label="Update  y label (optional)"
                    ></TextField>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setPlotIsToggled(true);
                      }}
                    >
                      Plot
                    </Button>
                  </Grid>
                </Grid>
              </Item>
              <Item
                style={{
                  background: isDarkMode ? "black" : "white",
                  color: isDarkMode ? "white" : "black",
                }}
                sx={{
                  marginTop: 0.5,
                  border: 1,
                  borderColor: "blue",
                }}
              >
                <Typography variant="h7" fontWeight="bold">
                  Apply Filters (optional)
                </Typography>

                <Grid container spacing={1} sx={{ marginTop: 0.5 }}>
                  {filters.map((filter, index) => (
                    <React.Fragment key={index}>
                      <Grid item>
                        <Autocomplete
                          id="grouped-demo"
                          options={col_names}
                          groupBy={(col_names) => col_names.category}
                          getOptionLabel={(col_names) => col_names.title}
                          sx={{ width: 455 }}
                          size="small"
                          renderInput={(params) => (
                            <TextField {...params} label="choose y-variable" />
                          )}
                          renderGroup={(params) => (
                            <li key={params.key}>
                              <strong style={{ color: "green" }}>
                                {params.group}
                              </strong>
                              <ul>{params.children}</ul>
                            </li>
                          )}
                          onChange={(event, newValue) => {
                            setFilters((prevFilters) =>
                              prevFilters.map((prevFilter, i) =>
                                i === index
                                  ? { ...prevFilter, key: newValue.title }
                                  : prevFilter
                              )
                            );
                          }}
                        />
                      </Grid>

                      <Grid item>
                        <FormControl fullWidth>
                          <InputLabel size="small">Comparison</InputLabel>
                          <Select
                            size="small"
                            sx={{ width: 265 }}
                            value={filter.comparison}
                            onChange={(event) => {
                              setFilters((prevFilters) =>
                                prevFilters.map((prevFilter, i) =>
                                  i === index
                                    ? {
                                        ...prevFilter,
                                        comparison: event.target.value,
                                      }
                                    : prevFilter
                                )
                              );
                            }}
                          >
                            <MenuItem value="=">=</MenuItem>
                            <MenuItem value="!=">≠</MenuItem>
                            <MenuItem value="<">{"<"}</MenuItem>
                            <MenuItem value=">">{">"}</MenuItem>
                            <MenuItem value="<=">{"≤"}</MenuItem>
                            <MenuItem value=">=">{"≥"}</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item>
                        <TextField
                          size="small"
                          sx={{ width: 265 }}
                          value={filter.value}
                          onChange={(event) => {
                            setFilters((prevFilters) =>
                              prevFilters.map((prevFilter, i) =>
                                i === index
                                  ? {
                                      ...prevFilter,
                                      value: event.target.value,
                                    }
                                  : prevFilter
                              )
                            );
                          }}
                          label="Comparison Value"
                          // fullWidth
                        />
                      </Grid>

                      <Grid item>
                        {index < filters.length - 1 && (
                          <FormControl>
                            <InputLabel sx={{ ml: 1, mr: 1 }} size="small">
                              Logical Operator
                            </InputLabel>
                            <Select
                              sx={{ width: 200 }}
                              size="small"
                              value={filter.logicalOperator}
                              onChange={(event) => {
                                setFilters((prevFilters) =>
                                  prevFilters.map((prevFilter, i) =>
                                    i === index
                                      ? {
                                          ...prevFilter,
                                          logicalOperator: event.target.value,
                                        }
                                      : prevFilter
                                  )
                                );
                              }}
                            >
                              <MenuItem value="AND">AND</MenuItem>
                              <MenuItem value="OR">OR</MenuItem>
                            </Select>
                          </FormControl>
                        )}

                        {index === filters.length - 1 && (
                          <Button
                            sx={{ ml: 1, mr: 1, height: 40 }}
                            size="large"
                            variant="outlined"
                            onClick={handleAddFilter}
                          >
                            Add Filter
                          </Button>
                        )}

                        {filters.length > 1 && (
                          <Button
                            sx={{ ml: 2, mr: 2 }}
                            size="small"
                            variant="outlined"
                            onClick={() => handleRemoveFilter(index)}
                          >
                            Remove Filter
                          </Button>
                        )}
                      </Grid>
                    </React.Fragment>
                  ))}

                  <Grid
                    sx={{ mt: 1, mr: 2, ml: 0 }}
                    container
                    xs={12}
                    justifyContent="left"
                  >
                    <Button
                      sx={{ ml: 1, mr: 1 }}
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={handleResetFilters}
                      // fullWidth
                    >
                      Reset Filters
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={applyFilters}
                      // fullWidth
                    >
                      Apply Filters
                    </Button>
                  </Grid>
                </Grid>
              </Item>
              {!isToggled || (
                <Item
                  style={{ background: isDarkMode ? "black" : "white" }}
                  sx={{ marginTop: 1, border: 1, borderColor: "lightblue" }}
                >
                  <PlotlyPlots plotSchema={plotSchema} />
                </Item>
              )}
            </div>
          )}
        </Stack>

        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="lg"
          PaperProps={{ style: { background: isDarkMode ? "grey" : "white" } }}
        >
          <DialogTitle>Select variables</DialogTitle>
          <DialogContent>
            <div>
              {categoryOrder
                .filter(
                  (category) =>
                    itemsByCategory !== null && itemsByCategory[category]
                )
                .map((category) => (
                  <div key={category}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", marginBottom: 2 }}
                      color="green"
                    >
                      {category}
                    </Typography>
                    <FormGroup
                      variant="standard"
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                      {itemsByCategory !== null &&
                        itemsByCategory[category]?.map((item) => (
                          <div
                            key={item}
                            style={{ width: "480px", marginRight: "16px" }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onChange={handleStateChange}
                                  name={item}
                                />
                              }
                              label={item}
                            />
                          </div>
                        ))}
                    </FormGroup>
                  </div>
                ))}
            </div>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}
