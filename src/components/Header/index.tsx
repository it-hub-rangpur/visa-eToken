import { Box, Typography } from "@mui/material";
import React from "react";

const Header = () => {
  return (
    <Box
      sx={{
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          IT-Hub
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
