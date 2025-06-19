"use client";
import {
  useAbortCallMutation,
  useCreateSessionMutation,
} from "@/lib/apis/Application/ApplicationApi";
import { IApplication } from "@/lib/apis/Application/ApplicationSlice";
import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";

interface IProps {
  data: IApplication;
}

const InfoLogin: React.FC<IProps> = ({ data }) => {
  const [createSession, { isLoading: sessionCreateLoading }] =
    useCreateSessionMutation();

  const [abortCall, { isLoading: abortCallLoading }] = useAbortCallMutation();

  const handleCreateSession = async () => {
    const info = {
      _id: data?._id,
    };
    // handleAbort();
    try {
      const response = await createSession(info).unwrap();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    console.log("click", info);
  };

  const handleAbort = async () => {
    const info = {
      _id: data?._id,
    };

    try {
      const response = await abortCall(info).unwrap();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    console.log("click", info);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box>
        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
          Mission: Dhaka, Medical - 2
        </Typography>
        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
          Med: BGDRV0A1BE25, MD HADI AL HAMZA
        </Typography>
        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
          Mobile: 01719971636
        </Typography>
        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
          Email: hadialhamja@gmail.com
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: "#D9D9D9",
          width: "50%",
          padding: "0.5rem",
          borderRadius: "4px",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Button
            disabled={sessionCreateLoading}
            onClick={handleCreateSession}
            sx={{ fontSize: "10px", textTransform: "none" }}
            size="small"
            variant="contained"
          >
            {sessionCreateLoading ? "Creating Session..." : "Create Session"}
          </Button>
          <Button
            disabled={abortCallLoading}
            onClick={handleAbort}
            color="error"
            sx={{ fontSize: "10px", textTransform: "none" }}
            size="small"
            variant="contained"
          >
            {abortCallLoading ? "Aborting..." : "Abort"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default InfoLogin;
