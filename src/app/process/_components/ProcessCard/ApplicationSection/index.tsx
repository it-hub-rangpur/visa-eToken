"use client";
import { IProcessResponse } from "@/interfaces";
import {
  useApplicationInfoMutation,
  useOverviewInfoMutation,
  usePersonalInfoMutation,
} from "@/lib/apis/Application/ApplicationApi";
import { IApplication } from "@/lib/apis/Application/ApplicationSlice";
import { getCurrentSession, SessionStep } from "@/utils/server/sessionWithStep";
import { Box, Button, Stack } from "@mui/material";
import React from "react";

interface IProps {
  data: IApplication;
  applicationState: IProcessResponse;
  setApplicationState: React.Dispatch<React.SetStateAction<IProcessResponse>>;
  setDisplayMessage: React.Dispatch<React.SetStateAction<string>>;
  otpSendRef: React.RefObject<HTMLButtonElement | null>;
}

const ApplicationSection: React.FC<IProps> = ({
  data,
  setApplicationState,
  applicationState,
  setDisplayMessage,
  otpSendRef,
}) => {
  const [applicationSubmit, { isLoading: applicationInfoLoading }] =
    useApplicationInfoMutation();

  const [personalSubmit, { isLoading: personalInfoLoading }] =
    usePersonalInfoMutation();

  const [overviewSubmit, { isLoading: overviewInfoLoading }] =
    useOverviewInfoMutation();

  const applicationRef = React.useRef<HTMLButtonElement>(null);
  const personalRef = React.useRef<HTMLButtonElement>(null);
  const overviewRef = React.useRef<HTMLButtonElement>(null);

  const applicationInfo = async () => {
    setDisplayMessage("Application submitting...");
    const info = {
      _id: data?._id,
      _token: applicationState?._token,
      action: applicationState?.action,
      state: applicationState?.cookies,
    };

    try {
      const response = (await applicationSubmit({
        info,
      }).unwrap()) as {
        success: boolean;
        message: string;
        data: IProcessResponse;
      };

      if (response?.success && response?.data?.cookies?.length > 1) {
        const info = {
          ...response?.data,
          isLoggedin: applicationState?.isLoggedin,
          cookies: applicationState?.cookies,
          _id: data?._id,
          _token: applicationState?._token,
        };
        if (response?.data?.path === "/personal-info") {
          setApplicationState(info);
          localStorage.setItem(data?._id, JSON.stringify(info));
          setTimeout(async () => {
            personalRef?.current?.click();
          }, 500);
        }
      }

      setDisplayMessage(response?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const personalInfo = async () => {
    setDisplayMessage("Personal info submitting...");
    const info = {
      _id: data?._id,
      _token: applicationState?._token,
      action: applicationState?.action,
      state: applicationState?.cookies,
    };

    try {
      const response = (await personalSubmit({
        info,
      }).unwrap()) as {
        success: boolean;
        message: string;
        data: IProcessResponse;
      };

      if (response?.success && response?.data?.cookies?.length > 1) {
        const info = {
          ...response?.data,
          isLoggedin: applicationState?.isLoggedin,
          cookies: applicationState?.cookies,
          _id: data?._id,
          _token: applicationState?._token,
        };
        // setDisplayMessage(response?.message);
        if (response?.data?.path === "/overview") {
          localStorage.setItem(data?._id, JSON.stringify(info));
          setApplicationState(info);
          setTimeout(async () => {
            overviewRef?.current?.click();
          }, 500);
        }
      }
      setDisplayMessage(response?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const overviewInfo = async () => {
    setDisplayMessage("Overview info submitting...");
    const info = {
      _id: data?._id,
      _token: applicationState?._token,
      action: applicationState?.action,
      state: applicationState?.cookies,
    };

    try {
      const response = (await overviewSubmit({
        info,
      }).unwrap()) as {
        success: boolean;
        message: string;
        data: IProcessResponse;
      };

      if (response?.success && response?.data?.cookies?.length > 1) {
        const info = {
          ...response?.data,
          isLoggedin: applicationState?.isLoggedin,
          cookies: applicationState?.cookies,
          _id: data?._id,
          _token: applicationState?._token,
        };
        if (response?.data?.path === "/payment") {
          localStorage.setItem(data?._id, JSON.stringify(info));
          setApplicationState(info);
          setTimeout(async () => {
            otpSendRef?.current?.click();
          }, 500);
        }
      }
      setDisplayMessage(response?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const currentStep = getCurrentSession(
    applicationState?.action as SessionStep
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5px",
        bgcolor: "#D9D9D9",
        marginTop: "5px",
      }}
    >
      <Stack direction="column" spacing={0.5}>
        <Button
          ref={applicationRef}
          // disabled={applicationInfoLoading}
          onClick={applicationInfo}
          size="small"
          color={
            currentStep > 3
              ? "success"
              : applicationInfoLoading
              ? "warning"
              : "primary"
          }
          variant="contained"
          sx={{
            textTransform: "none",
            width: "85px",
          }}
        >
          {applicationInfoLoading ? "Submitting..." : "Application"}
        </Button>
        <Button
          // disabled={personalInfoLoading}
          ref={personalRef}
          onClick={personalInfo}
          size="small"
          color={
            currentStep > 4
              ? "success"
              : personalInfoLoading
              ? "warning"
              : "primary"
          }
          variant="contained"
          sx={{
            textTransform: "none",
            width: "85px",
          }}
        >
          {personalInfoLoading ? "Submitting..." : "Personal"}
        </Button>
        <Button
          // disabled={overviewInfoLoading}
          ref={overviewRef}
          onClick={overviewInfo}
          color={
            currentStep > 5
              ? "success"
              : overviewInfoLoading
              ? "warning"
              : "primary"
          }
          size="small"
          variant="contained"
          sx={{
            textTransform: "none",
            width: "85px",
          }}
        >
          {overviewInfoLoading ? "Submitting..." : "Overview"}
        </Button>
      </Stack>
    </Box>
  );
};

export default ApplicationSection;
