import React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import {
  School,
  History,
  Landmark,
  Award,
  Calendar,
  Users,
} from "lucide-react";
import LandingFooter from "../LandingFooter";
import LandingHeader from "../LandingHeader";
import { appConfig } from "@/config/appConfig";

const HIGHLIGHT_STATS = [
  { icon: <Award size={20} />, value: "1887", label: "Founded" },
  { icon: <Calendar size={20} />, value: "135+", label: "Years of Excellence" },
  { icon: <Users size={20} />, value: "Boys", label: "School Type" },
];

export default function AboutPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <LandingHeader />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, position: "relative" }}>
        {/* Hero Banner Section with Reference Styling */}
        <Box
          sx={{
            position: "relative",
            pt: { xs: 12, md: 16 },
            pb: { xs: 10, md: 14 },
            overflow: "hidden",
            color: "#ffffff",
            background:
              "linear-gradient(135deg, #0f766e 0%, #115e59 40%, #102a28 100%)",
          }}
        >
          {/* Background Image Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.2,
            }}
          />
          {/* Radial Light Overlays */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 20% 30%, rgba(42,157,143,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(194,65,12,0.25) 0%, transparent 60%)",
            }}
          />

          <Container
            maxWidth="lg"
            sx={{
              position: "relative",
              zIndex: 2,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {/* Institution Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: 999,
                bgcolor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#2dd4bf",
                  boxShadow: "0 0 12px #2dd4bf",
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                }}
              >
                Est. 1887 · {appConfig.institutionShortName || "SGVA"}
              </Typography>
            </Box>

            {/* Headline */}
            <Typography
              sx={{
                fontSize: { xs: "2.25rem", sm: "3.25rem", md: "4rem" },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                mb: 2.5,
                maxWidth: 900,
              }}
            >
              Sherpur Government{" "}
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(135deg, #7dd3c7 0%, #f4a261 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Victoria Academy
              </Box>
            </Typography>

            {/* Subheading */}
            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.2rem" },
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.82)",
                mb: 5,
                maxWidth: 720,
              }}
            >
              A historic boys' secondary school in Sherpur, Bangladesh—fostering
              academic distinction, leadership, and moral character for over a
              century.
            </Typography>

            {/* Stats Row */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2.5, sm: 5 }}
              sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
            >
              {HIGHLIGHT_STATS.map((stat) => (
                <Box
                  key={stat.label}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 2.5,
                      bgcolor: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#7dd3c7",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography
                      sx={{
                        fontSize: "1.4rem",
                        fontWeight: 800,
                        lineHeight: 1.1,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.68)",
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Container>
        </Box>

        {/* Content Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={4}>
            {/* Left Content Column */}
            <Grid size={{ xs: 12, md: 8 }}>
              {/* Overview Card */}
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3.5,
                  mb: 4,
                  p: { xs: 1, sm: 2 },
                  border: "none",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2.5,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: "primary.lighter",
                        color: "primary.main",
                        display: "flex",
                      }}
                    >
                      <School size={22} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      About The Academy
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.8, fontSize: "1.025rem" }}
                  >
                    <strong>Sherpur Government Victoria Academy</strong> is a
                    premier government public secondary school for boys located
                    in Sherpur Sadar Upazila within Sherpur District,
                    Bangladesh. Recognized under the{" "}
                    <strong>Mymensingh Education Board</strong>, the institution
                    continues a long-standing legacy of academic rigor,
                    fostering high standards of knowledge and character
                    development.
                  </Typography>
                </CardContent>
              </Card>

              {/* History & Timeline */}
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3.5,
                  p: { xs: 1, sm: 2 },
                  border: "none",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: "warning.lighter",
                        color: "warning.main",
                        display: "flex",
                      }}
                    >
                      <History size={22} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Key Historical Milestones
                    </Typography>
                  </Box>

                  <Stack spacing={3.5} sx={{ mt: 2 }}>
                    {[
                      {
                        year: "1887 — Foundation",
                        desc: "Founded on April 1, 1887, by Zamindar Roy Bahadur Charu Chandra Chowdhury to honor the 25th coronation anniversary of Queen Victoria. It was initially named Sherpur Victoria Memorial Academy.",
                      },
                      {
                        year: "1960 — Academic Jurisdiction",
                        desc: "Prior to 1960 (and following the 1947 partition of India), the school operated under the authority of the University of Calcutta.",
                      },
                      {
                        year: "1981 — Government Nationalization",
                        desc: "The academy was nationalized by the Government of Bangladesh and officially named Sherpur Government Victoria Academy.",
                      },
                      {
                        year: "2013 — 125-Year Celebration",
                        desc: "On January 30–31, 2013, current and former students celebrated the 125th anniversary jubilee in the presence of Advocate Abdul Hamid (former Speaker of Parliament).",
                      },
                    ].map((item) => (
                      <Box
                        key={item.year}
                        sx={{
                          position: "relative",
                          pl: 3,
                          borderLeft: "2px solid",
                          borderColor: "primary.main",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: -6,
                            top: 4,
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            color: "text.primary",
                            mb: 0.5,
                          }}
                        >
                          {item.year}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.95rem", lineHeight: 1.6 }}
                        >
                          {item.desc}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Sidebar Quick Info */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3.5,
                  p: 1,
                  border: "none",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)",
                  position: "sticky",
                  top: 100,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <Landmark size={20} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Academy Information
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />

                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        {[
                          { label: "Other Name", val: "Victoria Academy" },
                          { label: "Established", val: "April 1, 1887" },
                          {
                            label: "Founder",
                            val: "Zamindar Roy Bahadur Charu Chandra Chowdhury",
                          },
                          {
                            label: "School Type",
                            val: "Government Public (Boys)",
                          },
                          { label: "Education Board", val: "Mymensingh" },
                          { label: "District", val: "Sherpur District" },
                          {
                            label: "Coordinates",
                            val: "25.0213° N, 90.0179° E",
                          },
                        ].map((row) => (
                          <TableRow
                            key={row.label}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell
                              sx={{
                                pl: 0,
                                py: 1.25,
                                color: "text.secondary",
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                borderBottom: "none",
                              }}
                            >
                              {row.label}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                pr: 0,
                                py: 1.25,
                                fontWeight: 500,
                                fontSize: "0.85rem",
                                borderBottom: "none",
                              }}
                            >
                              {row.val}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <LandingFooter />
    </Box>
  );
}
