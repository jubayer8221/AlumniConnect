import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight, Home, LogIn, ShieldX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LandingHeader from "../landingPage/LandingHeader";
import LandingFooter from "../landingPage/LandingFooter";
// import LandingHeader from "./LandingHeader";
// import LandingFooter from "./LandingFooter";

type UnauthorizedPageProps = {
  /** Where "Back to Login" should go. Defaults to /login. */
  loginPath?: string;
  /** Where "Back to Home" should go. Defaults to /. */
  homePath?: string;
};

export default function UnauthorizedPage({
  loginPath = "/login",
  homePath = "/",
}: UnauthorizedPageProps) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <LandingHeader />

      <Box
        component="main"
        sx={{
          position: "relative",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
        }}
      >
        {/* Warm corner glows */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(var(--rgb-primary), 0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            bottom: -180,
            left: -180,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(var(--rgb-category-orange), 0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Stack spacing={4} sx={{ alignItems: "center", textAlign: "center" }}>
            {/* Icon */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 96,
                height: 96,
                borderRadius: 4,
                bgcolor: "rgba(var(--rgb-error), 0.08)",
                border: "1px solid rgba(var(--rgb-error), 0.18)",
                color: "error.main",
              }}
            >
              <ShieldX size={48} />
            </Box>

            {/* Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: 999,
                bgcolor: "rgba(var(--rgb-error), 0.06)",
                border: "1px solid rgba(var(--rgb-error), 0.16)",
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "error.main",
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "error.main",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                403 · Unauthorized
              </Typography>
            </Box>

            {/* Headline */}
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "text.primary",
                lineHeight: 1.2,
              }}
            >
              You don't have access to this page
            </Typography>

            {/* Description */}
            <Typography
              sx={{
                color: "text.secondary",
                maxWidth: 520,
                fontSize: { xs: "0.95rem", sm: "1rem" },
                lineHeight: 1.7,
              }}
            >
              This area is restricted to members with the right permissions. If
              you believe you should have access, try signing in with a
              different account or get in touch with an administrator.
            </Typography>

            {/* CTAs */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{
                pt: 1,
                width: { xs: "100%", sm: "auto" },
                alignItems: "stretch",
              }}
            >
              <Button
                variant="contained"
                onClick={() => navigate(loginPath)}
                startIcon={<LogIn size={18} />}
                sx={{
                  borderRadius: 2.5,
                  px: 3.5,
                  py: 1.25,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  bgcolor: "primary.main",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "primary.dark",
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                }}
              >
                Sign In
              </Button>

              <Button
                variant="outlined"
                component={Link}
                to={homePath}
                startIcon={<Home size={18} />}
                sx={{
                  borderRadius: 2.5,
                  px: 3.5,
                  py: 1.25,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  borderColor: "divider",
                  color: "text.primary",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Back to Home
              </Button>
            </Stack>

            {/* Back link */}
            <Button
              onClick={() => navigate(-1)}
              endIcon={<ArrowRight size={16} />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Or go back to the previous page
            </Button>
          </Stack>
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
}
