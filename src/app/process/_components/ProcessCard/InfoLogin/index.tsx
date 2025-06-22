"use client";
import { getCenter, getVisaType } from "@/constans";
import { IProcessResponse } from "@/interfaces";
import {
  useAbortCallMutation,
  useCreateSessionMutation,
  useLoginMutation,
} from "@/lib/apis/Application/ApplicationApi";
import { IApplication } from "@/lib/apis/Application/ApplicationSlice";
import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";

interface IProps {
  data: IApplication;
  applicationState: IProcessResponse;
  setApplicationState: React.Dispatch<React.SetStateAction<IProcessResponse>>;
  setDisplayMessage: React.Dispatch<React.SetStateAction<string>>;
}

const InfoLogin: React.FC<IProps> = ({
  data,
  setApplicationState,
  applicationState,
  setDisplayMessage,
}) => {
  const [createSession, { isLoading: sessionCreateLoading }] =
    useCreateSessionMutation();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [abortCall, { isLoading: abortCallLoading }] = useAbortCallMutation();
  const createSessionRef = React.useRef<HTMLButtonElement>(null);

  const handleCreateSession = async () => {
    setDisplayMessage("Session creating...");
    const info = {
      _id: data?._id,
      _token: applicationState?._token,
      action: applicationState?.action,
      state: applicationState?.cookies,
    };

    try {
      const response = (await createSession({
        info,
      }).unwrap()) as {
        success: boolean;
        message: string;
        data: IProcessResponse;
      };

      if (response?.success) {
        const info = {
          _id: data?._id,
          ...response?.data,
        };
        setDisplayMessage(response?.message);
        localStorage.setItem(data?._id, JSON.stringify(info));
        setApplicationState(info);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateNewSession = async () => {
    setDisplayMessage("Logout session creating...");

    const info = {
      _id: data?._id,
      _token: "",
      action: applicationState?.action,
      state: [],
    };

    try {
      const response = (await createSession({
        info,
      }).unwrap()) as {
        success: boolean;
        message: string;
        data: IProcessResponse;
      };

      if (response?.success) {
        const info = {
          _id: data?._id,
          ...response?.data,
        };
        setDisplayMessage("Logout session created!");
        localStorage.setItem(data?._id, JSON.stringify(info));
        setApplicationState(info);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    setDisplayMessage("Authenticating...");
    const info = {
      _id: data?._id,
      _token: applicationState?._token,
      action: applicationState?.action,
      state: applicationState?.cookies,
    };

    try {
      const response = (await login({
        info,
      }).unwrap()) as {
        success: boolean;
        message: string;
        data: IProcessResponse;
      };

      if (response?.success && response?.data?.cookies?.length > 1) {
        const info = {
          ...response?.data,
          _id: data?._id,
          _token: applicationState?._token,
        };
        setDisplayMessage(response?.message);
        localStorage.setItem(data?._id, JSON.stringify(info));
        setApplicationState(info);
        if (response?.data?.path === "/") {
          setTimeout(async () => {
            if (createSessionRef?.current) {
              createSessionRef?.current?.click();
            }
          }, 500);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAbort = async () => {
    setDisplayMessage("Call aborting...");
    const info = {
      _id: data?._id,
      action: "abort",
    };

    try {
      await abortCall(info).unwrap();
      setDisplayMessage("Call aborted!");
    } catch (error) {
      console.error(error);
    }
  };

  const medInfo = data?.info[0];

  return (
    <Box sx={{ display: "flex", justifyContent: "flexStart", gap: "10px" }}>
      <Box sx={{ width: "100%" }}>
        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
          Mission: {getCenter(data?.center)}, {getVisaType(data?.visaType)} -{" "}
          {data?.info?.length}
        </Typography>
        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
          Med: {medInfo?.web_id},{" "}
          {medInfo?.name?.length > 10
            ? medInfo?.name.slice(0, 10) + ".."
            : medInfo?.name}
        </Typography>
        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
          Mobile: {data?.phone}
        </Typography>
        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
          Email: {data?.email?.split("@")[0] + ".."}
        </Typography>

        <Typography
          sx={{
            padding: "10px",
            bgcolor: "#D9D9D9",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "2px",
            width: "100%",
            textAlign: "center",
          }}
        >
          {applicationState?.action === "/" ? (
            <span>No Session found!</span>
          ) : (
            <span style={{ textTransform: "uppercase" }}>
              {applicationState?.action}
            </span>
          )}
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: "#D9D9D9",
          width: "100%",
          padding: "0.5rem",
          borderRadius: "4px",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Button
            ref={createSessionRef}
            disabled={sessionCreateLoading}
            onClick={handleCreateSession}
            sx={{ fontSize: "10px", textTransform: "none", width: "100%" }}
            size="small"
            variant="contained"
          >
            {sessionCreateLoading ? "Creating..." : "Session"}
          </Button>

          <Button
            disabled={
              sessionCreateLoading ||
              !applicationState?._token ||
              !applicationState?.isLoggedin
            }
            onClick={handleCreateNewSession}
            color="error"
            sx={{ fontSize: "10px", textTransform: "none", width: "100%" }}
            size="small"
            variant="contained"
          >
            {sessionCreateLoading ? "Outing..." : "Logout"}
          </Button>
        </Stack>

        {applicationState?.isLoggedin && (
          <Box sx={{ marginTop: "5px" }}>
            <Typography
              sx={{
                bgcolor: "#000",
                textAlign: "center",
                paddingY: "5px",
                borderRadius: "4px",
                color: "#FFF",
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              Application Login!
            </Typography>
          </Box>
        )}

        <Stack direction="row" spacing={1} marginTop={"5px"}>
          {!applicationState?.isLoggedin && (
            <Button
              disabled={!applicationState?._token || loginLoading}
              onClick={handleLogin}
              sx={{ fontSize: "10px", textTransform: "none", width: "100%" }}
              size="small"
              variant="contained"
            >
              {loginLoading ? "Logging In..." : "Login"}
            </Button>
          )}

          <Button
            disabled={abortCallLoading}
            onClick={handleAbort}
            color="error"
            sx={{ fontSize: "10px", textTransform: "none", width: "100%" }}
            size={applicationState?.isLoggedin ? "medium" : "small"}
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
