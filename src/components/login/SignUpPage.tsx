import { useState } from "react";
import {
  Box,
  Typography,
  Alert,
  Stack,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import { Eye, EyeOff, Users, TrendingUp, Award, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "@/store/Slice/uiSlice";
import { appConfig } from "@/config/appConfig";
import { getApiErrorMessage } from "@/utils/apiError";
import { CommonButton, CommonDropDown, CommonInputField } from "../common";

/* ============================================================
   Validation
   ============================================================ */
const signUpSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required("Username is required")
    .min(3, "At least 3 characters")
    .max(100, "Too long"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "At least 6 characters")
    .max(100, "Too long"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
  fullName: yup
    .string()
    .trim()
    .required("Full name is required")
    .max(200, "Too long"),
  phone: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .matches(/^[0-9+\-\s]{6,30}$/, "Enter a valid phone number")
    .optional(),
  gender: yup.string().oneOf(["Male", "Female", "Other", ""]).optional(),
  dateOfBirth: yup.string().optional(),
  programID: yup
    .number()
    .transform((v) => (Number.isNaN(v) ? undefined : v))
    .optional(),
  graduationYear: yup
    .number()
    .transform((v) => (Number.isNaN(v) ? undefined : v))
    .min(1900, "Too old")
    .max(new Date().getFullYear() + 5, "Too far in the future")
    .optional(),
  batch: yup.string().trim().max(50, "Too long").optional(),
});

type FormValues = yup.InferType<typeof signUpSchema>;

const GENDERS = ["Male", "Female", "Other"];

export default function SignUpPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
      gender: "",
      dateOfBirth: "",
      programID: undefined,
      graduationYear: undefined,
      batch: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      // Strip the client-only confirmPassword before sending
      const { confirmPassword, ...payload } = data;

      await signUp({
        ...payload,
        phone: payload.phone?.trim() || undefined,
        gender: payload.gender || undefined,
        dateOfBirth: payload.dateOfBirth
          ? new Date(`${payload.dateOfBirth}T00:00:00.000Z`).toISOString()
          : undefined,
        batch: payload.batch?.trim() || undefined,
      });

      dispatch(
        showToast({
          message: "Account created! Please sign in.",
          severity: "success",
        }),
      );
      navigate("/login", {
        replace: true,
        state: { signupUsername: payload.username },
      });
    } catch (err) {
      const message = getApiErrorMessage(err, "Unable to create account");
      setError(message);
      dispatch(showToast({ message, severity: "error" }));
    }
  };

  const passwordAdornment = (show: boolean, setShow: (v: boolean) => void) => (
    <IconButton onClick={() => setShow(!show)} edge="end" size="small">
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </IconButton>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "background.default",
      }}
    >
      {/* ---------- Left: visual banner ---------- */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          p: 6,
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-dark-forest-alt) 62%, var(--color-dark-forest-surface) 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: 450,
            height: 450,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(var(--rgb-primary), 0.22) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(var(--rgb-category-orange), 0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, zIndex: 1 }}>
          <Box
            component="img"
            src="/image/logo-small.png"
            alt={`${appConfig.appName} logo`}
            sx={{ width: 48, height: 48, objectFit: "contain" }}
          />
          <Box>
            <Typography
              sx={{ fontSize: "1.5rem", fontWeight: 800, color: "white" }}
            >
              {appConfig.appName}
            </Typography>
            <Typography
              sx={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}
            >
              {appConfig.institutionName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ zIndex: 1, my: "auto" }}>
          <Typography
            sx={{
              fontSize: { md: "2.75rem", lg: "3.25rem" },
              fontWeight: 800,
              color: "white",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              mb: 2,
            }}
          >
            Join the
            <br />
            <Box
              component="span"
              sx={{
                background:
                  "linear-gradient(135deg, var(--color-accent) 0%, var(--color-category-warm) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              alumni community
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.7)",
              maxWidth: 480,
              mb: 5,
              lineHeight: 1.6,
            }}
          >
            Create your account to reconnect with classmates, discover events,
            and grow your professional network.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 2 }}>
            {[
              {
                icon: <Users size={20} />,
                label: "320+ Alumni",
                color: "var(--color-accent)",
              },
              {
                icon: <TrendingUp size={20} />,
                label: "Active Network",
                color: "var(--color-category-warm)",
              },
              {
                icon: <Award size={20} />,
                label: "Verified Profiles",
                color: "var(--color-info-light)",
              },
            ].map((stat) => (
              <Box
                key={stat.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  bgcolor: "rgba(255,255,255,0.06)",
                  borderRadius: 3,
                  px: 2.5,
                  py: 1.5,
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: stat.color + "20",
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  sx={{ fontSize: "0.9rem", fontWeight: 600, color: "white" }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Typography
          sx={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", zIndex: 1 }}
        >
          © {new Date().getFullYear()} {appConfig.appName}. All rights reserved.
        </Typography>
      </Box>

      {/* ---------- Right: form ---------- */}
      <Box
        sx={{
          flex: { xs: 1, md: 1.1 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, sm: 6 },
          bgcolor: "background.paper",
          overflowY: "auto",
        }}
      >
        <Box sx={{ maxWidth: 560, width: "100%", py: 4 }}>
          <Button
            component={RouterLink}
            to="/login"
            startIcon={<ArrowLeft size={16} />}
            sx={{
              mb: 3,
              textTransform: "none",
              color: "text.secondary",
              fontWeight: 500,
              px: 0,
              "&:hover": { bgcolor: "transparent", color: "primary.main" },
            }}
          >
            Back to sign in
          </Button>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, letterSpacing: "-0.02em", mb: 1 }}
            >
              Create your account
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
              Fill in the details below to get started
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              {/* -------- Account info -------- */}
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Account
              </Typography>

              <CommonInputField
                name="username"
                label="Username"
                control={control}
                placeholder="Choose a username"
                required
              />

              <CommonInputField
                name="email"
                label="Email"
                control={control}
                placeholder="you@example.com"
                type="email"
                required
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CommonInputField
                    name="password"
                    label="Password"
                    control={control}
                    placeholder="At least 6 characters"
                    type={showPassword ? "text" : "password"}
                    required
                    endAdornment={passwordAdornment(
                      showPassword,
                      setShowPassword,
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CommonInputField
                    name="confirmPassword"
                    label="Confirm Password"
                    control={control}
                    placeholder="Re-enter password"
                    type={showConfirm ? "text" : "password"}
                    required
                    endAdornment={passwordAdornment(
                      showConfirm,
                      setShowConfirm,
                    )}
                  />
                </Grid>
              </Grid>

              {/* -------- Personal info -------- */}
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  pt: 1,
                }}
              >
                Personal
              </Typography>

              <CommonInputField
                name="fullName"
                label="Full Name"
                control={control}
                placeholder="Your full name"
                required
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CommonInputField
                    name="phone"
                    label="Phone (optional)"
                    control={control}
                    placeholder="01XXXXXXXXX"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CommonDropDown
                    name="gender"
                    control={control}
                    label="Gender (optional)"
                    menuItems={GENDERS.map((gender) => ({
                      label: gender,
                      value: gender,
                    }))}
                    placeholder="Select gender"
                  />
                </Grid>
              </Grid>

              <CommonInputField
                name="dateOfBirth"
                label="Date of Birth (optional)"
                control={control}
                type="date"
              />

              {/* -------- Academic info -------- */}
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  pt: 1,
                }}
              >
                Academic (optional)
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <CommonInputField
                    name="programID"
                    label="Program ID"
                    control={control}
                    type="number"
                    placeholder="1"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <CommonInputField
                    name="graduationYear"
                    label="Graduation Year"
                    control={control}
                    type="number"
                    placeholder="2020"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <CommonInputField
                    name="batch"
                    label="Batch"
                    control={control}
                    placeholder="2020"
                  />
                </Grid>
              </Grid>

              <CommonButton
                type="submit"
                loading={loading || formState.isSubmitting}
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.4,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  bgcolor: "primary.main",
                  borderRadius: 2.5,
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                Create Account
              </CommonButton>

              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: "0.85rem",
                  color: "text.secondary",
                  pt: 1,
                }}
              >
                Already have an account?{" "}
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    p: 0,
                    minWidth: 0,
                    verticalAlign: "baseline",
                  }}
                >
                  Sign in
                </Button>
              </Typography>
            </Stack>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
