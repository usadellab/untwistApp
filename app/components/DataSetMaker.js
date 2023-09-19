import React from "react";
import {
  Grid,
  Typography,
  Tabs,
  Tab,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";

import { useSelectedSpecies } from "../../contexts/SelectedSpeciesContext";
import ProjectDataDescription from "./ProjectDataDescription";

const DataSetMaker = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const { selectedSpp, setSelectedSpp } = useSelectedSpecies();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCardClick = (label) => {
    setSelectedSpp(label);
    setActiveTab(1); 
  };

  const dataTypes = [
    {
      label: "Camelina",
      imageSrc: "./camelina.jpg",
      description: "Explore Untwist datasets for Camelina ...",
    },

    // {
    //     label: 'Brassica',
    //     imageSrc: './rapeseed.jpg',
    //     description: 'Explore Untwist datasets for Brassica ...'
    // },
    // Add more dataTypes
  ];

  return (
    <div>
      <Typography
        sx={{ mt: 1, ml: 1, marginBottom: 3 }}
        variant="h4"
        gutterBottom
      >
        Select datasets
      </Typography>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Plant Species" />
        <Tab label="Description" />
      </Tabs>
      <div role="tabpanel" hidden={activeTab !== 0}>
        <Grid
          container
          sx={{ mt: 1 }}
          columns={3}
          columnSpacing={2}
          columnGap={2}
          spacing={2}
        >
          {dataTypes.map((dataType, index) => (
            <Grid item key={index}>
              <Card
                sx={{ border: 1, borderColor: "lightblue", cursor: "pointer" }}
                onClick={() => {
                  handleCardClick(dataType.label);
                }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="300"
                    image={dataType.imageSrc}
                    alt={dataType.label}
                  />
                  <CardContent>
                    <Typography variant="h6">{dataType.label}</Typography>
                    <Typography variant="body2">
                      {dataType.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>

      {activeTab === 1 && <ProjectDataDescription spp={selectedSpp} />}
    </div>
  );
};

export default DataSetMaker;
