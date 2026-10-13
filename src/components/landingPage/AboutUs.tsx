// import {
//   Box,
//   Container,
//   Typography,
//   Grid,
//   Paper,
//   Button,
//   Stack,
// } from "@mui/material";
// import { Link } from "react-router-dom";
// import { ArrowRight, Target, Users, Award, Globe } from "lucide-react";

// const stats = [
//   { icon: <Users size={22} />, value: "5,200+", label: "Registered Alumni" },
//   { icon: <Globe size={22} />, value: "42", label: "Countries" },
//   { icon: <Award size={22} />, value: "180+", label: "Events Hosted" },
//   { icon: <Target size={22} />, value: "25", label: "Years of Legacy" },
// ];

// export default function AboutUsSection() {
//   return (
//     <Box
//       component="section"
//       id="about"
//       sx={{
//         py: { xs: 6, md: 10 },
//         bgcolor: "background.paper",
//       }}
//     >
//       <Container maxWidth="lg">
//         <Grid
//           container
//           spacing={{ xs: 4, md: 6 }}
//           sx={{ alignItems: "center" }}
//         >
//           {/* Left: text */}
//           <Grid size={{ xs: 12, md: 6 }}>
//             <Typography
//               sx={{
//                 color: "primary.main",
//                 fontWeight: 700,
//                 fontSize: "0.8rem",
//                 letterSpacing: "0.1em",
//                 textTransform: "uppercase",
//                 mb: 1.5,
//               }}
//             >
//               About Us
//             </Typography>

//             <Typography
//               variant="h3"
//               sx={{
//                 fontWeight: 800,
//                 fontSize: { xs: "1.75rem", md: "2.25rem" },
//                 letterSpacing: "-0.02em",
//                 lineHeight: 1.15,
//                 mb: 2,
//                 color: "text.primary",
//               }}
//             >
//               Reconnecting alumni,
//               <br />
//               building a lifetime network.
//             </Typography>

//             <Typography
//               sx={{
//                 color: "text.secondary",
//                 fontSize: "1rem",
//                 lineHeight: 1.7,
//                 mb: 2,
//               }}
//             >
//               The Alumni Association exists to keep our community connected long
//               after graduation. From mentorship programs and scholarships to
//               networking events and giving back, we help alumni stay in touch
//               with each other and with the institution that shaped them.
//             </Typography>

//             <Typography
//               sx={{
//                 color: "text.secondary",
//                 fontSize: "1rem",
//                 lineHeight: 1.7,
//                 mb: 3,
//               }}
//             >
//               Whether you graduated last year or decades ago, there's a place
//               for you here — a community that celebrates your success and
//               supports the next generation.
//             </Typography>

//             <Stack
//               direction="row"
//               spacing={2}
//               useFlexGap
//               sx={{ flexWrap: "wrap" }}
//             >
//               <Button
//                 component={Link}
//                 to="/about"
//                 variant="contained"
//                 endIcon={<ArrowRight size={16} />}
//                 sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
//               >
//                 Learn more
//               </Button>
//               <Button
//                 component={Link}
//                 to="/login"
//                 variant="outlined"
//                 sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
//               >
//                 Join the network
//               </Button>
//             </Stack>
//           </Grid>

//           {/* Right: stat grid */}
//           <Grid size={{ xs: 12, md: 6 }}>
//             <Grid container spacing={2}>
//               {stats.map((s) => (
//                 <Grid size={{ xs: 6 }} key={s.label}>
//                   <Paper
//                     elevation={0}
//                     sx={{
//                       p: 3,
//                       borderRadius: 3,
//                       border: "1px solid",
//                       borderColor: "divider",
//                       height: "100%",
//                       transition: "all 0.25s ease",
//                       "&:hover": {
//                         borderColor: "primary.main",
//                         transform: "translateY(-2px)",
//                         boxShadow: (t) => t.shadows[4],
//                       },
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         width: 44,
//                         height: 44,
//                         borderRadius: 2,
//                         bgcolor: "primary.main",
//                         color: "primary.contrastText",
//                         mb: 1.5,
//                       }}
//                     >
//                       {s.icon}
//                     </Box>
//                     <Typography
//                       sx={{
//                         fontSize: "1.5rem",
//                         fontWeight: 800,
//                         color: "text.primary",
//                         lineHeight: 1.1,
//                       }}
//                     >
//                       {s.value}
//                     </Typography>
//                     <Typography
//                       sx={{
//                         fontSize: "0.85rem",
//                         color: "text.secondary",
//                         mt: 0.5,
//                       }}
//                     >
//                       {s.label}
//                     </Typography>
//                   </Paper>
//                 </Grid>
//               ))}
//             </Grid>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// }

import { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
  Skeleton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanding } from "@/hooks/useLanding";
import { getIcon } from "./HeroSection";

export default function AboutUsSection() {
  const { aboutStats, loading, fetchLandingContent } = useLanding();

  useEffect(() => {
    void fetchLandingContent();
  }, [fetchLandingContent]);

  return (
    <Box
      component="section"
      id="about"
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: "background.paper",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          sx={{ alignItems: "center" }}
        >
          {/* Left: text */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              sx={{
                color: "primary.main",
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                mb: 1.5,
              }}
            >
              About Us
            </Typography>

            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                mb: 2,
                color: "text.primary",
              }}
            >
              Reconnecting alumni,
              <br />
              building a lifetime network.
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "1rem",
                lineHeight: 1.7,
                mb: 2,
              }}
            >
              The Alumni Association exists to keep our community connected long
              after graduation. From mentorship programs and scholarships to
              networking events and giving back, we help alumni stay in touch
              with each other and with the institution that shaped them.
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "1rem",
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              Whether you graduated last year or decades ago, there's a place
              for you here — a community that celebrates your success and
              supports the next generation.
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              useFlexGap
              sx={{ flexWrap: "wrap" }}
            >
              <Button
                component={Link}
                to="/about"
                variant="contained"
                endIcon={<ArrowRight size={16} />}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                Learn more
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                Join the network
              </Button>
            </Stack>
          </Grid>

          {/* Right: stat grid */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>
              {loading &&
                aboutStats.length === 0 &&
                [0, 1, 2, 3].map((i) => (
                  <Grid size={{ xs: 6 }} key={i}>
                    <Skeleton
                      variant="rounded"
                      height={140}
                      sx={{ borderRadius: 3 }}
                    />
                  </Grid>
                ))}

              {aboutStats.map((s) => (
                <Grid size={{ xs: 6 }} key={s.statID}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      height: "100%",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        transform: "translateY(-2px)",
                        boxShadow: (t) => t.shadows[4],
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        mb: 1.5,
                      }}
                    >
                      {getIcon(s.iconKey, 22)}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: "text.primary",
                        lineHeight: 1.1,
                      }}
                    >
                      {s.value}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: "text.secondary",
                        mt: 0.5,
                      }}
                    >
                      {s.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
