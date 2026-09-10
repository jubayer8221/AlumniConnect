import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { TextField, MenuItem, type SxProps, type Theme } from "@mui/material";

interface SelectOption {
  label: string;
  value: string | number;
}

interface CommonSelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
  placeholder?: string;
  sx?: SxProps<Theme>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CommonSelectField<T extends FieldValues>({
  name,
  label,
  control,
  options,
  required,
  disabled,
  fullWidth = true,
  size = "small",
  placeholder,
  sx,
  onChange,
}: CommonSelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          value={field.value ?? ""}
          select
          label={label}
          required={required}
          disabled={disabled}
          fullWidth={fullWidth}
          size={size}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          sx={sx}
          slotProps={{
            // Force the label to always sit in its "shrunk" position above
            // the field. Without this, an empty select with displayEmpty
            // renders the placeholder text in the same spot the resting
            // label would occupy, so the two visually stack on top of
            // each other until the field gets a real value.
            inputLabel: {
              shrink: true,
            },
            select: {
              displayEmpty: Boolean(placeholder),
              renderValue: (selected) => {
                const value = String(selected ?? "");
                if (!value && placeholder) return <em>{placeholder}</em>;
                return (
                  options.find((option) => String(option.value) === value)
                    ?.label ?? value
                );
              },
            },
          }}
          onChange={(e) => {
            field.onChange(e);
            onChange?.(e as React.ChangeEvent<HTMLInputElement>);
          }}
        >
          {placeholder && (
            <MenuItem value="">
              <em>{placeholder}</em>
            </MenuItem>
          )}
          {options
            .filter((opt) => !placeholder || opt.value !== "")
            .map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
        </TextField>
      )}
    />
  );
}
