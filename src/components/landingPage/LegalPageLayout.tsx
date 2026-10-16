import type { ReactNode } from "react";
import { Box, Container, Typography } from "@mui/material";
import LandingHeader from "@/components/landingPage/LandingHeader";
import LandingFooter from "@/components/landingPage/LandingFooter";
import CommonBanner from "@/components/common/CommonBanner";

export interface LegalPageLayoutProps {
  /** Banner badge text, e.g. "Legal". */
  badge: string;
  /** Banner title. */
  title: string;
  /** Optional highlighted part of the banner title. */
  highlightText?: string;
  /** Banner subtitle / short summary. */
  subtitle: string;
  /** Human-readable last-updated date, e.g. "January 15, 2026". */
  lastUpdated: string;
  /** Main content. */
  children: ReactNode;
}

export default function LegalPageLayout({
  badge,
  title,
  highlightText,
  subtitle,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <LandingHeader />

      <CommonBanner
        badge={badge}
        title={title}
        highlightText={highlightText}
        subtitle={subtitle}
      />

      <Box component="main" sx={{ py: { xs: 5, md: 8 } }}>
        <Container maxWidth="md">
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "text.secondary",
              mb: { xs: 3, md: 4 },
              fontWeight: 600,
            }}
          >
            Last updated: {lastUpdated}
          </Typography>

          <Box
            sx={{
              /* Prose styling applied to all children */
              "& h2": {
                fontSize: { xs: "1.15rem", md: "1.3rem" },
                fontWeight: 800,
                color: "primary.main",
                mt: { xs: 3.5, md: 5 },
                mb: 1.5,
                letterSpacing: "-0.01em",
                scrollMarginTop: "100px",
              },
              "& h3": {
                fontSize: { xs: "1rem", md: "1.05rem" },
                fontWeight: 700,
                color: "text.primary",
                mt: 3,
                mb: 1,
              },
              "& p": {
                fontSize: { xs: "0.9rem", md: "0.95rem" },
                lineHeight: 1.75,
                color: "text.secondary",
                mb: 2,
              },
              "& ul, & ol": {
                pl: 3,
                mb: 2,
              },
              "& li": {
                fontSize: { xs: "0.9rem", md: "0.95rem" },
                lineHeight: 1.75,
                color: "text.secondary",
                mb: 0.75,
              },
              "& a": {
                color: "primary.main",
                textDecoration: "underline",
                "&:hover": {
                  textDecoration: "none",
                },
              },
              "& strong": {
                color: "text.primary",
                fontWeight: 700,
              },
            }}
          >
            {children}
          </Box>
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
}
