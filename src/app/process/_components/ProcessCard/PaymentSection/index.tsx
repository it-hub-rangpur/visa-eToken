"use client";
import { IProcessResponse } from "@/interfaces";
import {
  useBookSlotMutation,
  useGetTimeSlotMutation,
  useOtpVerifyMutation,
  usePaymentOtpMutation,
} from "@/lib/apis/Application/ApplicationApi";
import { IApplication } from "@/lib/apis/Application/ApplicationSlice";
import { useGetCaptchaMutation } from "@/lib/apis/server/serverApi";
import SocketIO from "@/Socket";
import { getCurrentSession, SessionStep } from "@/utils/server/sessionWithStep";
import { Box, Button, Stack, TextField } from "@mui/material";
import React, { useEffect } from "react";

interface IProps {
  data: IApplication;
  applicationState: IProcessResponse;
  setApplicationState: React.Dispatch<React.SetStateAction<IProcessResponse>>;
  otpSendRef: React.RefObject<HTMLButtonElement | null>;
  setDisplayMessage: React.Dispatch<React.SetStateAction<string>>;
}

const PaymentSection: React.FC<IProps> = ({
  data,
  setApplicationState,
  applicationState,
  otpSendRef,
  setDisplayMessage,
}) => {
  const [otp, setOtp] = React.useState<string>("");
  const [hashParam, setHashParam] = React.useState<string>("");

  const [paymentOtp, { isLoading: paymentOtpLoading }] =
    usePaymentOtpMutation();

  const [otpVerify, { isLoading: otpVerifyLoading }] = useOtpVerifyMutation();

  const [getTimeSlot, { isLoading: getTimeSlotLoading }] =
    useGetTimeSlotMutation();

  const [getCaptcha, { isLoading: getCaptchaLoading }] =
    useGetCaptchaMutation();

  const [bookSlot, { isLoading: bookSlotLoading }] = useBookSlotMutation();

  const payOtpVerifyButtonRef = React.useRef<HTMLButtonElement>(null);

  const getTimeSlotRef = React.useRef<HTMLButtonElement>(null);
  const getCaptchaRef = React.useRef<HTMLButtonElement>(null);
  const bookSlotRef = React.useRef<HTMLButtonElement>(null);

  const handlePaymentOtp = async () => {
    setDisplayMessage("OTP sending...");
    const info = {
      _id: data?._id,
      _token: applicationState?._token,
      action: applicationState?.action,
      state: applicationState?.cookies,
      resend: applicationState?.resend ?? 0,
    };

    try {
      const response = (await paymentOtp({
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
          _id: data?._id,
          cookies: applicationState?.cookies,
          _token: applicationState?._token,
        };
        localStorage.setItem(data?._id, JSON.stringify(info));
        setApplicationState(info);
      }
      setDisplayMessage(response?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    setDisplayMessage("OTP verifying...");
    const info = {
      _id: data?._id,
      _token: applicationState?._token,
      action: applicationState?.action,
      state: applicationState?.cookies,
      otp,
    };

    try {
      const response = (await otpVerify({
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
          _id: data?._id,
          cookies: applicationState?.cookies,
          _token: applicationState?._token,
        };
        localStorage.setItem(data?._id, JSON.stringify(info));
        setApplicationState(info);
        setTimeout(() => {
          getTimeSlotRef?.current?.click();
        }, 500);
      }
      setDisplayMessage(response?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetTimeSlot = async () => {
    setDisplayMessage("Time slot getting...");
    const defaultDate = process.env.NEXT_PUBLIC_SLOT_DATE;
    const info = {
      _id: data?._id,
      _token: applicationState?._token,
      action: applicationState?.action,
      slotDate: applicationState?.slot_dates?.length
        ? applicationState?.slot_dates[0]
        : defaultDate,
      state: applicationState?.cookies,
    };

    try {
      const response = (await getTimeSlot({
        info,
      }).unwrap()) as {
        success: boolean;
        message: string;
        data: IProcessResponse;
      };

      if (response?.success) {
        const info = {
          ...response?.data,
          isLoggedin: applicationState?.isLoggedin,
          _id: data?._id,
          cookies: applicationState?.cookies,
          _token: applicationState?._token,
        };
        localStorage.setItem(data?._id, JSON.stringify(info));
        setApplicationState(info);
        setTimeout(() => {
          getCaptchaRef?.current?.click();
        }, 500);
      }
      setDisplayMessage(response?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCapthaToken = async () => {
    setDisplayMessage("Captcha getting...");
    try {
      const response = await getCaptcha({ _id: data?._id }).unwrap();
      if (response?.data) {
        setHashParam(response?.data);
        setTimeout(() => {
          bookSlotRef?.current?.click();
        });
      }
      setDisplayMessage(response?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookNow = async () => {
    setDisplayMessage("Slot booking...");
    const defaultDate = process.env.NEXT_PUBLIC_SLOT_DATE;
    const defaultTime = process.env.NEXT_PUBLIC_SLOT_TIME;
    const numberDefaultTime = Number(defaultTime);

    const info = {
      _id: data?._id,
      _token: applicationState?._token,
      action: applicationState?.action,
      slotDate: applicationState?.slot_times?.length
        ? applicationState?.slot_times[0].date
        : defaultDate,
      slotTime: applicationState?.slot_times?.length
        ? applicationState?.slot_times[0].hour
        : numberDefaultTime,
      state: applicationState?.cookies,
      hashParam,
    };

    try {
      const response = (await bookSlot({
        info,
      }).unwrap()) as {
        success: boolean;
        message: string;
        data: IProcessResponse;
      };

      if (response?.success) {
        const info = {
          ...response?.data,
          isLoggedin: applicationState?.isLoggedin,
          _id: data?._id,
          cookies: applicationState?.cookies,
          _token: applicationState?._token,
        };
        localStorage.setItem(data?._id, JSON.stringify(info));
        setApplicationState(info);
      }
      setDisplayMessage(response?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenURL = () => {
    setDisplayMessage("Payment URL Opening...");
    const url = applicationState?.url;
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleCopyURL = () => {
    const url = applicationState?.url;
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        setDisplayMessage("Payment URL copied to clipboard");
      });
    }
  };

  useEffect(() => {
    const handlePayOtpVefiry = ({
      otp,
      phone,
    }: {
      otp: string;
      phone: string;
    }) => {
      if (otp?.length === 6 && data?.phone === phone) {
        setOtp(otp); // Set the OTP state
        setTimeout(() => {
          payOtpVerifyButtonRef?.current?.click();
        }, 1000);
      }
    };

    // Listen for the "login-send-otp" event
    SocketIO.on("pay-send-otp", handlePayOtpVefiry);
    // Cleanup function to remove the event listener
    return () => {
      SocketIO.off("pay-send-otp", handlePayOtpVefiry);
    };
  }, [data?.phone]);

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
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex", gap: "5px", width: "100%" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <Stack direction="row" spacing={0.5}>
            <Button
              ref={otpSendRef}
              // disabled={paymentOtpLoading}
              onClick={handlePaymentOtp}
              size="small"
              color={
                currentStep > 6
                  ? "success"
                  : paymentOtpLoading
                  ? "warning"
                  : "primary"
              }
              variant="contained"
              sx={{
                textTransform: "none",
                width: "100%",
              }}
            >
              {paymentOtpLoading ? "Sending..." : "Send OTP"}
            </Button>

            <Box>
              <TextField
                placeholder="Enter OTP"
                size="small"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                sx={{
                  width: "100px",
                  padding: "0",
                  "& .css-1pzfmz2-MuiInputBase-input-MuiOutlinedInput-input": {
                    paddingY: "5px",
                    paddingX: "10px",
                    bgcolor: "#FFF",
                    borderRadius: "4px",
                    fontSize: "15px",
                  },
                }}
              />
            </Box>

            <Button
              ref={payOtpVerifyButtonRef}
              disabled={otp?.length !== 6}
              onClick={handleVerifyOtp}
              size="small"
              color={
                currentStep > 7
                  ? "success"
                  : otpVerifyLoading
                  ? "warning"
                  : "primary"
              }
              variant="contained"
              sx={{
                width: "100%",
                textTransform: "none",
              }}
            >
              {otpVerifyLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </Stack>

          <Stack direction="row" spacing={0.5}>
            <Button
              ref={getTimeSlotRef}
              onClick={handleGetTimeSlot}
              size="small"
              color={
                currentStep > 8
                  ? "success"
                  : getTimeSlotLoading
                  ? "warning"
                  : "primary"
              }
              variant="contained"
              sx={{
                textTransform: "none",
                width: "100%",
              }}
            >
              {getTimeSlotLoading ? "Getting..." : "Time Slot"}
            </Button>

            <Button
              onClick={handleCapthaToken}
              ref={getCaptchaRef}
              disabled={getCaptchaLoading}
              size="small"
              variant="contained"
              color="error"
              sx={{
                textTransform: "none",
                width: "100%",
              }}
            >
              {getCaptchaLoading ? "Getting..." : "Captcha"}
            </Button>

            <Button
              ref={bookSlotRef}
              disabled={!hashParam}
              onClick={handleBookNow}
              color={
                currentStep > 9
                  ? "success"
                  : bookSlotLoading
                  ? "warning"
                  : "primary"
              }
              size="small"
              variant="contained"
              sx={{
                textTransform: "none",
                width: "100%",
              }}
            >
              {bookSlotLoading ? "Booking..." : "Book Now"}
            </Button>
          </Stack>

          <Stack direction="row" spacing={0.5}>
            <Button
              onClick={handleCopyURL}
              disabled={!applicationState?.url}
              size="small"
              variant="contained"
              color="success"
              sx={{
                textTransform: "none",
                width: "100%",
              }}
            >
              Copy Link
            </Button>

            <Button
              onClick={handleOpenURL}
              disabled={!applicationState?.url}
              size="small"
              variant="contained"
              color="success"
              sx={{
                textTransform: "none",
                width: "100%",
              }}
            >
              Open Link
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentSection;
