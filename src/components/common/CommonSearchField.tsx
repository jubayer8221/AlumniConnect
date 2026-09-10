import { TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

interface CommonSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
  disabled?: boolean;
}

export default function CommonSearchField({
  value, onChange, placeholder = "Search...", fullWidth = true, size = "small", disabled,
}: CommonSearchFieldProps) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
      slotProps={{
        input: {
          startAdornment: (<InputAdornment position="start"><Search fontSize="small" /></InputAdornment>),
        },
      }}
    />
  );
}
