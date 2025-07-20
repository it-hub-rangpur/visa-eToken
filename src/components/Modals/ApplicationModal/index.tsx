import FormProvaider from "@/components/Form";
import FormSelectField from "@/components/Form/FormSelectField";
import FormInputField, { IInputType } from "@/components/Form/InputField";
import { centers, ivacs, visaTypes } from "@/constans";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { FormikValues, useFormikContext } from "formik";
import React from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  center: Yup.string().required("Mission is required"),
  ivac: Yup.string().required("IVAC is required"),
  visaType: Yup.string().required("Visa Type is required"),
  password: Yup.string().required("Password is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^\d+$/, "Enter a valid number")
    .length(11, "Phone must be exactly 11 characters")
    .required("Phone number is required"),
  paymentMethod: Yup.string().required("Payment Method is required"),
  visit_purpose: Yup.string().required("Visit Purpose is required"),
  info: Yup.array().of(
    Yup.object().shape({
      web_id: Yup.string().required("Web ID is required"),
      name: Yup.string().required("Name is required"),
    })
  ),
});

const StyledButton = styled(Button)(() => ({
  textTransform: "none",
  boxShadow: "none",
  padding: "0.5rem 1rem",
  borderRadius: "5px",
  fontSize: "14px",
}));

const ApplicationInfo: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<FormikValues>();

  const selectedIvacs = ivacs?.filter(
    (item) => item?.center_info_id === values?.center
  );

  const handleAddFile = () => {
    if (values?.info?.length < 5) {
      setFieldValue("info", [...values?.info, { web_id: "", name: "" }]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const arr = [...values?.info];
    arr.splice(index, 1);
    setFieldValue("info", arr);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={4}>
          <FormSelectField
            name="center"
            label="Select a mission"
            placeholder="Select a mission"
            options={centers?.map((item) => ({
              value: item?.id,
              label: item?.c_name,
            }))}
          />
        </Grid>

        <Grid size={4}>
          <FormSelectField
            name="ivac"
            label="Select IVAC Center"
            placeholder="Select IVAC Center"
            options={selectedIvacs?.map((item) => ({
              value: item?.id,
              label: item?.ivac_name,
            }))}
          />
        </Grid>
        <Grid size={4}>
          <FormSelectField
            name="visaType"
            label="Visa Type"
            placeholder="Visa Type"
            options={visaTypes?.map((item) => ({
              value: item?.id,
              label: item?.type_name,
            }))}
          />
        </Grid>

        <Grid size={4}>
          <FormInputField
            name="email"
            placeholder="Enter Email"
            label="Enter Email"
            type={IInputType.EMAIL}
          />
        </Grid>

        <Grid size={4}>
          <FormInputField
            name="phone"
            label="Enter Phone Number"
            placeholder="Enter Phone Number"
            type={IInputType.TEXT}
          />
        </Grid>
        <Grid size={4}>
          <FormInputField
            name="password"
            label="Enter Password"
            placeholder="Enter Password"
          />
        </Grid>

        {values?.info?.map(
          (item: { web_id: string; name: string }, index: number) => (
            <Grid size={12} key={index}>
              <Grid container spacing={2}>
                <Grid size={5}>
                  <FormInputField
                    name={`info.${index}.web_id`}
                    label="Enter Web ID"
                    placeholder="Enter Web ID"
                  />
                </Grid>
                <Grid size={5}>
                  <FormInputField
                    name={`info.${index}.name`}
                    placeholder="Enter Name"
                    label="Enter Name"
                  />
                </Grid>
                <Grid size={2} sx={{ marginTop: "30px" }}>
                  {index === 0 ? (
                    <Button
                      variant="contained"
                      onClick={handleAddFile}
                      sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        fontSize: "14px",
                      }}
                    >
                      Add File
                    </Button>
                  ) : (
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => handleRemoveFile(index)}
                      sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        fontSize: "14px",
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          )
        )}
        <Box sx={{ width: "100%" }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "red",
            }}
          >
            Note: Please make sure 1st Application must be Account Holder.
          </Typography>
        </Box>

        <Grid size={12}>
          <FormInputField
            name="visit_purpose"
            label="Visit Purpose"
            placeholder="Enter Visit Purpose"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  maxHeight: 600,
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: "5px",
};

const emptyInidialvalues = {
  companyId: "",
  assignTo: "",
  center: "",
  ivac: "",
  visaType: "",
  email: "",
  phone: "",
  password: "",
  info: [
    {
      web_id: "",
      name: "",
    },
  ],
  visit_purpose: "",
  paymentUrl: "",
  status: "",
};

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const ApplicationModal: React.FC<IProps> = ({ open, setOpen }) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal open={open} closeAfterTransition>
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
            Create Application
          </Typography>
          <IconButton onClick={handleClose} color="error">
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ marginTop: "1rem" }}>
          <FormProvaider
            initialValues={emptyInidialvalues}
            submitHandlar={() => {}}
            validationSchema={validationSchema}
          >
            <ApplicationInfo />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Stack direction={"row"} spacing={2}>
                <StyledButton
                  // disabled={isLoading}
                  variant="contained"
                  color="error"
                  onClick={handleClose}
                >
                  Cancle
                </StyledButton>

                <StyledButton
                  // disabled={isLoading}
                  type="submit"
                  size="small"
                  variant="contained"
                  sx={{ width: "100px" }}
                >
                  {/* {isLoading ? (
        <CircularProgress
          color="primary"
          size={24}
          sx={{
            color: "white",
          }}
        />
      ) : values?._id ? (
        "Update"
      ) : (
        "Create"
      )} */}
                  Create
                </StyledButton>
              </Stack>
            </Box>
          </FormProvaider>
        </Box>
      </Box>
    </Modal>
  );
};

export default ApplicationModal;
