import { Box, Typography, Button } from "@mui/material";
import { Inbox } from "lucide-react";

interface CommonEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function CommonEmptyState({ icon, title, message, actionLabel, onAction }: CommonEmptyStateProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8, textAlign: "center" }}>
      {icon || <Inbox size={48} className="text-gray-300" />}
      <Typography variant="h6" sx={{ color: "text.secondary", mt: 2 }}>{title}</Typography>
      {message && <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, maxWidth: 400 }}>{message}</Typography>}
      {actionLabel && onAction && (
        <Button variant="contained" color="primary" onClick={onAction} sx={{ mt: 3 }}>{actionLabel}</Button>
      )}
    </Box>
  );
}
