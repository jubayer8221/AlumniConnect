import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box } from "@mui/material";

interface CommonDatePickerProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
  maxDate?: Date;
  minDate?: Date;
  helperText?: string;
}

// Shared sx — mirrors CommonInputField so heights, colors, and disabled look match
export const commonDateFieldSx = {
  width: "100%",
  // Force the pickers input to the same height as a small TextField (40px)
  "& .MuiPickersInputBase-root, & .MuiPickersOutlinedInput-root, & .MuiInputBase-root":
    {
      height: "40px",
    },
  "& .MuiPickersInputBase-root.MuiPickersInputBase-sizeSmall, & .MuiPickersOutlinedInput-root.MuiPickersOutlinedInput-sizeSmall, & .MuiInputBase-sizeSmall":
    {
      height: "40px",
    },
  "& .MuiInputBase-input, & .MuiPickersInputBase-input": {
    padding: "8.5px 14px",
    boxSizing: "border-box",
    WebkitTextFillColor: "black",
  },
  "& .MuiInputLabel-root": { color: "black" },
  // Disabled look identical to CommonInputField
  "& .MuiInputBase-input.Mui-disabled, & .MuiPickersInputBase-input.Mui-disabled":
    {
      backgroundColor: "#f5f5f5ff",
      color: "#999999ff",
      WebkitTextFillColor: "#999999ff",
      borderRadius: "6px",
    },
  "& .MuiInputLabel-root.Mui-disabled": { color: "#999999ff" },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(0, 0, 0, 0.23)",
  },
} as const;

export default function CommonDatePicker<T extends FieldValues>({
  name,
  label,
  control,
  required,
  disabled,
  readOnly,
  fullWidth = true,
  size = "small", // match CommonInputField default
  maxDate,
  minDate,
  helperText,
}: CommonDatePickerProps<T>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Box sx={{ flex: 1, width: "100%" }}>
            <DatePicker
              label={label}
              value={field.value ? new Date(field.value) : null}
              onChange={(date) => {
                field.onChange(date ? date.toISOString().split("T")[0] : "");
              }}
              onClose={field.onBlur}
              disabled={disabled}
              readOnly={readOnly}
              maxDate={maxDate}
              minDate={minDate}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  required,
                  fullWidth,
                  size, // "small" now matches CommonInputField
                  error: !!fieldState.error,
                  helperText: fieldState.error?.message ?? helperText ?? "",
                  // Use the slot props for the actual input, not the wrapper
                  sx: commonDateFieldSx,
                },
                // In MUI X v7 you can target the inner input directly
                inputAdornment: {
                  position: "end",
                },
              }}
            />
          </Box>
        )}
      />
    </LocalizationProvider>
  );
}
