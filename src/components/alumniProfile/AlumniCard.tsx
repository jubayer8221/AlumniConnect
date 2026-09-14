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
import type { Alumni } from "@/types/alumni";
import { CommonAvatar, CommonStatusBadge } from "@/components/common";

const NAVY = "#132038";
const TEAL = "#2dd4bf";

interface AlumniCardProps {
  alumni: Alumni;
  onEdit?: (alumni: Alumni) => void;
  onDelete?: (alumni: Alumni) => void;
}

export default function AlumniCard({
  alumni,
  onEdit,
  onDelete,
}: AlumniCardProps) {
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 28px rgba(0,0,0,0.1)",
          borderColor: alpha(TEAL, 0.4),
        },
      }}
    >
      {/* Header strip, matches the profile page's navy hero */}
      <Box
        sx={{
          height: 80,
          background: `linear-gradient(135deg, ${NAVY} 0%, #1c2c4a 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
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
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <IconButton
            size="small"
            onClick={(e) => setAnchor(e.currentTarget)}
            sx={{
              color: "white",
              bgcolor: "rgba(255,255,255,0.15)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
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
              navigate(`/alumni/${alumni.id}`);
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

      <CardContent sx={{ p: 2.5, pt: 0, mt: -5 }}>
        {/* Avatar overlapping the header, with a verified badge like the profile hero */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
          <Box sx={{ position: "relative" }}>
            <CommonAvatar
              src={alumni.profilePhoto}
              name={alumni.fullName}
              size={72}
              sx={{
                border: "3px solid white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
                <BadgeCheck size={12} color="#fff" />
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, fontSize: "0.95rem" }}
          >
            {alumni.fullName}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block", mb: 1 }}
          >
            {alumni.alumniId}
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
            label={alumni.departmentName || "—"}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 1, fontSize: "0.7rem" }}
          />
          <Chip
            label={`Batch ${alumni.batch || alumni.graduationYear || "—"}`}
            size="small"
            sx={{
              borderRadius: 1,
              fontSize: "0.7rem",
              bgcolor: alpha(TEAL, 0.12),
              color: "#0f9c8f",
              border: "none",
              fontWeight: 600,
            }}
          />
        </Box>

        {alumni.designation && (
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, textAlign: "center", fontSize: "0.85rem" }}
          >
            {alumni.designation}
          </Typography>
        )}
        {alumni.companyName && (
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
            <Briefcase size={12} /> {alumni.companyName}
          </Typography>
        )}
        {alumni.city && (
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
            <MapPin size={12} /> {alumni.city}, {alumni.country}
          </Typography>
        )}

        {/* <Box
          sx={{
            display: "flex",
            gap: 0.5,
            justifyContent: "center",
            mt: 1.5,
            mb: 2,
          }}
        >
          <CommonStatusBadge status={alumni.status} />
        </Box> */}

        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={() => navigate(`/alumni/${alumni.id}`)}
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
      </CardContent>
    </Card>
  );
}
