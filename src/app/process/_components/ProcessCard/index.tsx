import { Paper } from "@mui/material";
import React from "react";
import InfoLogin from "./InfoLogin";
import { IApplication } from "@/lib/apis/Application/ApplicationSlice";

interface IProps {
  data: IApplication;
}

const ProcessCard: React.FC<IProps> = ({ data }) => {
  return (
    <Paper
      sx={{
        padding: "0.5rem",
      }}
    >
      <InfoLogin data={data} />
    </Paper>
  );
};

export default ProcessCard;
