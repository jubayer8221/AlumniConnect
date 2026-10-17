export type ColorMode = "light" | "dark";

/** The application's single editable color palette. */
export const colors = {
  // primary: "#155EEF",
  primary: "#345888",
  primaryHover: "#1249C7",
  primaryLight: "#4B8BFF",
  secondary: "#102A4C",
  secondaryLight: "#1C3D67",
  secondaryDark: "#0A1C35",
  accent: "#31A6F5",
  accentDark: "#147CC4",
  background: "#F5F8FC",
  surface: "#FFFFFF",
  textPrimary: "#172B3A",
  textSecondary: "#5F6F7E",
  textMuted: "#8998A5",
  border: "#E1E8F0",
  success: "#16A34A",
  successLight: "#34D399",
  successDark: "#166534",
  successPale: "#DCFCE7",
  warning: "#D97706",
  warningLight: "#FBBF24",
  warningDark: "#854D0E",
  warningPale: "#FEF9C3",
  error: "#DC2626",
  errorLight: "#F87171",
  errorPale: "#FEE2E2",
  info: "#2563EB",
  infoLight: "#38BDF8",
  infoDark: "#0284C7",

  // Data visualization colors remain distinct from semantic status colors.
  chartIndigo: "#6366F1",
  chartIndigoDark: "#3730A3",
  chartBlue: "#3B82F6",
  chartBlueDark: "#1E40AF",
  chartBlueDeep: "#1E3A8A",
  chartPurple: "#8B5CF6",
  chartPurpleDark: "#7C3AED",
  chartPurpleDeep: "#9333EA",
  chartPink: "#EC4899",
  chartPinkLight: "#F472B6",
  chartPinkDark: "#DB2777",
  chartCyan: "#06B6D4",
  chartCyanDark: "#0891B2",
  chartLime: "#84CC16",
  chartGreen: "#4ADE80",
  chartSlate: "#475569",

  // Category and social colors are intentionally independent of brand/status colors.
  categoryOrange: "#C2410C",
  categoryOrangeLight: "#EA580C",
  categoryOrangeDark: "#9A3412",
  categoryWarm: "#F4A261",
  categoryViolet: "#7C3AED",
  categoryCyan: "#0891B2",
  categoryPink: "#DB2777",
  facebook: "#1877F2",
  linkedIn: "#0A66C2",
  whatsapp: "#25D366",

  // Neutrals and surfaces used by application pages and dark mode.
  white: "#FFFFFF",
  offWhite: "#FFFEFA",
  black: "#000000",
  gray50: "#F9FAFB",
  gray100: "#F5F5F5",
  gray200: "#E2E8F0",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#475569",
  gray700: "#334155",
  gray800: "#1F2937",
  gray900: "#0F172A",
  gray950: "#030712",
  lightSurface: "#F8FAFC",
  lightSurfaceAlt: "#F1F5F9",
  lightSurfaceBlue: "#F0F7FF",
  lightSurfaceGray: "#F0F0F0",
  lightSurfaceGreen: "#F6FAF9",
  lightBorder: "#D8E3DE",
  lightBorderGreen: "#9AB9B0",
  darkBackground: "#0C1728",
  darkSurface: "#13243B",
  darkSurfaceAlt: "#132038",
  darkSurfaceBlue: "#1B2D4A",
  darkSurfaceNavy: "#1C2C4A",
  darkSurfaceDeep: "#203B56",
  darkTextPrimary: "#F2F7F5",
  darkTextSecondary: "#B6C8C2",
  darkBorder: "#29415F",
  darkAccent: "#65A4FF",
  darkMuted: "#77918A",
  mutedTeal: "#9AB9B0",
  gray999: "#999999",
  darkForest: "#0A1B32",
  darkForestSurface: "#102A4C",
  chartEmerald: "#10B981",
  darkForestAlt: "#17375F",
} as const;

export type ColorToken = keyof typeof colors;

export const getCssColorVariables = (mode: ColorMode) => {
  const activeColors: Record<ColorToken, string> = { ...colors };

  if (mode === "dark") {
    activeColors.background = colors.darkBackground;
    activeColors.surface = colors.darkSurface;
    activeColors.textPrimary = colors.darkTextPrimary;
    activeColors.textSecondary = colors.darkTextSecondary;
    activeColors.border = colors.darkBorder;
    activeColors.secondary = colors.darkBackground;
  }

  const variables: Record<string, string> = {};
  for (const [name, value] of Object.entries(activeColors)) {
    const cssName = name.replace(
      /[A-Z]/g,
      (letter) => `-${letter.toLowerCase()}`,
    );
    variables[`--color-${cssName}`] = value;
    if (/^#[\da-f]{6}$/i.test(value)) {
      const channels = value.slice(1).match(/[\da-f]{2}/gi)!;
      variables[`--rgb-${cssName}`] = channels
        .map((channel) => parseInt(channel, 16))
        .join(", ");
    }
  }

  return variables;
};
