import { forwardRef, ReactNode, InputHTMLAttributes } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  SxProps,
  Theme,
  TextFieldProps,
} from "@mui/material";
import { Search, X } from "lucide-react"; // Option B — matches your page's <Search size={16} />

export interface CommonSearchFieldProps {
  value: string;
  onChange: (value: string) => void;

  placeholder?: string;
  showSearchIcon?: boolean;
  startIcon?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  onEnter?: () => void;

  size?: "small" | "medium";
  fullWidth?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  ariaLabel?: string;

  sx?: SxProps<Theme>;
  inputSx?: SxProps<Theme>;

  /** MUI v6 escape hatches. */
  slotProps?: TextFieldProps["slotProps"];
  /** Raw HTML input attributes (aria-*, data-*, etc.). */
  htmlInputProps?: InputHTMLAttributes<HTMLInputElement>;
}

const CommonSearchField = forwardRef<HTMLDivElement, CommonSearchFieldProps>(
  function CommonSearchField(
    {
      value,
      onChange,
      placeholder = "Search...",
      showSearchIcon = true,
      startIcon,
      clearable = true,
      onClear,
      onEnter,
      size = "small",
      fullWidth = true,
      disabled,
      autoFocus,
      name,
      id,
      ariaLabel,
      sx,
      inputSx,
      slotProps,
      htmlInputProps,
    },
    ref,
  ) {
    const adornment =
      startIcon !== undefined ? (
        startIcon
      ) : showSearchIcon ? (
        <InputAdornment position="start">
          <Search size={16} style={{ opacity: 0.6 }} />
        </InputAdornment>
      ) : undefined;

    const clearAdornment =
      clearable && value ? (
        <InputAdornment position="end">
          <IconButton
            size="small"
            onClick={() => {
              onChange("");
              onClear?.();
            }}
            aria-label="Clear search"
          >
            <X size={14} />
          </IconButton>
        </InputAdornment>
      ) : undefined;

    return (
      <TextField
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onEnter?.();
        }}
        placeholder={placeholder}
        fullWidth={fullWidth}
        size={size}
        disabled={disabled}
        autoFocus={autoFocus}
        sx={[
          {
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: "background.paper",
            },
          },
          ...(Array.isArray(inputSx) ? inputSx : inputSx ? [inputSx] : []),
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        slotProps={{
          ...slotProps,
          htmlInput: {
            "aria-label": ariaLabel ?? placeholder,
            ...htmlInputProps,
            ...(slotProps?.htmlInput ?? {}),
          },
          input: {
            startAdornment: adornment,
            endAdornment: clearAdornment,
            ...(slotProps?.input ?? {}),
          },
        }}
      />
    );
  },
);

export default CommonSearchField;
