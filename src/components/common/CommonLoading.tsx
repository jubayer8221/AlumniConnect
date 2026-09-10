import { Box, CircularProgress, Typography } from "@mui/material";

interface CommonLoadingProps {
  message?: string;
  fullHeight?: boolean;
  fullScreen?: boolean;
}

export default function CommonLoading({
  message = "Loading...",
  fullHeight = true,
  fullScreen = false,
}: CommonLoadingProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: fullScreen ? "100vh" : fullHeight ? "60vh" : "auto",
        gap: 2,
        width: "100%",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 68,
          height: 68,
          display: "grid",
          placeItems: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid",
            borderColor: "primary.main",
            opacity: 0.16,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: -6,
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "secondary.main",
            animation: "preloader-spin 1s linear infinite",
          },
          "@keyframes preloader-spin": {
            from: { transform: "rotate(0deg)" },
            to: { transform: "rotate(360deg)" },
          },
        }}
      >
        <CircularProgress size={32} thickness={5} color="primary" />
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          animation: "preloader-pulse 1.5s ease-in-out infinite",
          "@keyframes preloader-pulse": {
            "0%, 100%": { opacity: 0.55 },
            "50%": { opacity: 1 },
          },
        }}
      >
        {message}
      </Typography>
      <Box
        sx={{
          width: 140,
          height: 3,
          overflow: "hidden",
          borderRadius: 2,
          bgcolor: "action.hover",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "45%",
            borderRadius: 2,
            bgcolor: "primary.main",
            animation: "preloader-progress 1.2s ease-in-out infinite",
            "@keyframes preloader-progress": {
              "0%": { transform: "translateX(-110%)" },
              "100%": { transform: "translateX(330%)" },
            },
          }}
        />
      </Box>
    </Box>
  );
}
