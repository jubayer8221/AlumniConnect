import { createTheme } from "@mui/material/styles";

export type ColorMode = "light" | "dark";

export const createAppTheme = (mode: ColorMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#0f766e",
        light: "#2a9d8f",
        dark: mode === "dark" ? "#102a28" : "#115e59",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#c2410c",
        light: "#ea580c",
        dark: "#9a3412",
      },
      success: {
        main: "#10b981",
        light: "#34d399",
        dark: "#059669",
        contrastText: "#ffffff",
      },
      warning: {
        main: "#f59e0b",
        light: "#fbbf24",
        dark: "#d97706",
        contrastText: "#ffffff",
      },
      error: {
        main: "#ef4444",
        light: "#f87171",
        dark: "#dc2626",
        contrastText: "#ffffff",
      },
      info: {
        main: "#0ea5e9",
        light: "#38bdf8",
        dark: "#0284c7",
        contrastText: "#ffffff",
      },
      background: {
        default: mode === "dark" ? "#17211f" : "#f3f6f3",
        paper: mode === "dark" ? "#21302d" : "#fffefa",
      },
      text: {
        primary: mode === "dark" ? "#edf5f2" : "#18312e",
        secondary: mode === "dark" ? "#b8cbc6" : "#5b706b",
      },
      divider: mode === "dark" ? "#38504b" : "#d8e3de",
    },
    typography: {
      fontFamily:
        '"Inter", "Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 800, letterSpacing: "-0.025em" },
      h2: { fontWeight: 800, letterSpacing: "-0.02em" },
      h3: { fontWeight: 700, letterSpacing: "-0.02em" },
      h4: { fontWeight: 700, letterSpacing: "-0.015em" },
      h5: { fontWeight: 700, letterSpacing: "-0.01em" },
      h6: { fontWeight: 700, letterSpacing: "-0.01em" },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
      body1: { lineHeight: 1.6 },
      body2: { lineHeight: 1.5 },
      button: { textTransform: "none", fontWeight: 600 },
      caption: { fontWeight: 500 },
    },
    shape: { borderRadius: 6 },
    shadows: [
      "none",
      "0 1px 2px 0 rgba(0,0,0,0.05)",
      "0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.04)",
      "0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.04)",
      "0 6px 10px -2px rgba(0,0,0,0.08), 0 2px 6px -3px rgba(0,0,0,0.04)",
      "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)",
      "0 12px 20px -4px rgba(0,0,0,0.1), 0 4px 8px -4px rgba(0,0,0,0.05)",
      "0 16px 24px -6px rgba(0,0,0,0.1), 0 6px 12px -6px rgba(0,0,0,0.05)",
      "0 20px 30px -8px rgba(0,0,0,0.12), 0 8px 16px -8px rgba(0,0,0,0.06)",
      "0 24px 38px -8px rgba(0,0,0,0.14), 0 10px 20px -10px rgba(0,0,0,0.06)",
      "0 28px 46px -10px rgba(0,0,0,0.16), 0 12px 24px -12px rgba(0,0,0,0.07)",
      "0 32px 54px -12px rgba(0,0,0,0.18), 0 14px 28px -14px rgba(0,0,0,0.08)",
      "0 36px 62px -14px rgba(0,0,0,0.2), 0 16px 32px -16px rgba(0,0,0,0.09)",
      "0 40px 70px -16px rgba(0,0,0,0.22), 0 18px 36px -18px rgba(0,0,0,0.1)",
      "0 44px 78px -18px rgba(0,0,0,0.24), 0 20px 40px -20px rgba(0,0,0,0.11)",
      "0 48px 86px -20px rgba(0,0,0,0.26), 0 22px 44px -22px rgba(0,0,0,0.12)",
      "0 52px 94px -22px rgba(0,0,0,0.28), 0 24px 48px -24px rgba(0,0,0,0.13)",
      "0 56px 102px -24px rgba(0,0,0,0.3), 0 26px 52px -26px rgba(0,0,0,0.14)",
      "0 60px 110px -26px rgba(0,0,0,0.32), 0 28px 56px -28px rgba(0,0,0,0.15)",
      "0 64px 118px -28px rgba(0,0,0,0.34), 0 30px 60px -30px rgba(0,0,0,0.16)",
      "0 68px 126px -30px rgba(0,0,0,0.36), 0 32px 64px -32px rgba(0,0,0,0.17)",
      "0 72px 134px -32px rgba(0,0,0,0.38), 0 34px 68px -34px rgba(0,0,0,0.18)",
      "0 76px 142px -34px rgba(0,0,0,0.4), 0 36px 72px -36px rgba(0,0,0,0.19)",
      "0 80px 150px -36px rgba(0,0,0,0.42), 0 38px 76px -38px rgba(0,0,0,0.2)",
      "0 84px 158px -38px rgba(0,0,0,0.44), 0 40px 80px -40px rgba(0,0,0,0.21)",
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: "thin",
            scrollbarColor: `${mode === "dark" ? "#4f756d" : "#9ab9b0"} transparent`,
            "&::-webkit-scrollbar": { width: 6, height: 6 },
            "&::-webkit-scrollbar-thumb": {
              background: mode === "dark" ? "#4f756d" : "#9ab9b0",
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-track": { background: "transparent" },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow:
              "0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.04)",
            border: "1px solid",
            borderColor: "divider",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 600, borderRadius: 6 },
          contained: {
            boxShadow: "none",
            "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.12)" },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500, borderRadius: 6 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: { borderRadius: 6 },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 6,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { boxShadow: "none" },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            transition: "all 0.2s ease",
          },
        },
      },
    },
  });

export const theme = createAppTheme("light");
