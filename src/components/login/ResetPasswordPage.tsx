import { useState } from "react";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Box, Typography, Alert, Stack, Link, IconButton } from "@mui/material";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "@/services/api/apiClient";
import { getApiErrorMessage } from "@/utils/apiError";
import CommonButton from "../common/CommonButton";
import CommonInputField from "../common/CommonInputField";

const schema = yup.object({
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

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") ?? "";

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setLoading(true);
    try {
      await api.post("/Auth/reset-password", {
        token,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to reset password"));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Box sx={{ maxWidth: 440 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            Invalid reset link. Missing token.
            <Box sx={{ mt: 2 }}>
              <Link component={RouterLink} to="/forgot-password">
                Request a new link
              </Link>
            </Box>
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 440, width: "100%" }}>
        <Link
          component={RouterLink}
          to="/login"
          underline="none"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            mb: 3,
            color: "text.secondary",
            fontSize: "0.9rem",
          }}
        >
          <ArrowLeft size={16} /> Back to sign in
        </Link>

        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Lock size={24} />
          </Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: "-0.02em", mb: 1 }}
          >
            Set a new password
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
            Choose a strong password you'll remember.
          </Typography>
        </Box>

        {success ? (
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            Password reset successful. Redirecting to sign in...
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              {error && <Alert severity="error">{error}</Alert>}

              <CommonInputField
                name="newPassword"
                label="New Password"
                control={control}
                type={showNew ? "text" : "password"}
                required
                endAdornment={
                  <IconButton
                    onClick={() => setShowNew((v) => !v)}
                    edge="end"
                    size="small"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                }
              />
              <CommonInputField
                name="confirmPassword"
                label="Confirm New Password"
                control={control}
                type={showConfirm ? "text" : "password"}
                required
                endAdornment={
                  <IconButton
                    onClick={() => setShowConfirm((v) => !v)}
                    edge="end"
                    size="small"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                }
              />

              <CommonButton
                type="submit"
                loading={loading}
                fullWidth
                sx={{
                  py: 1.4,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  borderRadius: 2.5,
                }}
              >
                Reset password
              </CommonButton>
            </Stack>
          </form>
        )}
      </Box>
    </Box>
  );
}
