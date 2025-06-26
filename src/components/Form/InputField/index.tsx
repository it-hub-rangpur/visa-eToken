/* eslint-disable react-refresh/only-export-components */
import {
  Box,
  FormHelperText,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Field, FieldProps } from "formik";
import React from "react";

export enum IInputType {
  TEXT = "text",
  NUMBER = "number",
  EMAIL = "email",
  PASSWORD = "password",
}

interface IInput {
  name: string;
  type?: IInputType;
  icon?: React.ReactNode;
  placeholder?: string;
  label?: string;
  inline?: boolean;
  required?: boolean;
  disabled?: boolean;
  value?: string | number;
}

const FormInputField: React.FC<IInput> = ({
  name,
  label,
  placeholder,
  icon,
  type = IInputType.TEXT,
  inline,
  required,
  disabled,
  // value,
}) => {
  return (
    <Box
      maxWidth={"500px"}
      display={"flex"}
      flexDirection={{ xs: "column", md: inline ?? false ? "row" : "column" }}
    >
      <Typography
        variant="body1"
        marginBottom={inline ?? false ? "0px" : "10px"}
        paddingY={inline ?? false ? "15px" : "0px"}
        sx={{
          fontWeight: 500,
          width: "200px",
        }}
      >
        {label ?? label}
      </Typography>

      <Field name={name} type={type}>
        {({ field, meta }: FieldProps) => {
          return (
            <>
              <TextField
                disabled={disabled}
                size="small"
                {...field}
                // value={value}
                type={type}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">{icon}</InputAdornment>
                  ),
                }}
                sx={{
                  width: "100%",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
                required={required}
                variant="outlined"
                placeholder={placeholder}
                error={meta.touched && Boolean(meta.error)}
              />

              <FormHelperText sx={{ marginX: 0 }} error>
                {meta.touched && meta.error}
              </FormHelperText>
            </>
          );
        }}
      </Field>
    </Box>
  );
};

export default FormInputField;
