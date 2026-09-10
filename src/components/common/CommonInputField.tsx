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
