import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, FormHelperText, type SxProps, type Theme } from "@mui/material";

interface SelectOption { label: string; value: string }

interface CommonRadioGroupProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  row?: boolean;
  sx?: SxProps<Theme>;
}

export default function CommonRadioGroup<T extends FieldValues>({
  name, label, control, options, required, disabled, row = true, sx,
}: CommonRadioGroupProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl error={!!fieldState.error} disabled={disabled} sx={sx}>
          <FormLabel required={required}>{label}</FormLabel>
          <RadioGroup {...field} row={row}>
            {options.map((opt) => (
              <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
            ))}
          </RadioGroup>
          {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
