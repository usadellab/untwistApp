// components/Navigation.js
import React from 'react';
import Link from 'next/link';

const Navigation = ({ authenticated }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        {authenticated ? (
          <li>
            <a href="/logout">Logout</a>
          </li>
        ) : (
          <li>
            <Link href="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
