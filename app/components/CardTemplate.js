import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, CardActions } from "@mui/material";
import { UserContext } from "../../contexts/ToolContext";
import { Analysis } from "./Analysis";
import { useContext } from "react";
import { Box } from "@mui/material";

export default function CardTemplate(props) {
  const { content, setContent } = useContext(UserContext);

  return (
    <UserContext.Provider value={{ content, setContent }}>
      <Card
        onClick={() => {
          setContent(<Analysis tool={props.title} />);
        }}
        sx={{ border: 1, maxHeight: 400, p: 1, height: "auto", width: "auto" }}
      >
        <CardActionArea>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardMedia
              component="img"
              height="170"
              image={props.myImage}
              alt="green iguana"
            />

            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {props.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {props.description}
              </Typography>
            </CardContent>
          </Box>
        </CardActionArea>
      </Card>
    </UserContext.Provider>
  );
}
