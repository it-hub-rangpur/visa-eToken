import {
  Box,
  MenuItem,
  Select,
  Typography,
  Autocomplete,
  TextField,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { Field, FieldProps } from "formik";
import React from "react";

interface ISelect {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: { label: string; value: any }[];
  placeholder?: string;
  label?: string;
  disableClearable?: boolean;
  searchableField?: boolean;
  required?: boolean;
  inline?: boolean;
}

const FormSelectField: React.FC<ISelect> = ({
  name,
  placeholder,
  label,
  options,
  disableClearable,
  searchableField,
  required,
  inline,
}) => {
  return (
    <Box maxWidth={"500px"}>
      <Typography
        variant="body1"
        marginBottom={inline ?? false ? "0px" : "5px"}
        paddingY={inline ?? false ? "15px" : "0px"}
        sx={{
          fontWeight: 500,
          width: "200px",
        }}
      >
        {label ?? label}
      </Typography>

      <Field name={name}>
        {({ field, meta, form }: FieldProps<string>) => {
          const selectedOption = options?.find(
            (option) => option.value === field.value
          );

          return (
            <>
              {searchableField !== undefined && searchableField !== null ? (
                <Autocomplete
                  size="small"
                  value={selectedOption ?? null}
                  disablePortal={disableClearable}
                  disableClearable={disableClearable}
                  options={options}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  sx={{
                    width: "100%",
                  }}
                  onChange={(_, value) => {
                    form.setFieldValue(field.name, value?.value ?? "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                      {...params}
                      name={name}
                      required
                      variant="outlined"
                      inputProps={{
                        ...params.inputProps,
                        "aria-label": "Without label",
                      }}
                      placeholder={placeholder}
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                />
              ) : (
                <FormControl
                  sx={{
                    width: "100%",
                  }}
                  error={meta.touched && Boolean(meta.error)}
                >
                  <Select
                    required={required}
                    size="small"
                    sx={{
                      width: "100%",
                      fontSize: "14px",
                      fontWeight: 500,
                      textTransform: "capitalize",
                    }}
                    {...field}
                    name={name}
                    value={field.value}
                    displayEmpty
                    renderValue={(selected) => {
                      if (
                        selected === null ||
                        selected === undefined ||
                        selected === ""
                      ) {
                        return placeholder;
                      }
                      return options.find((option) => option.value === selected)
                        ?.label;
                    }}
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {options?.map((item, i) => (
                      <MenuItem
                        key={i}
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                        value={item.value}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>

                  <FormHelperText sx={{ marginX: 0 }}>
                    {meta.touched && meta.error}
                  </FormHelperText>
                </FormControl>
              )}
            </>
          );
        }}
      </Field>
    </Box>
  );
};

export default FormSelectField;
