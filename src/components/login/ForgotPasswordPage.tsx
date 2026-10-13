import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Alert, Stack, Link } from "@mui/material";
import { ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "@/services/api/apiClient";
import { getApiErrorMessage } from "@/utils/apiError";
import CommonInputField from "../common/CommonInputField";
import CommonButton from "../common/CommonButton";

const schema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email"),
});

type FormValues = yup.InferType<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setLoading(true);
    try {
      await api.post("/Auth/forgot-password", { email: data.email });
      setSent(true);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to send reset email"));
    } finally {
      setLoading(false);
    }
  };

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
            <Mail size={24} />
          </Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: "-0.02em", mb: 1 }}
          >
            Forgot password?
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
            Enter your email and we'll send you a reset link.
          </Typography>
        </Box>

        {sent ? (
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            If an account exists with that email, a reset link has been sent.
            Check your inbox (and spam folder).
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              {error && <Alert severity="error">{error}</Alert>}
              <CommonInputField
                name="email"
                label="Email"
                control={control}
                placeholder="you@example.com"
                required
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
                Send reset link
              </CommonButton>
            </Stack>
          </form>
        )}
      </Box>
    </Box>
  );
}
