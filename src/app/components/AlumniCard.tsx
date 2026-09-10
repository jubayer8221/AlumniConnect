import { Card, CardContent, Box, Typography, Chip, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVertical, Eye, Pencil, Trash2, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Alumni } from "@/types/alumni";
import { CommonAvatar, CommonStatusBadge } from "@/components/common";

interface AlumniCardProps {
  alumni: Alumni;
  onEdit?: (alumni: Alumni) => void;
  onDelete?: (alumni: Alumni) => void;
}

export default function AlumniCard({ alumni, onEdit, onDelete }: AlumniCardProps) {
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
          boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
          borderColor: "rgba(99,102,241,0.3)",
        },
      }}
    >
      {/* Gradient header strip */}
      <Box sx={{ height: 80, background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)", position: "relative" }}>
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={{ color: "white", bgcolor: "rgba(255,255,255,0.15)", "&:hover": { bgcolor: "rgba(255,255,255,0.25)" } }}>
            <MoreVertical size={16} />
          </IconButton>
        </Box>
        <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} slotProps={{ paper: { sx: { borderRadius: 2, mt: 1 } } }}>
          <MenuItem onClick={() => { setAnchor(null); navigate(`/alumni/${alumni.id}`); }} sx={{ py: 1.25, fontSize: "0.85rem" }}>
            <Eye size={16} style={{ marginRight: 8 }} /> View Profile
          </MenuItem>
          {onEdit && <MenuItem onClick={() => { setAnchor(null); onEdit(alumni); }} sx={{ py: 1.25, fontSize: "0.85rem" }}>
            <Pencil size={16} style={{ marginRight: 8 }} /> Edit
          </MenuItem>}
          {onDelete && <MenuItem onClick={() => { setAnchor(null); onDelete(alumni); }} sx={{ py: 1.25, fontSize: "0.85rem", color: "error.main" }}>
            <Trash2 size={16} style={{ marginRight: 8 }} /> Delete
          </MenuItem>}
        </Menu>
      </Box>

      <CardContent sx={{ p: 2.5, pt: 0, mt: -5 }}>
        {/* Avatar overlapping the gradient */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
          <CommonAvatar
            src={alumni.profilePhoto}
            name={alumni.fullName}
            size={72}
            sx={{
              border: "3px solid white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "0.95rem" }}>{alumni.fullName}</Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1 }}>{alumni.alumniId}</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "center", mb: 1.5 }}>
          <Chip label={alumni.departmentName || "—"} size="small" variant="outlined" sx={{ borderRadius: 1, fontSize: "0.7rem" }} />
          <Chip label={`Batch ${alumni.batch || alumni.graduationYear || "—"}`} size="small" sx={{ borderRadius: 1, fontSize: "0.7rem", bgcolor: "rgba(99,102,241,0.1)", color: "#6366f1", border: "none" }} />
        </Box>

        {alumni.designation && (
          <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "center", fontSize: "0.85rem" }}>{alumni.designation}</Typography>
        )}
        {alumni.companyName && (
          <Typography variant="caption" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mt: 0.5, color: "text.secondary" }}>
            <Briefcase size={12} /> {alumni.companyName}
          </Typography>
        )}
        {alumni.city && (
          <Typography variant="caption" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mt: 0.5, color: "text.secondary" }}>
            <MapPin size={12} /> {alumni.city}, {alumni.country}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center", mt: 1.5, mb: 2 }}>
          <CommonStatusBadge status={alumni.status} />
          {alumni.isVerified && <Chip label="Verified" size="small" color="success" sx={{ borderRadius: 1, fontSize: "0.7rem", height: 20 }} />}
        </Box>

        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={() => navigate(`/alumni/${alumni.id}`)}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, borderColor: "#6366f1", color: "#6366f1", "&:hover": { borderColor: "#4f46e5", bgcolor: "rgba(99,102,241,0.05)" } }}
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
}
