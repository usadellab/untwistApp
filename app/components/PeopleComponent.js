import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';

const PeopleComponent = () => {
  const [peopleData, setPeopleData] = useState([]);

  useEffect(() => {
    // Fetch data from API when component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('/api/people');
        const data = await response.json();
        setPeopleData(data.result.data);
      } catch (error) {
        console.error('Error fetching people data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container sx={{ padding: 2 }} spacing={2}>
      {peopleData.map(person => (
        <Grid key={person.id} item xs={12} sm={6}>
          <Card sx={{ display: 'flex', border: 1 }} elevation={3}>
            <CardMedia
              component="img"
              sx={{ width: 160, height: 'auto', flex: '0 0 auto', alignSelf: 'center', ml:1}}
              image="https://via.placeholder.com/160x160.png"
              alt="Placeholder"
            />
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography variant="h6" gutterBottom>
                {person.people_firstname} {person.people_lastname}
              </Typography>
              <Typography variant="subtitle1">
                Role: {person.people_role}
              </Typography>
              <Typography variant="subtitle1">
                Affiliation: {person.people_affiliation}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PeopleComponent;
