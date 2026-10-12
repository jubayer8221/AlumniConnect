import {
  Popover,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AccountDialogProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  username?: string;
}

export default function HeaderProfileDialog({
  anchorEl,
  onClose,
  username,
}: AccountDialogProps) {
  const navigate = useNavigate();
  const { authUser: user, role, logout } = useAuth();

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
      slotProps={{ paper: { sx: { borderRadius: 2, mt: 1, minWidth: 220 } } }}
    >
      <Typography
        sx={{ px: 2, pt: 1.5, pb: 0.25, fontSize: "0.9rem", fontWeight: 700 }}
      >
        {user?.displayName || username || user?.username}
      </Typography>
      <Typography
        sx={{ px: 2, pb: 1.25, fontSize: "0.72rem", color: "text.secondary" }}
      >
        {role === "ADMIN" ? "Administrator" : "Alumni Member"}
      </Typography>

      <List sx={{ pt: 0 }}>
        <ListItemButton
          onClick={() => go("/alumni/profile")}
          sx={{ py: 1.25, fontSize: "0.875rem" }}
        >
          <ListItemText primary="My Profile" />
        </ListItemButton>
        <ListItemButton
          onClick={() =>
            go(role === "ADMIN" ? "/settings" : "/alumni/settings-privacy")
          }
          sx={{ py: 1.25, fontSize: "0.875rem" }}
        >
          <ListItemText
            primary={role === "ADMIN" ? "Admin Settings" : "Settings & Privacy"}
          />
        </ListItemButton>
        <Divider />
        <ListItemButton
          onClick={() => {
            onClose();
            void logout();
          }}
          sx={{ py: 1.25, fontSize: "0.875rem", color: "error.main" }}
        >
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Popover>
  );
}
