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
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: fullScreen ? "100vh" : fullHeight ? "60vh" : "auto",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {message}
      </Typography>
    </Box>
  );
}
