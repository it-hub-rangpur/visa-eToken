"use client";

import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import InfoLogin from "./InfoLogin";
import { IApplication } from "@/lib/apis/Application/ApplicationSlice";
import { IProcessResponse } from "@/interfaces";
import { getApplicationState } from "@/utils/localStorage";

interface IProps {
  data: IApplication;
}

const initialState: IProcessResponse = {
  _id: "",
  _token: "",
  isLoggedin: false,
  action: "/",
  cookies: [],
};

const ProcessCard: React.FC<IProps> = ({ data }) => {
  const [applicationState, setApplicationState] =
    useState<IProcessResponse>(initialState);

  useEffect(() => {
    const info = getApplicationState(data?._id);
    if (info?._id) {
      setApplicationState(info);
    }
  }, [data?._id]);

  return (
    <Paper
      sx={{
        padding: "0.5rem",
      }}
    >
      <InfoLogin
        data={data}
        applicationState={applicationState}
        setApplicationState={setApplicationState}
      />
    </Paper>
  );
};

export default ProcessCard;
