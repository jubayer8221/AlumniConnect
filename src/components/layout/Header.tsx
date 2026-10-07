import { AppBar, Toolbar, IconButton, Box, Avatar, Badge } from "@mui/material";
import {
  Menu as MenuIcon,
  Bell,
  PanelLeftClose,
  PanelLeft,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks";
import {
  setTheme,
  toggleMobileSidebar,
  toggleSidebarCollapse,
} from "@/store/Slice/uiSlice";
import { useAuth } from "@/hooks/useAuth";
import HeaderProfileDialog from "../alumniProfile/HeaderProfileDialog";
import NotificationsPopover, {
  getUnseenNoticeCount,
} from "./NotificationsPopover";

export default function Header() {
  const dispatch = useAppDispatch();
  const { authUser: user } = useAuth();
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const colorMode = useAppSelector((s) => s.ui.theme);
  const notices = useAppSelector((s) => s.notices.items);
  const [openDialog, setopenDialog] = useState<HTMLElement | null>(null);
  const [notifAnchor, setNotifAnchor] = useState<HTMLElement | null>(null);

  // Recompute on every render — cheap (max 20 rows)
  const unseenCount = getUnseenNoticeCount(notices);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.default",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar
        sx={{ minHeight: { xs: 60, md: 68 }, px: { xs: 1.5, sm: 2.5, md: 3 } }}
      >
        <IconButton
          sx={{ display: { xs: "flex", md: "none" }, color: "inherit" }}
          onClick={() => dispatch(toggleMobileSidebar())}
        >
          <MenuIcon size={22} />
        </IconButton>

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
          onClick={() =>
            dispatch(setTheme(colorMode === "dark" ? "light" : "dark"))
          }
          sx={{ mr: 1, color: "inherit" }}
        >
          {colorMode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </IconButton>

        {/* ---- Notifications bell ---- */}
        <IconButton
          size="small"
          onClick={(e) => setNotifAnchor(e.currentTarget)}
          aria-label={`Notifications${
            unseenCount > 0 ? ` (${unseenCount} new)` : ""
          }`}
          sx={{
            mr: 1,
            color: "inherit",
            bgcolor: "action.hover",
            "&:hover": { bgcolor: "action.selected" },
          }}
        >
          <Badge
            badgeContent={unseenCount}
            color="error"
            max={99}
            overlap="circular"
            invisible={unseenCount === 0}
          >
            <Bell size={20} />
          </Badge>
        </IconButton>

        {/* ---- Profile avatar ---- */}
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
            src={user?.profilePhoto}
            alt={user?.displayName || user?.username || "User"}
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
          >
            {!user?.profilePhoto && user?.username?.[0]?.toUpperCase()}
          </Avatar>
        </Box>

        <HeaderProfileDialog
          anchorEl={openDialog}
          onClose={() => setopenDialog(null)}
          username={user?.username}
        />

        <NotificationsPopover
          anchorEl={notifAnchor}
          onClose={() => setNotifAnchor(null)}
        />
      </Toolbar>
    </AppBar>
  );
}
