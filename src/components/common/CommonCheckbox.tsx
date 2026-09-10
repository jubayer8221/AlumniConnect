import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Checkbox, FormControlLabel, FormGroup, type SxProps, type Theme } from "@mui/material";

interface CommonCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

export default function CommonCheckbox<T extends FieldValues>({
  name, label, control, disabled, sx,
}: CommonCheckboxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormGroup sx={sx}>
          <FormControlLabel
            control={<Checkbox {...field} checked={!!field.value} disabled={disabled} />}
            label={label}
          />
        </FormGroup>
      )}
    />
  );
}
