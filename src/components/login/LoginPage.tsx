import { useState } from "react";
import {
  Box,
  Typography,
  Alert,
  Stack,
  Button,
  IconButton,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Eye,
  EyeOff,
  Users,
  TrendingUp,
  Award,
  Mail,
  Phone,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { hasAdminAccess } from "@/utils/authUtils";
import { showToast } from "@/store/Slice/uiSlice";
import { appConfig } from "@/config/appConfig";

import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import CommonInputField from "../common/CommonInputField";
import CommonButton from "../common/CommonButton";

/* ============================================================
   Form validation — inline
   ============================================================ */
const loginSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required("Username is required")
    .max(100, "Username is too long"),
  password: yup
    .string()
    .required("Password is required")
    .max(100, "Password is too long"),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const signupUsername = (location.state as { signupUsername?: string } | null)
    ?.signupUsername;
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: signupUsername ?? "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      const user = await login(data);
      navigate(hasAdminAccess(user.role) ? "/dashboard" : "/alumni/dashboard", {
        replace: true,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to sign in";
      setError(message);
      dispatch(showToast({ message, severity: "error" }));
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "background.default",
      }}
    >
      {/* Left Side: Modern Visual Banner */}
      <Box
        sx={{
          flex: 1.1,
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
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(var(--rgb-primary), 0.35)",
            }}
          >
            <Box
              component="img"
              src="/image/logo-small.png"
              alt={`${appConfig.appName} logo`}
              sx={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              {appConfig.appName}
            </Typography>
            <Typography
              sx={{ fontSize: "0.8rem", color: "rgba(var(--rgb-white), 0.6)" }}
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
            Connect with your
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
              alumni network
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: "1.1rem",
              color: "rgba(var(--rgb-white), 0.7)",
              maxWidth: 480,
              mb: 5,
              lineHeight: 1.6,
            }}
          >
            Build lasting connections, discover opportunities, and stay engaged
            with your university community.
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
                  bgcolor: "rgba(var(--rgb-white), 0.06)",
                  borderRadius: 3,
                  px: 2.5,
                  py: 1.5,
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(var(--rgb-white), 0.1)",
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
          sx={{
            fontSize: "0.8rem",
            color: "rgba(var(--rgb-white), 0.4)",
            zIndex: 1,
          }}
        >
          © {new Date().getFullYear()} {appConfig.appName}. All rights reserved.
        </Typography>
      </Box>

      {/* Right Side */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.9 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, sm: 6 },
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ maxWidth: 440, width: "100%" }}>
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1.5,
              mb: 4,
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: 2.5,
              }}
            >
              <Box
                component="img"
                src="/image/logo-small.png"
                alt={`${appConfig.appName} logo`}
                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "text.primary",
                  letterSpacing: "-0.02em",
                }}
              >
                {appConfig.appName}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                {appConfig.institutionName}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                letterSpacing: "-0.02em",
                mb: 1,
              }}
            >
              Welcome back!
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
              Sign in to access your alumni portal
            </Typography>
          </Box>

          <Box sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={loginMethod}
              onChange={(_, v) => setLoginMethod(v)}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  minHeight: 40,
                },
              }}
            >
              <Tab
                icon={<Mail size={16} />}
                iconPosition="start"
                label="Email"
                value="email"
              />
              <Tab
                icon={<Phone size={16} />}
                iconPosition="start"
                label="Phone"
                value="phone"
              />
            </Tabs>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <CommonInputField
                name="username"
                label={
                  loginMethod === "phone" ? "Phone Number " : "Username / Email"
                }
                control={control}
                placeholder={
                  loginMethod === "phone"
                    ? "Enter your phone number"
                    : "Enter your username or email"
                }
                required
              />
              <CommonInputField
                name="password"
                label="Password"
                control={control}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                required
                endAdornment={
                  <IconButton
                    onClick={() => setShowPassword((p) => !p)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                }
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      size="small"
                      sx={{
                        color: "primary.main",
                        "&.Mui-checked": { color: "primary.main" },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{ fontSize: "0.85rem", color: "text.secondary" }}
                    >
                      Remember me
                    </Typography>
                  }
                />
                <Button
                  component={RouterLink}
                  to="/forgot-password"
                  variant="text"
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    textTransform: "none",
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot password?
                </Button>
              </Box>

              <CommonButton
                type="submit"
                loading={loading}
                fullWidth
                sx={{
                  py: 1.4,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  bgcolor: "primary.main",
                  borderRadius: 2.5,
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                Sign In
              </CommonButton>
            </Stack>
          </form>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "0.9rem",
              color: "text.secondary",
              mt: 2,
            }}
          >
            New to {appConfig.appName}?{" "}
            <Button
              component={RouterLink}
              to="/signup"
              sx={{
                textTransform: "none",
                fontWeight: 700,
                p: 0,
                minWidth: 0,
                verticalAlign: "baseline",
              }}
            >
              Create an account
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
