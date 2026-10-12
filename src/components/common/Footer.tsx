import React from "react";
import { Box, Typography, Link, Container } from "@mui/material";

interface FooterProps {
  name?: string;
  websiteUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  name = "Jubayer Al Mahmud",
  websiteUrl = "https://jubayeralmahmud.vercel.app",
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        // borderTop: "1px solid",
        // borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            flexWrap: "wrap",
            fontSize: "0.875rem",
          }}
        >
          <span>&copy; {currentYear} Developed by</span>
          <Link
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              fontWeight: 600,
              color: "primary.main",
              transition: "color 0.2s ease-in-out",
              "&:hover": {
                color: "primary.dark",
              },
            }}
          >
            {name}
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
