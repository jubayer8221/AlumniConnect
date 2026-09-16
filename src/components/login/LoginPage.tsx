import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Divider,
  Chip,
  Stack,
  Button,
  IconButton,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  LogIn,
  Eye,
  EyeOff,
  Sparkles,
  Users,
  TrendingUp,
  Award,
  Mail,
  Phone,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { loginAsync } from "@/Slice/authSlice";
import { loginSchema } from "@/validation/authValidation";
import { CommonInputField, CommonButton } from "@/components/common";
import { appConfig } from "@/config/appConfig";
import type { LoginRequest } from "@/types/auth";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [rememberMe, setRememberMe] = useState(false);

  const { control, handleSubmit, setValue } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema) as never,
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: LoginRequest) => {
    const result = await dispatch(loginAsync(data));

    if (loginAsync.fulfilled.match(result)) {
      const role = result.payload.user.role;
      navigate(role === "ADMIN" ? "/dashboard" : "/alumni/dashboard", {
        replace: true,
      });
    }
  };

  const fillDemo = async (username: string, password: string) => {
    setValue("username", username);
    setValue("password", password);

    const result = await dispatch(loginAsync({ username, password }));

    if (loginAsync.fulfilled.match(result)) {
      const role = result.payload.user.role;
      navigate(role === "ADMIN" ? "/dashboard" : "/alumni/dashboard", {
        replace: true,
      });
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
            "linear-gradient(135deg, #115e59 0%, #18312e 62%, #102a28 100%)",
        }}
      >
        {/* Glow Effects */}
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: 450,
            height: 450,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(42,157,143,0.22) 0%, transparent 70%)",
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
              "radial-gradient(circle, rgba(194,65,12,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Top Header Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: "primary.main",
              boxShadow: "0 8px 24px rgba(15,118,110,0.35)",
            }}
          >
            <Box
              component="img"
              src="/image/logo.png"
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
              sx={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}
            >
              {appConfig.institutionName}
            </Typography>
          </Box>
        </Box>

        {/* Hero Title & Subtitle */}
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
                background: "linear-gradient(135deg, #7dd3c7 0%, #f4a261 100%)",
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
              color: "rgba(255,255,255,0.7)",
              maxWidth: 480,
              mb: 5,
              lineHeight: 1.6,
            }}
          >
            Build lasting connections, discover opportunities, and stay engaged
            with your university community.
          </Typography>

          {/* Stats Badges */}
          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 2 }}>
            {[
              {
                icon: <Users size={20} />,
                label: "5,000+ Alumni",
                color: "#7dd3c7",
              },
              {
                icon: <TrendingUp size={20} />,
                label: "Active Network",
                color: "#f4a261",
              },
              {
                icon: <Award size={20} />,
                label: "Verified Profiles",
                color: "#38bdf8",
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
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Footer info on left */}
        <Typography
          sx={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", zIndex: 1 }}
        >
          © {new Date().getFullYear()} {appConfig.appName}. All rights reserved.
        </Typography>
      </Box>

      {/* Right Side: Clean Login Form */}
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
          {/* Mobile Header */}
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
                bgcolor: "primary.main",
              }}
            >
              <Box
                component="img"
                src="/image/logo.png"
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

          {/* Email / Phone Login Method Tabs */}
          <Box sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={loginMethod}
              onChange={(_, newValue) => setLoginMethod(newValue)}
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
                  loginMethod === "phone"
                    ? "Phone Number / Username"
                    : "Username / Email"
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
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                }
              />

              {/* Remember me & Forgot Password */}
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
                // startIcon={<LogIn size={18} />}
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

          {/* Quick Demo Section (EXACT Demo Data Maintained) */}
          <Divider sx={{ my: 3.5 }}>
            <Chip
              label="Quick Demo Login"
              size="small"
              sx={{
                bgcolor: "rgba(15,118,110,0.08)",
                color: "primary.main",
                fontWeight: 600,
                border: "none",
              }}
            />
          </Divider>

          <Stack spacing={1.25}>
            {[
              {
                label: "Admin Portal",
                username: "admin",
                password: "admin123",
                color: "#0f766e",
                bg: "rgba(15,118,110,0.08)",
              },
              {
                label: "Rahim Hasan (Alumni)",
                username: "rahim.hasan",
                password: "123456",
                color: "#c2410c",
                bg: "rgba(194,65,12,0.08)",
              },
              {
                label: "Nusrat Jahan (Alumni)",
                username: "nusrat.jahan",
                password: "123456",
                color: "#0ea5e9",
                bg: "rgba(14,165,233,0.08)",
              },
            ].map((demo) => (
              <Button
                key={demo.username}
                fullWidth
                variant="text"
                onClick={() => fillDemo(demo.username, demo.password)}
                sx={{
                  justifyContent: "space-between",
                  borderRadius: 2.5,
                  py: 1.25,
                  px: 2,
                  bgcolor: demo.bg,
                  color: demo.color,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  textTransform: "none",
                  border: "1px solid",
                  borderColor: demo.color + "25",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: demo.color + "18",
                    borderColor: demo.color + "50",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Sparkles size={16} />
                  {demo.label}
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    opacity: 0.75,
                    fontFamily: "monospace",
                  }}
                >
                  {demo.username}
                </Typography>
              </Button>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
