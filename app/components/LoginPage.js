'use client'
import React, { useState } from 'react';
import { useApiContext } from "../../contexts/ApiEndPoint";
import axios from 'axios';
import { Container, Paper, Grid, Typography, TextField, Button, Alert } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Cookies from 'js-cookie';
import { useTokenContext } from '@/contexts/TokenContext';

const backgroundStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const Login = ({updateAuthenticationStatus}) => {
  const {apiToken, setApiToken} = useTokenContext();

  // console.log('login component')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
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
        updateAuthenticationStatus(true);

        const accessToken = response.data.access_token;
        setApiToken(accessToken)
        Cookies.set('token', accessToken);
        // console.log(accessToken)
        // return accessToken;
      } else {
        updateAuthenticationStatus(false);
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error('Request error:', error);
      setError('Invalid credentials');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
      alert('i am here')
    }
  };

  // Autofill credentials from the browser if available
  React.useEffect(() => {
    const username = document.querySelector('input[name="username"]');
    const password = document.querySelector('input[name="password"]');

    if (username && password) {
      const storedUsername = localStorage.getItem('storedUsername');
      const storedPassword = localStorage.getItem('storedPassword');

      if (storedUsername) {
        setFormData((prevData) => ({
          ...prevData,
          username: storedUsername,
        }));
      }

      if (storedPassword) {
        setFormData((prevData) => ({
          ...prevData,
          password: storedPassword,
        }));
      }
    }
  }, []); // Run once on component mount

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
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <form>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  name="username"
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  autoComplete="username"
                  value={formData.username}
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
                onKeyPress={handleKeyPress}
                autoComplete="current-password"
                value={formData.password}
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


