import {
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { appConfig } from "@/config/appConfig";
import { useAuth } from "@/hooks/useAuth";

export default function LandingFooter() {
  const { isAuthenticated } = useAuth();
  return (
    <Box
      sx={{
        bgcolor: "var(--color-dark-forest)",
        color: "var(--color-surface)",
        pt: 6,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                component="img"
                src="/image/logo-small-64.png"
                srcSet="/image/logo-small-64.png 1x, /image/logo-small.png 2x"
                alt={appConfig.appName}
                width={64}
                height={60}
                loading="lazy"
                decoding="async"
                sx={{ width: 50, height: 60, objectFit: "contain" }}
              />
              <Box>
                <Typography
                  sx={{ fontWeight: 800, fontSize: "1.05rem", lineHeight: 1.2 }}
                >
                  {appConfig.appName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "rgba(var(--rgb-white), 0.55)",
                  }}
                >
                  {appConfig.institutionName}
                </Typography>
              </Box>
            </Box>
            <Typography
              sx={{
                fontSize: "0.87rem",
                color: "rgba(var(--rgb-white), 0.6)",
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              Connecting generations of graduates through shared memories,
              mentorship, and lifelong community.
            </Typography>
            <Stack direction="row" spacing={1}>
              {[
                {
                  icon: <Facebook size={18} />,
                  href: appConfig.socialLinks.facebook,
                  label: "Facebook",
                },
                {
                  icon: <Twitter size={18} />,
                  href: appConfig.socialLinks.twitter,
                  label: "Twitter",
                },
                {
                  icon: <Linkedin size={18} />,
                  href: appConfig.socialLinks.linkedin,
                  label: "LinkedIn",
                },
                {
                  icon: <Instagram size={18} />,
                  href: appConfig.socialLinks.instagram,
                  label: "Instagram",
                },
              ].map((item, i) => (
                <IconButton
                  key={i}
                  component="a"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Visit us on ${item.label}`}
                  size="small"
                  sx={{
                    color: "var(--color-surface)",
                    bgcolor: "rgba(var(--rgb-white), 0.06)",
                    "&:hover": { bgcolor: "var(--color-primary)" },
                  }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 2, fontSize: "0.95rem" }}>
              Explore
            </Typography>
            <Stack spacing={1.25}>
              {[
                { label: "Home", to: "/" },
                { label: "Programs", to: "/#programs" },
                { label: "Events", to: "/events" },
                { label: "Gallery", to: "/gallery" },
                { label: "Activities", to: "/#activities" },
              ].map(({ label, to }) => (
                <Typography
                  key={label}
                  component={Link}
                  to={to}
                  sx={{
                    fontSize: "0.85rem",
                    color: "rgba(var(--rgb-white), 0.6)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    "&:hover": { color: "var(--color-accent)" },
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 2, fontSize: "0.95rem" }}>
              Alumni
            </Typography>
            <Stack spacing={1.25}>
              {(isAuthenticated
                ? ["Directory", "Mentorship", "Chapters"]
                : ["Sign In", "Register", "Directory", "Mentorship", "Chapters"]
              ).map((link) => (
                <Typography
                  key={link}
                  sx={{
                    fontSize: "0.85rem",
                    color: "rgba(var(--rgb-white), 0.6)",
                    cursor: "pointer",
                    transition: "color 0.2s",
                    "&:hover": { color: "var(--color-accent)" },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography sx={{ fontWeight: 700, mb: 2, fontSize: "0.95rem" }}>
              Contact
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <MapPin
                  size={18}
                  color="var(--color-accent)"
                  style={{ flexShrink: 0, marginTop: 2 }}
                />
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: "rgba(var(--rgb-white), 0.6)",
                    lineHeight: 1.6,
                  }}
                >
                  {appConfig.address}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Mail size={18} color="var(--color-accent)" />
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: "rgba(var(--rgb-white), 0.6)",
                  }}
                >
                  {appConfig.contactEmail}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Phone size={18} color="var(--color-accent)" />
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: "rgba(var(--rgb-white), 0.6)",
                  }}
                >
                  {appConfig.contactPhone}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: "1px solid rgba(var(--rgb-white), 0.08)",
            mt: 6,
            pt: 3,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            sx={{ fontSize: "0.78rem", color: "rgba(var(--rgb-white), 0.72)" }}
          >
            © {new Date().getFullYear()} {appConfig.appName}. All rights
            reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Typography
                key={item}
                sx={{
                  fontSize: "0.78rem",
                  color: "rgba(var(--rgb-white), 0.72)",
                  cursor: "pointer",
                  "&:hover": { color: "var(--color-accent)" },
                }}
              >
                {item}
              </Typography>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
