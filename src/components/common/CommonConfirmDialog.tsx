import { Button } from "@mui/material";
import CommonDialog from "./CommonDialog";
import { AlertTriangle } from "lucide-react";

interface CommonConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  color?: "error" | "primary" | "warning";
}

export default function CommonConfirmDialog({
  open, title = "Confirm Action", message, confirmLabel = "Confirm", cancelLabel = "Cancel",
  onConfirm, onCancel, loading = false, color = "error",
}: CommonConfirmDialogProps) {
  return (
    <CommonDialog
      open={open}
      title={title}
      onClose={onCancel}
      maxWidth="xs"
      actions={
        <>
          <Button onClick={onCancel} disabled={loading}>{cancelLabel}</Button>
          <Button onClick={onConfirm} variant="contained" color={color} disabled={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <AlertTriangle size={24} className="text-amber-500 shrink-0 mt-1" />
        <p className="text-gray-700">{message}</p>
      </div>
    </CommonDialog>
  );
}
