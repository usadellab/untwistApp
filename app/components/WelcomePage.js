import { Typography } from "@mui/material";
import "./carousel.css"; 
import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Footer from "./Footer";

function WelcomePage() {
  return (
    <>
      <div style={styles.container}>
        <div style={styles.backgroundImage}></div>
        <div style={styles.content}></div>
      </div>

      <div style={{ padding: 10 }}>
        <Typography sx={{ mt: 4 }} align="center" variant="h4">
        <a href="https://www.fz-juelich.de/en/ibg/ibg-4/about-us" target="blank">
        Institute of Bio and Geosciences (IBG-4)

        </a>

        </Typography>
        <Typography align="center" variant="h5">
          Wilhelm-Johnen-Straße 52428 Jülich, Germany
        </Typography>

      </div>

      <div>
        <Footer />
      </div>
    </>
  );
}

const styles = {
  container: {
    position: "relative",
    height: "50vh",
  },
  backgroundImage: {
    position: "absolute",
    top: 5,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: "url(./untField.png)",
    backgroundSize: 'cover',
    backgroundRepeat: "no-repeat",
    backgroundPosition: 'center',
    // opacity: 0.5,
  },
  content: {
    position: "absolute",
    top: "200px",
    left: "100px",
  },
  heading: {
    fontSize: "50px",
    margin: 0,
  },
  paragraph: {
    fontSize: "24px",
    margin: "10px 0",
    padding: "2px 16px",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#f0f0f0",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  slider: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default WelcomePage;
