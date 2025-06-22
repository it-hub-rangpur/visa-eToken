"use client";
import { IProcessResponse } from "@/interfaces";
import {
  useBookSlotMutation,
  useGetTimeSlotMutation,
  useOtpVerifyMutation,
  usePaymentOtpMutation,
} from "@/lib/apis/Application/ApplicationApi";
import { IApplication } from "@/lib/apis/Application/ApplicationSlice";
import SocketIO from "@/Socket";
import { Box, Button, Stack, TextField } from "@mui/material";
import React, { useEffect } from "react";

interface IProps {
  data: IApplication;
  applicationState: IProcessResponse;
  setApplicationState: React.Dispatch<React.SetStateAction<IProcessResponse>>;
  otpSendRef: React.RefObject<HTMLButtonElement | null>;
}

const PaymentSection: React.FC<IProps> = ({
  data,
  // setApplicationState,
  applicationState,
  otpSendRef,
}) => {
  const [otp, setOtp] = React.useState<string>("");

  const [paymentOtp, { isLoading: paymentOtpLoading }] =
    usePaymentOtpMutation();

  const [otpVerify, { isLoading: otpVerifyLoading }] = useOtpVerifyMutation();

  const [getTimeSlot, { isLoading: getTimeSlotLoading }] =
    useGetTimeSlotMutation();

  const [bookSlot, { isLoading: bookSlotLoading }] = useBookSlotMutation();

  const payOtpVerifyButtonRef = React.useRef<HTMLButtonElement>(null);

  const handlePaymentOtp = async () => {
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
        data: IProcessResponse;
      };

      console.log("response", response);

      // if (response?.success && response?.data?.cookies?.length > 1) {
      //   const info = {
      //     ...response?.data,
      //     isLoggedin: applicationState?.isLoggedin,
      //     _id: data?._id,
      //     _token: applicationState?._token,
      //   };
      //   localStorage.setItem(data?._id, JSON.stringify(info));
      //   setApplicationState(info);
      //   if (response?.data?.path === "/overview") {
      //     setTimeout(async () => {
      //       overviewRef?.current?.click();
      //     }, 500);
      //   }
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
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
        data: IProcessResponse;
      };

      console.log("response", response);
      // if (response?.success && response?.data?.cookies?.length > 1) {
      //   const info = {
      //     ...response?.data,
      //     isLoggedin: applicationState?.isLoggedin,
      //     _id: data?._id,
      //     _token: applicationState?._token,
      //   };
      //   localStorage.setItem(data?._id, JSON.stringify(info));
      //   setApplicationState(info);
      //   if (response?.data?.path === "/payment") {
      //     setTimeout(async () => {
      //       console.log("move to payment ref");
      //     }, 500);
      //   }
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetTimeSlot = async () => {
    const info = {
      _id: data?._id,
      _token: applicationState?._token,
      action: applicationState?.action,
      state: applicationState?.cookies,
    };

    try {
      const response = (await getTimeSlot({
        info,
      }).unwrap()) as {
        success: boolean;
        data: IProcessResponse;
      };

      console.log("response", response);
      // if (response?.success && response?.data?.cookies?.length > 1) {
      //   const info = {
      //     ...response?.data,
      //     isLoggedin: applicationState?.isLoggedin,
      //     _id: data?._id,
      //     _token: applicationState?._token,
      //   };
      //   localStorage.setItem(data?._id, JSON.stringify(info));
      //   setApplicationState(info);
      //   if (response?.data?.path === "/payment") {
      //     setTimeout(async () => {
      //       console.log("move to payment ref");
      //     }, 500);
      //   }
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookNow = async () => {
    const info = {
      _id: data?._id,
      _token: applicationState?._token,
      action: applicationState?.action,
      state: applicationState?.cookies,
    };

    try {
      const response = (await bookSlot({
        info,
      }).unwrap()) as {
        success: boolean;
        data: IProcessResponse;
      };

      console.log("response", response);
      // if (response?.success && response?.data?.cookies?.length > 1) {
      //   const info = {
      //     ...response?.data,
      //     isLoggedin: applicationState?.isLoggedin,
      //     _id: data?._id,
      //     _token: applicationState?._token,
      //   };
      //   localStorage.setItem(data?._id, JSON.stringify(info));
      //   setApplicationState(info);
      //   if (response?.data?.path === "/payment") {
      //     setTimeout(async () => {
      //       console.log("move to payment ref");
      //     }, 500);
      //   }
      // }
    } catch (error) {
      console.error(error);
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
              disabled={paymentOtpLoading}
              onClick={handlePaymentOtp}
              size="small"
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
              disabled={otpVerifyLoading || otp?.length !== 6}
              onClick={handleVerifyOtp}
              size="small"
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
              // ref={applicationRef}
              disabled={getTimeSlotLoading}
              onClick={handleGetTimeSlot}
              size="small"
              variant="contained"
              sx={{
                textTransform: "none",
                width: "100%",
              }}
            >
              {getTimeSlotLoading ? "Getting..." : "Time Slot"}
            </Button>

            <Button
              // ref={applicationRef}
              // disabled={applicationInfoLoading}
              // onClick={applicationInfo}
              size="small"
              variant="contained"
              sx={{
                textTransform: "none",
                width: "100%",
              }}
            >
              Token
            </Button>

            <Button
              // ref={applicationRef}
              disabled={bookSlotLoading}
              onClick={handleBookNow}
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
              // ref={applicationRef}
              // disabled={applicationInfoLoading}
              // onClick={applicationInfo}
              size="small"
              variant="contained"
              sx={{
                textTransform: "none",
                width: "100%",
              }}
            >
              Copy Link
            </Button>

            <Button
              // ref={applicationRef}
              // disabled={applicationInfoLoading}
              // onClick={applicationInfo}
              size="small"
              variant="contained"
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
