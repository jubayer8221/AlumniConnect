import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  alpha,
  Stack,
} from "@mui/material";
import {
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Briefcase,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AlumniProfileFullModel } from "@/types/alumni";
import { CommonAvatar } from "@/components/common";
import ConnectButton from "@/components/network/ConnectButton";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/theme/colors";

const NAVY = colors.darkSurfaceAlt;
const TEAL = colors.accent;

interface AlumniCardProps {
  alumni: AlumniProfileFullModel;
  onEdit?: (alumni: AlumniProfileFullModel) => void;
  onDelete?: (alumni: AlumniProfileFullModel) => void;
}

export default function AlumniCard({
  alumni,
  onEdit,
  onDelete,
}: AlumniCardProps) {
  const navigate = useNavigate();
  const { authUser: me } = useAuth();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const p = alumni.personalInformation;
  const c = alumni.contactInformation;
  const firstEdu = alumni.academicInformation[0];
  const firstJob = alumni.jobExperience[0];

  const isOwner = Boolean(
    me &&
    (me.id === String(alumni.userID) ||
      me.alumniId === String(alumni.alumniID)),
  );

  /* ---------- Connect visibility ----------
     Show the button whenever:
       - it's not the current user's own card
       - the target has a valid userID to send the request to
     The ConnectButton itself resolves the actual state (Connect / Pending /
     Accept / Message / Disconnect) via the API.
  -------------------------------------------- */
  const showConnect = !isOwner && alumni.userID > 0;

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 28px rgba(var(--rgb-black), 0.1)",
          borderColor: alpha(TEAL, 0.4),
        },
      }}
    >
      {/* ---------- HEADER: cover photo (fallback gradient) ---------- */}
      <Box
        sx={{
          height: p.coverPhoto ? 120 : 80,
          position: "relative",
          overflow: "hidden",
          ...(p.coverPhoto
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 100%), url(${p.coverPhoto})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                background: `linear-gradient(135deg, ${NAVY} 0%, var(--color-dark-surface-navy) 100%)`,
              }),
        }}
      >
        {!p.coverPhoto && (
          <Box
            sx={{
              position: "absolute",
              top: -30,
              left: -30,
              width: 110,
              height: 110,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(TEAL, 0.25)} 0%, transparent 70%)`,
            }}
          />
        )}
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <IconButton
            size="small"
            onClick={(e) => setAnchor(e.currentTarget)}
            sx={{
              color: "white",
              bgcolor: "rgba(var(--rgb-white), 0.15)",
              backdropFilter: "blur(6px)",
              "&:hover": { bgcolor: "rgba(var(--rgb-white), 0.25)" },
            }}
          >
            <MoreVertical size={16} />
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchor}
          open={!!anchor}
          onClose={() => setAnchor(null)}
          slotProps={{ paper: { sx: { borderRadius: 2, mt: 1 } } }}
        >
          <MenuItem
            onClick={() => {
              setAnchor(null);
              navigate(`/alumni/profile-details/${alumni.alumniID}`);
            }}
            sx={{
              py: 1.25,
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Eye size={16} /> View Profile
          </MenuItem>
          {onEdit && (
            <MenuItem
              onClick={() => {
                setAnchor(null);
                onEdit(alumni);
              }}
              sx={{
                py: 1.25,
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Pencil size={16} /> Edit
            </MenuItem>
          )}
          {onDelete && (
            <MenuItem
              onClick={() => {
                setAnchor(null);
                onDelete(alumni);
              }}
              sx={{
                py: 1.25,
                fontSize: "0.85rem",
                color: "error.main",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Trash2 size={16} /> Delete
            </MenuItem>
          )}
        </Menu>
      </Box>

      {/* ---------- BODY ---------- */}
      <CardContent
        sx={{
          p: 2.5,
          pt: 0,
          mt: p.coverPhoto ? -4 : -5,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
          <Box sx={{ position: "relative" }}>
            <CommonAvatar
              src={p.profilePhoto ?? undefined}
              name={p.fullName}
              size={72}
              sx={{
                border: "3px solid white",
                boxShadow: "0 4px 12px rgba(var(--rgb-black), 0.1)",
              }}
            />
            {alumni.isVerified && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  bgcolor: TEAL,
                  border: "2px solid white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BadgeCheck size={12} color="var(--color-white)" />
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, fontSize: "0.95rem" }}
          >
            {p.fullName}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            flexWrap: "wrap",
            justifyContent: "center",
            mb: 1.5,
          }}
        >
          <Chip
            label={firstEdu?.departmentName || "—"}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 1, fontSize: "0.7rem" }}
          />
          <Chip
            label={`Batch ${firstEdu?.batch || firstEdu?.graduationYear || "—"}`}
            size="small"
            sx={{
              borderRadius: 1,
              fontSize: "0.7rem",
              bgcolor: alpha(TEAL, 0.12),
              color: "var(--color-primary)",
              border: "none",
              fontWeight: 600,
            }}
          />
        </Box>

        {firstJob?.designation && (
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, textAlign: "center", fontSize: "0.85rem" }}
          >
            {firstJob.designation}
          </Typography>
        )}
        {firstJob?.companyname && (
          <Typography
            variant="caption"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              mt: 0.5,
              color: "text.secondary",
            }}
          >
            <Briefcase size={12} /> {firstJob.companyname}
          </Typography>
        )}
        {c.presentDistrict && (
          <Typography
            variant="caption"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              mt: 0.5,
              color: "text.secondary",
            }}
          >
            <MapPin size={12} /> {c.presentDistrict}
            {c.presentCountry ? `, ${c.presentCountry}` : ""}
          </Typography>
        )}

        {/* ---------- ACTIONS ---------- */}
        <Stack spacing={1} sx={{ mt: "auto", pt: 2 }}>
          {showConnect && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ConnectButton otherUserID={alumni.userID} compact />
            </Box>
          )}

          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={() => navigate(`/alumni/profile-details/${alumni.alumniID}`)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              borderColor: NAVY,
              color: NAVY,
              "&:hover": { borderColor: NAVY, bgcolor: alpha(TEAL, 0.08) },
            }}
          >
            View Profile
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
