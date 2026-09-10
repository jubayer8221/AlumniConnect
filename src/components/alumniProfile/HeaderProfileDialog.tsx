import {
  Popover,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logoutAsync } from "@/Slice/authSlice";

interface AccountDialogProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  username?: string;
  //   role?: UserRole | null;
}

export default function HeaderProfileDialog({
  anchorEl,
  onClose,
  username,
}: AccountDialogProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { role, user } = useAppSelector((s) => s.auth);

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: { sx: { borderRadius: 2, mt: 1, minWidth: 220 } },
      }}
    >
      <Typography
        sx={{ px: 2, pt: 1.5, pb: 1, fontSize: "0.9rem", fontWeight: 600 }}
      >
        {username || "Account"}
      </Typography>
      <List sx={{ pt: 0 }}>
        <ListItemButton
          onClick={() => go("/alumni/profile")}
          sx={{ py: 1.25, fontSize: "0.875rem" }}
        >
          <ListItemText primary="My Profile" />
        </ListItemButton>
        <ListItemButton
          onClick={() => go(role === "ADMIN" ? "/settings" : "/alumni/account")}
          sx={{ py: 1.25, fontSize: "0.875rem" }}
        >
          <ListItemText
            primary={role === "ADMIN" ? "Admin Settings" : "My Account"}
          />
        </ListItemButton>
        <Divider />
        <ListItemButton
          onClick={() => {
            onClose();
            dispatch(logoutAsync());
          }}
          sx={{ py: 1.25, fontSize: "0.875rem", color: "error.main" }}
        >
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Popover>
  );
}
