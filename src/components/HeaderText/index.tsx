import { Box, Typography } from "@mui/material";
import React from "react";

const HeaderText = ({ heading }: { heading: string }) => {
  return (
    <Box>
      <Typography sx={{ fontSIze: "14px", fontWeight: 600 }}>
        {heading}
      </Typography>
    </Box>
  );
};

export default HeaderText;
