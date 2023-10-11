// components/Layout.js
import React, { useState } from 'react';
import Navigation from './Navigation';
import Login from './LoginPage';

const Layout = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <div>
      {/* <Navigation authenticated={authenticated} /> */}
      <div className="content">
        {authenticated ? (
          // Display authenticated user content
          {children}
        ) : (
          // Display the login form
          <div className="login-form">
            <Login onLogin={() => setAuthenticated(true)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
