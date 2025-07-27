"use client";

import { Box, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import InfoLogin from "./InfoLogin";
import { IApplication } from "@/lib/apis/Application/ApplicationSlice";
import { IProcessResponse } from "@/interfaces";
import { getApplicationState } from "@/utils/localStorage";
import ApplicationSection from "./ApplicationSection";
import PaymentSection from "./PaymentSection";
import OrderConfirmation from "./OrderConfirmation";

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
  const [displayMessage, setDisplayMessage] = useState("Not started");
  const [isShowConfirmContainer, setIsShowConfirmContainer] = useState(false);

  const otpSendRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const info = getApplicationState(data?._id);
    if (info?._id) {
      setApplicationState(info);
      if (info?.action === "/") {
        setDisplayMessage("Not started");
      } else {
        setDisplayMessage("In progress...");
      }
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
        setDisplayMessage={setDisplayMessage}
      />
      <Box sx={{ mt: "5px" }}>
        <Typography
          sx={{
            width: "100%",
            bgcolor: "#000",
            color: "#FFF",
            textAlign: "center",
            padding: "0.3rem",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {displayMessage}
        </Typography>
      </Box>

      <Box
        sx={{
          display:
            isShowConfirmContainer || data?.paymentStatus?.order_id
              ? "none"
              : "flex",
        }}
      >
        <ApplicationSection
          data={data}
          applicationState={applicationState}
          setApplicationState={setApplicationState}
          setDisplayMessage={setDisplayMessage}
          otpSendRef={otpSendRef}
        />
        <PaymentSection
          data={data}
          applicationState={applicationState}
          setApplicationState={setApplicationState}
          setDisplayMessage={setDisplayMessage}
          otpSendRef={otpSendRef}
        />
      </Box>
      <OrderConfirmation
        data={data}
        setDisplayMessage={setDisplayMessage}
        isShowConfirmContainer={isShowConfirmContainer}
        setIsShowConfirmContainer={setIsShowConfirmContainer}
      />
    </Paper>
  );
};

export default ProcessCard;
