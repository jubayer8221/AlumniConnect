import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Alert,
  IconButton,
} from "@mui/material";
import { Eye, EyeOff, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import { CommonInputField, CommonButton } from "@/components/common";
import { useAuth } from "@/hooks/useAuth";
import CommonInputField from "../common/CommonInputField";
import CommonButton from "../common/CommonButton";

const schema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Must be at least 6 characters")
    .max(100, "Too long"),
  confirmPassword: yup
    .string()
    .required("Please confirm")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

type FormValues = yup.InferType<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordDialog({ open, onClose }: Props) {
  const { changePassword } = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await changePassword({
        confirmNewPassword: data.confirmPassword,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      reset();
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to change password",
      );
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    if (loading) return;
    reset();
    setError(null);
    setSuccess(false);
    onClose();
  };

  const eye = (show: boolean, setShow: (v: boolean) => void) => (
    <IconButton onClick={() => setShow(!show)} edge="end" size="small">
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </IconButton>
  );

  return (
    <Dialog open={open} onClose={close} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Change Password
        <IconButton size="small" onClick={close} disabled={loading}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2.5}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && (
              <Alert severity="success">Password changed successfully.</Alert>
            )}

            <CommonInputField
              name="currentPassword"
              label="Current Password"
              control={control}
              type={showCurrent ? "text" : "password"}
              required
              endAdornment={eye(showCurrent, setShowCurrent)}
            />
            <CommonInputField
              name="newPassword"
              label="New Password"
              control={control}
              type={showNew ? "text" : "password"}
              required
              endAdornment={eye(showNew, setShowNew)}
            />
            <CommonInputField
              name="confirmPassword"
              label="Confirm New Password"
              control={control}
              type={showConfirm ? "text" : "password"}
              required
              endAdornment={eye(showConfirm, setShowConfirm)}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={close}
            disabled={loading}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <CommonButton
            type="submit"
            loading={loading}
            sx={{ textTransform: "none" }}
          >
            Change Password
          </CommonButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
