import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  TextField,
  InputAdornment,
  type SxProps,
  type Theme,
  type OutlinedInputProps,
} from "@mui/material";
import { format, isValid } from "date-fns";
import { DateField } from "@mui/x-date-pickers/DateField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { commonDateFieldSx } from "./CommonDatePicker";

interface CommonInputFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  type?: string;
  multiline?: boolean;
  rows?: number;
  helperText?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
  sx?: SxProps<Theme>;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  InputProps?: Partial<OutlinedInputProps>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CommonInputField<T extends FieldValues>({
  name,
  label,
  control,
  placeholder,
  required,
  disabled,
  readOnly,
  type = "text",
  multiline,
  rows,
  helperText,
  fullWidth = true,
  size = "small",
  sx,
  startAdornment,
  endAdornment,
  InputProps,
  onChange,
}: CommonInputFieldProps<T>) {
  if (type === "date") {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => {
            const rawValue = field.value == null ? "" : String(field.value);
            const value = rawValue
              ? new Date(`${rawValue.slice(0, 10)}T00:00:00`)
              : null;
            const validValue =
              value && !Number.isNaN(value.getTime()) ? value : null;

            return (
              <DateField
                label={label}
                value={validValue}
                onChange={(date) => {
                  const nextValue =
                    date && isValid(date) ? format(date, "yyyy-MM-dd") : "";
                  field.onChange(nextValue);
                  onChange?.({
                    target: { name: field.name, value: nextValue },
                  } as unknown as React.ChangeEvent<HTMLInputElement>);
                }}
                onBlur={field.onBlur}
                disabled={disabled}
                readOnly={readOnly}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    required,
                    fullWidth,
                    size,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message ?? helperText ?? "",
                    sx: [commonDateFieldSx, sx].filter(
                      Boolean,
                    ) as SxProps<Theme>,
                    slotProps: {
                      input: {
                        startAdornment: startAdornment ? (
                          <InputAdornment position="start">
                            {startAdornment}
                          </InputAdornment>
                        ) : undefined,
                        endAdornment: endAdornment ? (
                          <InputAdornment position="end">
                            {endAdornment}
                          </InputAdornment>
                        ) : undefined,
                      },
                    },
                  },
                }}
              />
            );
          }}
        />
      </LocalizationProvider>
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          slotProps={{
            input: {
              readOnly,
              type,
              startAdornment: startAdornment ? (
                <InputAdornment position="start">
                  {startAdornment}
                </InputAdornment>
              ) : undefined,
              endAdornment: endAdornment ? (
                <InputAdornment position="end">{endAdornment}</InputAdornment>
              ) : undefined,
              ...InputProps,
            },
          }}
          onChange={(e) => {
            field.onChange(e);
            onChange?.(e as React.ChangeEvent<HTMLInputElement>);
          }}
          multiline={multiline}
          rows={rows}
          size={size}
          fullWidth={fullWidth}
          error={!!fieldState.error}
          helperText={fieldState.error ? fieldState.error.message : helperText}
          sx={sx}
        />
      )}
    />
  );
}
