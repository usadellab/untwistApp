"use client";

import { MiniDrawer } from "./components/MiniDrawer";
import { SelectedSpeciesProvider } from "../contexts/SelectedSpeciesContext"; // Update the path
import { TokenProvider } from "../contexts/TokenContext";
import { ApiContextProvider } from "../contexts/ApiEndPoint";
import Login from "./components/LoginPage";
import { useState } from "react";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);

  const updateAuthenticationStatus = (status) => {
    setAuthenticated(status);
  };

  return (
    <ApiContextProvider>
      <TokenProvider>
        {authenticated ? (
          <SelectedSpeciesProvider>
            <MiniDrawer />
          </SelectedSpeciesProvider>
        ) : (
          <Login updateAuthenticationStatus={updateAuthenticationStatus} />
        )}
      </TokenProvider>
    </ApiContextProvider>
  );
}
