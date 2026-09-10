import { Button, type ButtonProps, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.2s ease",
})) as typeof Button;

interface CommonButtonProps extends ButtonProps {
  loading?: boolean;
  fullWidth?: boolean;
}

export default function CommonButton({
  children,
  loading = false,
  variant = "contained",
  color = "primary",
  fullWidth = false,
  disabled,
  startIcon,
  ...rest
}: CommonButtonProps) {
  return (
    <StyledButton
      variant={variant}
      color={color}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
      {...rest}
    >
      {children}
    </StyledButton>
  );
}
