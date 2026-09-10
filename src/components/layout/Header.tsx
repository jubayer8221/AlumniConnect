import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Bell,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Moon,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks";
import {
  setTheme,
  toggleMobileSidebar,
  toggleSidebarCollapse,
} from "@/Slice/uiSlice";
import { logoutAsync } from "@/Slice/authSlice";
import HeaderProfileDialog from "../alumniProfile/HeaderProfileDialog";

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, role } = useAppSelector((s) => s.auth);
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const colorMode = useAppSelector((s) => s.ui.theme);
  const [openDialog, setopenDialog] = useState<HTMLElement | null>(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "primary.dark",
        borderBottom: "1px solid",
        borderColor: "rgba(255,255,255,0.12)",
        color: "common.white",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar
        sx={{ minHeight: { xs: 60, md: 68 }, px: { xs: 1.5, sm: 2.5, md: 3 } }}
      >
        {/* Mobile menu toggle */}
        <IconButton
          sx={{ display: { xs: "flex", md: "none" }, color: "inherit" }}
          onClick={() => dispatch(toggleMobileSidebar())}
        >
          <MenuIcon size={22} />
        </IconButton>

        {/* Desktop sidebar collapse toggle */}
        <IconButton
          sx={{
            display: { xs: "none", md: "flex" },
            color: "inherit",
            mr: 1.5,
          }}
          onClick={() => dispatch(toggleSidebarCollapse())}
        >
          {collapsed ? <PanelLeft size={22} /> : <PanelLeftClose size={22} />}
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          size="small"
          title={
            colorMode === "dark"
              ? "Switch to light theme"
              : "Switch to dark theme"
          }
          aria-label={
            colorMode === "dark"
              ? "Switch to light theme"
              : "Switch to dark theme"
          }
          onClick={() =>
            dispatch(setTheme(colorMode === "dark" ? "light" : "dark"))
          }
          sx={{ mr: 1, color: "inherit" }}
        >
          {colorMode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </IconButton>

        {/* <Chip
          label={role === "ADMIN" ? "Administrator" : "Alumni"}
          size="small"
          sx={{
            mr: 1.5, display: { xs: "none", sm: "flex" },
            bgcolor: role === "ADMIN" ? "rgba(99,102,241,0.1)" : "rgba(236,72,153,0.1)",
            color: role === "ADMIN" ? "#6366f1" : "#ec4899",
            fontWeight: 600, border: "none",
          }}
        /> */}

        <IconButton
          size="small"
          sx={{
            mr: 1,
            color: "inherit",
            bgcolor: "rgba(255,255,255,0.08)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
          }}
        >
          <Bell size={20} />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            borderRadius: 10,
            py: 0.5,
            px: 1,
            "&:hover": { bgcolor: "action.hover" },
          }}
          onClick={(e) => setopenDialog(e.currentTarget)}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
          >
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
        </Box>

        <HeaderProfileDialog
          anchorEl={openDialog}
          onClose={() => setopenDialog(null)}
          username={user?.username}
        />
      </Toolbar>
    </AppBar>
  );
}
