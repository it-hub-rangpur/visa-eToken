import { alpha, Box, Button, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FactCheck, Print } from "@mui/icons-material";
import { IApplication } from "@/lib/apis/Application/ApplicationSlice";
import SocketIO from "@/Socket";
import {
  useAbortCallMutation,
  useOrderConfirmMutation,
} from "@/lib/apis/Application/ApplicationApi";

interface IProps {
  data: IApplication;
  setDisplayMessage: React.Dispatch<React.SetStateAction<string>>;
  isShowConfirmContainer: boolean;
  setIsShowConfirmContainer: React.Dispatch<React.SetStateAction<boolean>>;
}

const OrderConfirmation: React.FC<IProps> = ({
  data,
  setDisplayMessage,
  isShowConfirmContainer,
  setIsShowConfirmContainer,
}) => {
  const [paymentInfo, setPaymentInfo] = useState<unknown | null>(null);
  const [abortCall] = useAbortCallMutation();

  const [transactionId, setTransactionId] = useState(
    data?.paymentStatus?.order_id
  );

  const [resMessage, setResMessage] = useState({
    message: transactionId
      ? "Order confirmed successfully!"
      : "Order Not Confirmed yet",
    type: "error",
  });

  const [isConfirm, setIsConfirm] = useState(transactionId ? true : false);
  const [confirmOrder, { isLoading }] = useOrderConfirmMutation();

  const infoIds = data?.info?.map((item) => item?.web_id)?.join(",");

  const handlePaymentConfirm = async (orderInfo: unknown) => {
    await handleAbort();
    setDisplayMessage("Order confirmation in progress...");

    try {
      const response = (await confirmOrder(orderInfo).unwrap()) as {
        success: boolean;
        message: string;
        data: {
          success: boolean;
          message: string;
          path: string;
          order_id: string;
        };
      };

      if (response?.success) {
        setIsConfirm(true);
        setTransactionId(response?.data?.order_id);
        // const info = {
        //   ...applicationState,
        //   isConfirmed: true,
        // };
        // localStorage.setItem(data?._id, JSON.stringify(info));
        // setApplicationState(info);
      }
      setResMessage({
        message: response?.message,
        type: response?.success ? "success" : "error",
      });
      setDisplayMessage(response?.message);
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

  useEffect(() => {
    const handleSetOrderInfo = ({
      uniqueKey,
      data: orderInfo,
    }: {
      uniqueKey: string;
      data: unknown;
    }) => {
      if (uniqueKey === infoIds) {
        handleAbort();
        setIsShowConfirmContainer(true);
        setPaymentInfo(orderInfo);
        new Promise((resolve) => setTimeout(resolve, 1000));
        handlePaymentConfirm(orderInfo);
      }
    };

    SocketIO.on("order-confirmation", handleSetOrderInfo);

    // Cleanup function to remove the event listener
    return () => {
      SocketIO.off("order-confirmation", handleSetOrderInfo);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.phone, infoIds]);

  if (isShowConfirmContainer || transactionId) {
    return (
      <Box sx={{ marginTop: "5px", bgcolor: "#F8F5E9", padding: "5px 10px" }}>
        <Box>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            Order Confirmarion
          </Typography>

          <Box>
            <Box
              sx={{
                marginY: "5px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  padding: "3px",
                  bgcolor: isConfirm
                    ? alpha("#C2FFC7", 1)
                    : alpha("#F72C5B", 0.2),
                  borderRadius: "3px",
                  textAlign: "center",
                  fontWeight: 600,
                  color: isConfirm ? "green" : "red",
                }}
              >
                {resMessage?.message}
              </Typography>
            </Box>

            {transactionId ? (
              <Stack sx={{ marginTop: "5px" }} direction={"row"} spacing={2}>
                <Button
                  size="small"
                  startIcon={<FactCheck />}
                  onClick={() => {
                    window.open(
                      `https://payment.ivacbd.com/multi_payment/status/${transactionId}`,
                      "_blank"
                    );
                  }}
                  variant="contained"
                  color="success"
                  disabled={!transactionId}
                  sx={{
                    width: "100%",
                    textTransform: "none",
                    boxShadow: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                >
                  Confirmation
                </Button>

                <Button
                  size="small"
                  startIcon={<Print />}
                  onClick={() => {
                    window.open(
                      `https://payment.ivacbd.com/invoice/print_multi/${transactionId}`,
                      "_blank"
                    );
                  }}
                  variant="contained"
                  color="success"
                  disabled={!transactionId}
                  sx={{
                    width: "100%",
                    textTransform: "none",
                    boxShadow: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                >
                  Payment Invoice
                </Button>
              </Stack>
            ) : (
              <Stack sx={{ marginTop: "5px" }} direction={"row"} spacing={1}>
                <Button
                  size="small"
                  onClick={() => handlePaymentConfirm(paymentInfo)}
                  variant="contained"
                  color="success"
                  disabled={isLoading}
                  sx={{
                    width: "100%",
                    textTransform: "none",
                    boxShadow: "none",
                    padding: "0.4rem 1rem",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                >
                  {isLoading ? "Confirming..." : "Confirm Order"}
                </Button>

                <Button
                  size="small"
                  onClick={handleAbort}
                  variant="contained"
                  color="error"
                  sx={{
                    width: "100%",
                    textTransform: "none",
                    boxShadow: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                >
                  Force Stop
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
      </Box>
    );
  } else {
    return null;
  }
};

export default OrderConfirmation;
