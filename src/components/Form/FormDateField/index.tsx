import { Box, Typography } from "@mui/material";
import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Field, FieldProps } from "formik";
import dayjs from "dayjs";
import theme from "../../../theme";

interface IDate {
  name: string;
  label?: string;
  inline?: boolean;
}

const FormDateField: React.FC<IDate> = ({ name, label, inline }) => {
  return (
    <Box width={"100%"}>
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

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Field name={name}>
          {({ field, meta, form }: FieldProps) => {
            return (
              <DatePicker
                value={dayjs(field.value as Date)}
                views={["day", "month", "year"]}
                format="DD/MM/YYYY"
                sx={{
                  width: "100%",
                  "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                    height: "10px",
                    fontSize: { xs: "14px", md: "16px" },
                    fontWeight: 500,
                    bgcolor: theme.colorConstants?.whitishGray,
                  },
                }}
                onChange={(date) => {
                  void form.setFieldValue(name, date);
                }}
                slotProps={{
                  textField: {
                    helperText: meta.touched && meta.error,
                    error: meta.touched && Boolean(meta.error),
                  },
                }}
              />
            );
          }}
        </Field>
      </LocalizationProvider>
    </Box>
  );
};

export default FormDateField;
