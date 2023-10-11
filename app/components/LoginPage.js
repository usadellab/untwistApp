// components/Login.js
import React, { useState } from 'react';
import { useApiContext } from "../../contexts/ApiEndPoint";


const Login = () => {
    const apiEndpoint = useApiContext().apiEndpoint;
    const [apiToken, setApiToken] = useState(null);


  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });


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
      // Send a POST request to your Flask backend to authenticate the user
    //   const response = await fetch(`${apiEndpoint}/token`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData),
        
    //   });

    //   if (response.ok) {
    //     // Successful login, redirect or perform other actions
    //     // You may want to store the access token in a state or a cookie
    //     console.log('Logged in successfully');
    //     let newToken = 'TBD'
    //     setApiToken(newToken)
    //   } else {
    //     // Handle authentication error, display an error message, etc.
    //     console.error('Login failed');
    //   }

    fetch(`${apiEndpoint}/token`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((responseData) => {
        let token = responseData.access_token;
        console.log(token)
        setApiToken(token);
      })
      .catch((error) => {
        console.error("Error:", error);
      });


    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>

      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>

  );
};

export default Login;
