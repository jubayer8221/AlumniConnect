import { Box, Typography, Button } from "@mui/material";
import { AlertCircle } from "lucide-react";

interface CommonErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function CommonErrorState({ message = "Something went wrong", onRetry }: CommonErrorStateProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8, gap: 2 }}>
      <AlertCircle size={48} className="text-red-400" />
      <Typography variant="h6" sx={{ color: "error.main" }}>{message}</Typography>
      {onRetry && <Button variant="outlined" color="primary" onClick={onRetry}>Try Again</Button>}
    </Box>
  );
}
