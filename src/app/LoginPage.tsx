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
  InputAdornment,
} from "@mui/material";
import {
  GraduationCap,
  LogIn,
  Eye,
  EyeOff,
  Sparkles,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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

  const { control, handleSubmit } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema) as never,
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data: LoginRequest) => {
    dispatch(loginAsync(data)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        const payload = res.payload as { user?: { role?: string } } | undefined;
        const role = payload?.user?.role;
        navigate(role === "ADMIN" ? "/dashboard" : "/alumni/dashboard", {
          replace: true,
        });
      }
    });
  };

  const fillDemo = (username: string, password: string) => {
    handleSubmit(onSubmit)({ username, password } as never);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 60%, #6366f1 100%)",
      }}
    >
      {/* Animated background blobs */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          right: "-5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(14,165,233,0.25) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          right: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
          filter: "blur(35px)",
        }}
      />

      {/* Left side - Branding (hidden on mobile) */}
      <Box
        sx={{
          flex: 1.2,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          p: 8,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 3,
              background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
            }}
          >
            <GraduationCap size={32} color="white" />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              {appConfig.appName}
            </Typography>
            <Typography
              sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}
            >
              {appConfig.institutionName}
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: { md: "2.5rem", lg: "3rem" },
            fontWeight: 800,
            color: "white",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            mb: 2,
          }}
        >
          Connect with your
          <br />
          alumni network
        </Typography>
        <Typography
          sx={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.6)",
            maxWidth: 480,
            mb: 5,
            lineHeight: 1.6,
          }}
        >
          Build lasting connections, discover opportunities, and stay engaged
          with your university community.
        </Typography>

        <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap", gap: 2 }}>
          {[
            {
              icon: <Users size={20} />,
              label: "5,000+ Alumni",
              color: "#818cf8",
            },
            {
              icon: <TrendingUp size={20} />,
              label: "Active Network",
              color: "#f472b6",
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
                bgcolor: "rgba(255,255,255,0.08)",
                borderRadius: 3,
                px: 2.5,
                py: 1.5,
                backdropFilter: "blur(8px)",
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
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Right side - Login form */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.8 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, md: 6 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Card
          sx={{
            maxWidth: 440,
            width: "100%",
            borderRadius: 4,
            boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            bgcolor: "rgba(255,255,255,0.95)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 6.5 } }}>
            {/* Mobile logo */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                gap: 1.5,
                mb: 3,
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                  boxShadow: "0 8px 20px rgba(99,102,241,0.3)",
                }}
              >
                <GraduationCap size={28} color="white" />
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
                <Typography
                  sx={{ fontSize: "0.7rem", color: "text.secondary" }}
                >
                  {appConfig.institutionName}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "text.primary",
                  letterSpacing: "-0.02em",
                  mb: 0.5,
                }}
              >
                Welcome back!
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
                Sign in to access your alumni portal
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2.5}>
                <CommonInputField
                  name="username"
                  label="Username"
                  control={control}
                  placeholder="Enter your username"
                  required
                />
                <Box>
                  <CommonInputField
                    name="password"
                    label="Password"
                    control={control}
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <CommonButton
                  type="submit"
                  loading={loading}
                  fullWidth
                  startIcon={<LogIn size={18} />}
                  sx={{ py: 1.25, fontSize: "0.95rem" }}
                >
                  Sign In to Portal
                </CommonButton>
              </Stack>
            </form>

            <Divider sx={{ my: 3 }}>
              <Chip
                label="Quick Demo Login"
                size="small"
                sx={{
                  bgcolor: "rgba(99,102,241,0.08)",
                  color: "#6366f1",
                  fontWeight: 600,
                  border: "none",
                }}
              />
            </Divider>

            <Stack spacing={1}>
              {[
                {
                  label: "Admin Portal",
                  username: "admin",
                  password: "admin123",
                  color: "#6366f1",
                  bg: "rgba(99,102,241,0.08)",
                },
                {
                  label: "Rahim Hasan (Alumni)",
                  username: "rahim.hasan",
                  password: "123456",
                  color: "#ec4899",
                  bg: "rgba(236,72,153,0.08)",
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
                    border: "1px solid",
                    borderColor: demo.color + "20",
                    "&:hover": {
                      bgcolor: demo.color + "15",
                      borderColor: demo.color + "40",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Sparkles size={16} />
                    {demo.label}
                  </Box>
                  <Typography sx={{ fontSize: "0.75rem", opacity: 0.6 }}>
                    {demo.username}
                  </Typography>
                </Button>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
