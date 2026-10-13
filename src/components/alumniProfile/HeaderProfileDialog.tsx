import {
  Popover,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import ChangePasswordDialog from "../login/ChangePasswordDialog";
import {
  LogOut,
  User,
  Settings,
  Lock,
  Bell,
  HelpCircle,
  ShieldCheck,
  Camera,
  Newspaper,
  Calendar,
} from "lucide-react";

interface AccountDialogProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  username?: string;
}

/** First letters of the user's name — used when there's no profile photo. */
function initialsOf(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function HeaderProfileDialog({
  anchorEl,
  onClose,
  username,
}: AccountDialogProps) {
  const navigate = useNavigate();
  const { authUser: user, role, logout } = useAuth();
  const [changePwOpen, setChangePwOpen] = useState(false);

  const displayName =
    user?.displayName || user?.fullName || username || user?.username || "User";
  const displayEmail = user?.email ?? "";
  const photoUrl = user?.profilePhoto ?? "";
  const isAdmin = role === "ADMIN";

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const openChangePassword = () => {
    onClose();
    setChangePwOpen(true);
  };

  const handleLogout = () => {
    onClose();
    void logout();
  };

  return (
    <>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2.5,
              mt: 1,
              minWidth: 280,
              overflow: "hidden",
              boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            },
          },
        }}
      >
        {/* ---------- Header: avatar + name + role ---------- */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.75,
            px: 2,
            py: 2,
            bgcolor: "background.default",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Avatar
            src={photoUrl || undefined}
            alt={displayName}
            sx={{
              width: 52,
              height: 52,
              bgcolor: "primary.main",
              fontSize: "1.1rem",
              fontWeight: 700,
              border: "2px solid",
              borderColor: "background.paper",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {initialsOf(displayName)}
          </Avatar>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              noWrap
              sx={{ fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.25 }}
            >
              {displayName}
            </Typography>

            {displayEmail && (
              <Typography
                noWrap
                sx={{
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  lineHeight: 1.3,
                }}
              >
                {displayEmail}
              </Typography>
            )}

            <Chip
              icon={isAdmin ? <ShieldCheck size={14} /> : undefined}
              label={isAdmin ? "Administrator" : "Alumni Member"}
              size="small"
              color={isAdmin ? "primary" : "default"}
              variant={isAdmin ? "filled" : "outlined"}
              sx={{
                mt: 0.75,
                height: 22,
                fontSize: "0.68rem",
                fontWeight: 600,
                "& .MuiChip-icon": { ml: 0.5, mr: -0.25 },
              }}
            />
          </Box>
        </Box>

        {/* ---------- Quick menu ---------- */}
        <List sx={{ py: 0.5 }}>
          <ListItemButton
            onClick={() => go("/alumni/profile")}
            sx={{ py: 1.1, px: 2, gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "text.secondary" }}>
              <User size={18} />
            </ListItemIcon>
            <ListItemText
              primary="My Profile"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            />
          </ListItemButton>

          {/* <ListItemButton
            onClick={() => go("/alumni/profile/edit")}
            sx={{ py: 1.1, px: 2, gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "text.secondary" }}>
              <Camera size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Edit Profile"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            />
          </ListItemButton> */}

          <ListItemButton
            onClick={openChangePassword}
            sx={{ py: 1.1, px: 2, gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "text.secondary" }}>
              <Lock size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Change Password"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            />
          </ListItemButton>

          {/* <ListItemButton
            onClick={() =>
              go(isAdmin ? "/settings" : "/alumni/settings-privacy")
            }
            sx={{ py: 1.1, px: 2, gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "text.secondary" }}>
              <Settings size={18} />
            </ListItemIcon>
            <ListItemText
              primary={isAdmin ? "Admin Settings" : "Settings & Privacy"}
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            />
          </ListItemButton> */}

          <ListItemButton
            onClick={() => go("/alumni/notices")}
            sx={{ py: 1.1, px: 2, gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "text.secondary" }}>
              <Bell size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Notices"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            />
          </ListItemButton>

          <ListItemButton
            onClick={() => go("/alumni/events")}
            sx={{ py: 1.1, px: 2, gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "text.secondary" }}>
              <Calendar size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Events"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            />
          </ListItemButton>

          <ListItemButton
            onClick={() => go("/alumni/news")}
            sx={{ py: 1.1, px: 2, gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "text.secondary" }}>
              <Newspaper size={18} />
            </ListItemIcon>
            <ListItemText
              primary="News"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            />
          </ListItemButton>

          {/* <ListItemButton
            onClick={() => go("/help")}
            sx={{ py: 1.1, px: 2, gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "text.secondary" }}>
              <HelpCircle size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Help & Support"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            />
          </ListItemButton> */}

          <Divider sx={{ my: 0.5 }} />

          <ListItemButton
            onClick={handleLogout}
            sx={{
              py: 1.1,
              px: 2,
              gap: 1.5,
              color: "error.main",
              "&:hover": { bgcolor: "error.50" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "error.main" }}>
              <LogOut size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "error.main",
              }}
            />
          </ListItemButton>
        </List>
      </Popover>

      {/* ---------- Change password dialog (outside popover) ---------- */}
      <ChangePasswordDialog
        open={changePwOpen}
        onClose={() => setChangePwOpen(false)}
      />
    </>
  );
}
