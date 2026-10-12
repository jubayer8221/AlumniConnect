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
import { appConfig } from "@/config/appConfig";

export default function LandingFooter() {
  return (
    <Box sx={{ bgcolor: "#0a1e1c", color: "#ffffff", pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                component="img"
                src="/image/logo.png"
                alt={appConfig.appName}
                sx={{ width: 40, height: 40, objectFit: "contain" }}
              />
              <Box>
                <Typography
                  sx={{ fontWeight: 800, fontSize: "1.05rem", lineHeight: 1.2 }}
                >
                  {appConfig.appName}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)" }}
                >
                  {appConfig.institutionName}
                </Typography>
              </Box>
            </Box>
            <Typography
              sx={{
                fontSize: "0.87rem",
                color: "rgba(255,255,255,0.6)",
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
                },
                {
                  icon: <Twitter size={18} />,
                  href: appConfig.socialLinks.twitter,
                },
                {
                  icon: <Linkedin size={18} />,
                  href: appConfig.socialLinks.linkedin,
                },
                {
                  icon: <Instagram size={18} />,
                  href: appConfig.socialLinks.instagram,
                },
              ].map((item, i) => (
                <IconButton
                  key={i}
                  component="a"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  size="small"
                  sx={{
                    color: "#ffffff",
                    bgcolor: "rgba(255,255,255,0.06)",
                    "&:hover": { bgcolor: "#0f766e" },
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
              {["Home", "Programs", "Events", "Gallery", "Activities"].map(
                (link) => (
                  <Typography
                    key={link}
                    sx={{
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.6)",
                      cursor: "pointer",
                      transition: "color 0.2s",
                      "&:hover": { color: "#7dd3c7" },
                    }}
                  >
                    {link}
                  </Typography>
                ),
              )}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 2, fontSize: "0.95rem" }}>
              Alumni
            </Typography>
            <Stack spacing={1.25}>
              {[
                "Sign In",
                "Register",
                "Directory",
                "Mentorship",
                "Chapters",
              ].map((link) => (
                <Typography
                  key={link}
                  sx={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    transition: "color 0.2s",
                    "&:hover": { color: "#7dd3c7" },
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
                  color="#7dd3c7"
                  style={{ flexShrink: 0, marginTop: 2 }}
                />
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.6,
                  }}
                >
                  {appConfig.address}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Mail size={18} color="#7dd3c7" />
                <Typography
                  sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}
                >
                  {appConfig.contactEmail}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Phone size={18} color="#7dd3c7" />
                <Typography
                  sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}
                >
                  {appConfig.contactPhone}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            mt: 6,
            pt: 3,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}
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
                  color: "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  "&:hover": { color: "#7dd3c7" },
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
