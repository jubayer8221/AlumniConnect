import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { TextField, type SxProps, type Theme } from "@mui/material";

interface CommonTextAreaProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  fullWidth?: boolean;
  placeholder?: string;
  sx?: SxProps<Theme>;
}

export default function CommonTextArea<T extends FieldValues>({
  name, label, control, required, disabled, rows = 4, fullWidth = true, placeholder, sx,
}: CommonTextAreaProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          required={required}
          disabled={disabled}
          multiline
          rows={rows}
          fullWidth={fullWidth}
          placeholder={placeholder}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          sx={sx}
        />
      )}
    />
  );
}
