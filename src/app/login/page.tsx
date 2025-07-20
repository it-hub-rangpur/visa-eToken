"use client";

import FormProvaider from "@/components/Form";
import FormInputField, { IInputType } from "@/components/Form/InputField";
import { useUserLoginMutation } from "@/lib/apis/server/serverApi";
import { Box, Button, Paper, Typography } from "@mui/material";
import { FormikValues } from "formik";
import { useRouter } from "next/navigation";
import React from "react";
import * as Yup from "yup";

const validateSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const initialValues = {
  username: "",
  password: "",
};

const LoginPage = () => {
  const [login, { data, isLoading, isError, isSuccess, error }] =
    useUserLoginMutation();
  const router = useRouter();

  const onSubmit = async (values: FormikValues): Promise<void> => {
    try {
      const response = await login(values).unwrap();
      const token = response?.data?.token;
      document.cookie = `accessToken=${token}; path=/; expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 8
      ).toUTCString()}`;
      router.replace("/process");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          border: { xs: "none", md: "1px solid rgba(0, 0, 0, 0.12)" },
          borderRadius: "8px",
          //   height: { xs: "100%", md: "500px" },
          width: { xs: "100%", md: "400px" },
          padding: "2rem",
          boxShadow: { xs: "none", md: "0 0 10px 0 rgba(0, 0, 0, 0.2)" },
        }}
      >
        <Box
          sx={{
            paddingTop: { xs: "50px", md: "0px" },
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: "28px",
              //   color: "#FFF",
            }}
          >
            It-Hub
          </Typography>

          <Typography
            variant="body1"
            sx={{
              paddingY: "20px",
              fontWeight: 500,
            }}
          >
            Login to your account
          </Typography>
        </Box>

        <Box marginTop="20px">
          <FormProvaider
            submitHandlar={onSubmit}
            initialValues={initialValues}
            validationSchema={validateSchema}
          >
            <Box marginTop={"20px"}>
              <FormInputField name="username" required placeholder="Username" />
            </Box>

            <Box marginTop={"20px"}>
              <FormInputField
                type={IInputType.PASSWORD}
                name="password"
                required
                placeholder="********"
              />
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "right",
                    fontSize: "14px",
                    marginTop: "5px",
                    cursor: "pointer",
                  }}
                >
                  Forgot password ?
                </Typography>
              </Box>

              {isSuccess && (
                <Typography
                  sx={{
                    color: "primary.main",
                    fontSize: { xs: "12px", md: "16px", fontWeight: 600 },
                  }}
                >
                  {data?.message}
                </Typography>
              )}

              {isError && (
                <Typography
                  sx={{
                    color: "red",
                    fontSize: { xs: "12px", md: "14px", fontWeight: 500 },
                  }}
                >
                  {(error as { data: { message: string } })?.data?.message}
                </Typography>
              )}

              <Box sx={{ marginY: "50px" }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    width: "150px",
                    height: "40px",
                  }}
                >
                  {isLoading ? "Loading..." : "Login"}
                </Button>
              </Box>
            </Box>
          </FormProvaider>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
