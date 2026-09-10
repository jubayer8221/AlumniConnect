import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, type DialogProps } from "@mui/material";
import { Close } from "@mui/icons-material";

interface CommonDialogProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: DialogProps["maxWidth"];
  fullWidth?: boolean;
}

export default function CommonDialog({ open, title, onClose, children, actions, maxWidth = "sm", fullWidth = true }: CommonDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth} disableScrollLock>
      {title && (
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pr: 1 }}>
          {title}
          <IconButton onClick={onClose} size="small"><Close /></IconButton>
        </DialogTitle>
      )}
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions sx={{ px: 3, pb: 2 }}>{actions}</DialogActions>}
    </Dialog>
  );
}
