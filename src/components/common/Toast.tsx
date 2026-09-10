import { Snackbar, Alert } from "@mui/material";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { removeToast } from "@/Slice/uiSlice";

export default function ToastContainer() {
  const toasts = useAppSelector((s) => s.ui.toasts);
  const dispatch = useAppDispatch();
  return (
    <>
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open
          autoHideDuration={4000}
          onClose={() => dispatch(removeToast(toast.id))}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={toast.severity}
            onClose={() => dispatch(removeToast(toast.id))}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
