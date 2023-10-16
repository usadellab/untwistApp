import React, { useState } from 'react';
import { useApiContext } from "../../contexts/ApiEndPoint";
import axios from 'axios';
import { Container, Paper, Grid, Typography, TextField, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Inline CSS for the background image
const backgroundStyle = {
//   background: 'url("/untField.png")', // Replace with your image path
//   backgroundSize: 'cover',
//   backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const Login = ({ updateAuthenticationStatus }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const apiEndpoint = useApiContext().apiEndpoint;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiEndpoint}/auth`, {
        username: formData.username,
        password: formData.password,
      });
      if (response.status === 200) {
        // Authentication successful, you can now use the access token from response.data.access_token
        updateAuthenticationStatus(true);

        const accessToken = response.data.access_token;
        console.log('Access Token:', accessToken);
        return accessToken;
      } else {
        // Authentication failed
        updateAuthenticationStatus(false);

        console.error('Authentication failed');
      }
    } catch (error) {
      // Handle request error
      console.error('Request error:', error);
    }
  };

  return (
    <div style={backgroundStyle}>
      <Container maxWidth="sm">
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h5" align="center" color='green'>
                Untwist Knowledge Hub
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <form>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  name="username"
                  onChange={handleChange}
                />
              </form>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type="password"
                name="password"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                color="primary"
                startIcon={<AccountCircleIcon />}
                onClick={handleSubmit}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
