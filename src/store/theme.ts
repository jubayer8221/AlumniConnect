import { createTheme } from "@mui/material/styles";
import { colors, getCssColorVariables, type ColorMode } from "@/theme/colors";

export type { ColorMode } from "@/theme/colors";

export const createAppTheme = (mode: ColorMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary,
        light: colors.primaryLight,
        dark: colors.primaryHover,
        contrastText: colors.white,
      },
      secondary: {
        main: mode === "dark" ? colors.secondaryLight : colors.secondary,
        light: colors.secondaryLight,
        dark: colors.secondaryDark,
        contrastText: colors.white,
      },
      success: {
        main: colors.success,
        light: colors.successLight,
        dark: colors.successDark,
        contrastText: colors.white,
      },
      warning: {
        main: colors.warning,
        light: colors.warningLight,
        dark: colors.warningDark,
        contrastText: colors.secondary,
      },
      error: {
        main: colors.error,
        light: colors.errorLight,
        dark: colors.error,
        contrastText: colors.white,
      },
      info: {
        main: colors.info,
        light: colors.infoLight,
        dark: colors.infoDark,
        contrastText: colors.white,
      },
      background: {
        default: mode === "dark" ? colors.darkBackground : colors.background,
        paper: mode === "dark" ? colors.darkSurface : colors.surface,
      },
      text: {
        primary: mode === "dark" ? colors.darkTextPrimary : colors.textPrimary,
        secondary: mode === "dark" ? colors.darkTextSecondary : colors.textSecondary,
      },
      divider: mode === "dark" ? colors.darkBorder : colors.border,
    },
    typography: {
      fontFamily:
        '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
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
    shape: { borderRadius: 5 },
    shadows: [
      "none",
      "0 1px 2px 0 rgba(var(--rgb-black),0.05)",
      "0 1px 3px 0 rgba(var(--rgb-black),0.08), 0 1px 2px 0 rgba(var(--rgb-black),0.04)",
      "0 4px 6px -1px rgba(var(--rgb-black),0.08), 0 2px 4px -2px rgba(var(--rgb-black),0.04)",
      "0 6px 10px -2px rgba(var(--rgb-black),0.08), 0 2px 6px -3px rgba(var(--rgb-black),0.04)",
      "0 10px 15px -3px rgba(var(--rgb-black),0.08), 0 4px 6px -4px rgba(var(--rgb-black),0.04)",
      "0 12px 20px -4px rgba(var(--rgb-black),0.1), 0 4px 8px -4px rgba(var(--rgb-black),0.05)",
      "0 16px 24px -6px rgba(var(--rgb-black),0.1), 0 6px 12px -6px rgba(var(--rgb-black),0.05)",
      "0 20px 30px -8px rgba(var(--rgb-black),0.12), 0 8px 16px -8px rgba(var(--rgb-black),0.06)",
      "0 24px 38px -8px rgba(var(--rgb-black),0.14), 0 10px 20px -10px rgba(var(--rgb-black),0.06)",
      "0 28px 46px -10px rgba(var(--rgb-black),0.16), 0 12px 24px -12px rgba(var(--rgb-black),0.07)",
      "0 32px 54px -12px rgba(var(--rgb-black),0.18), 0 14px 28px -14px rgba(var(--rgb-black),0.08)",
      "0 36px 62px -14px rgba(var(--rgb-black),0.2), 0 16px 32px -16px rgba(var(--rgb-black),0.09)",
      "0 40px 70px -16px rgba(var(--rgb-black),0.22), 0 18px 36px -18px rgba(var(--rgb-black),0.1)",
      "0 44px 78px -18px rgba(var(--rgb-black),0.24), 0 20px 40px -20px rgba(var(--rgb-black),0.11)",
      "0 48px 86px -20px rgba(var(--rgb-black),0.26), 0 22px 44px -22px rgba(var(--rgb-black),0.12)",
      "0 52px 94px -22px rgba(var(--rgb-black),0.28), 0 24px 48px -24px rgba(var(--rgb-black),0.13)",
      "0 56px 102px -24px rgba(var(--rgb-black),0.3), 0 26px 52px -26px rgba(var(--rgb-black),0.14)",
      "0 60px 110px -26px rgba(var(--rgb-black),0.32), 0 28px 56px -28px rgba(var(--rgb-black),0.15)",
      "0 64px 118px -28px rgba(var(--rgb-black),0.34), 0 30px 60px -30px rgba(var(--rgb-black),0.16)",
      "0 68px 126px -30px rgba(var(--rgb-black),0.36), 0 32px 64px -32px rgba(var(--rgb-black),0.17)",
      "0 72px 134px -32px rgba(var(--rgb-black),0.38), 0 34px 68px -34px rgba(var(--rgb-black),0.18)",
      "0 76px 142px -34px rgba(var(--rgb-black),0.4), 0 36px 72px -36px rgba(var(--rgb-black),0.19)",
      "0 80px 150px -36px rgba(var(--rgb-black),0.42), 0 38px 76px -38px rgba(var(--rgb-black),0.2)",
      "0 84px 158px -38px rgba(var(--rgb-black),0.44), 0 40px 80px -40px rgba(var(--rgb-black),0.21)",
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ":root": getCssColorVariables(mode),
          body: {
            scrollbarWidth: "thin",
            scrollbarColor: `${mode === "dark" ? "var(--color-dark-accent)" : "var(--color-light-border-green)"} transparent`,
            "&::-webkit-scrollbar": { width: 6, height: 6 },
            "&::-webkit-scrollbar-thumb": {
              background: mode === "dark" ? "var(--color-dark-accent)" : "var(--color-light-border-green)",
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
              "0 1px 3px 0 rgba(var(--rgb-black),0.08), 0 1px 2px 0 rgba(var(--rgb-black),0.04)",
            border: "1px solid",
            borderColor: "divider",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 650,
            borderRadius: 2,
            transition: "background-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
            "&:focus-visible": {
              outline: "3px solid rgba(var(--rgb-primary), 0.28)",
              outlineOffset: 2,
            },
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 5px 14px rgba(var(--rgb-primary), 0.2)",
              transform: "translateY(-1px)",
            },
            "&:active": { transform: "translateY(0)" },
          },
        },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 500, borderRadius: 6 } },
      },
      MuiPaper: {
        styleOverrides: { rounded: { borderRadius: 6 } },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              transition: "box-shadow 160ms ease",
              "&.Mui-focused": {
                boxShadow: "0 0 0 3px rgba(var(--rgb-primary), 0.12)",
              },
            },
          },
        },
      },
      MuiAppBar: { styleOverrides: { root: { boxShadow: "none" } } },
      MuiListItemButton: {
        styleOverrides: {
          root: { borderRadius: 6, transition: "all 0.2s ease" },
        },
      },
    },
  });

export const theme = createAppTheme("light");
