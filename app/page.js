"use client";

import { MiniDrawer } from "./components/MiniDrawer";
import { SelectedSpeciesProvider } from "../contexts/SelectedSpeciesContext"; // Update the path
import { TokenProvider } from "../contexts/TokenContext";
import { ApiContextProvider } from '../contexts/ApiEndPoint';

export default function Home() {
  return (

    <ApiContextProvider>
    <TokenProvider>
      <SelectedSpeciesProvider>
        <MiniDrawer />
      </SelectedSpeciesProvider>
    </TokenProvider>
    </ApiContextProvider>

  );
}
