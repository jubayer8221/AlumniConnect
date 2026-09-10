import { Box, Typography, Button } from "@mui/material";
import { ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, bgcolor: "#f8fafc" }}>
      <ShieldX size={64} className="text-red-400" />
      <Typography variant="h4" sx={{ fontWeight: 700 }}>Access Denied</Typography>
      <Typography variant="body1" sx={{ color: "text.secondary" }}>You do not have permission to access this page.</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/login")}>Back to Login</Button>
    </Box>
  );
}
