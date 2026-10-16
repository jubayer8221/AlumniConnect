import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

/** Text/block alignment for a section of the header. */
export type SectionAlign = "left" | "center" | "right";

export interface SectionHeaderProps {
  /** Main heading. */
  title: ReactNode;
  /** Small uppercase label rendered above or below the title. */
  subtitle?: ReactNode;
  /** Optional supporting paragraph below the title. */
  description?: ReactNode;
  /** Right-aligned slot for a Button / Link / inline action. */
  action?: ReactNode;
  /**
   * Master alignment for subtitle, title, and description.
   * Each can be overridden individually with `*Align`. Default: "left".
   */
  align?: SectionAlign;
  /** Override alignment for the subtitle only. Falls back to `align`. */
  subtitleAlign?: SectionAlign;
  /** Override alignment for the title only. Falls back to `align`. */
  titleAlign?: SectionAlign;
  /** Override alignment for the description only. Falls back to `align`. */
  descriptionAlign?: SectionAlign;
  /** Whether the subtitle row sits above or below the title. Default: "below". */
  subtitlePosition?: "above" | "below";
  /** Force the title to uppercase. Default: true. */
  titleUppercase?: boolean;
  /** Title color. Default: "primary.main". */
  titleColor?: string;
  /** Description color. Default: "text.secondary". */
  descriptionColor?: string;
  /** Max width of the description paragraph. Default: 560. */
  descriptionMaxWidth?: number | string;
  /**
   * Draw an underline below the title.
   * When enabled, the title shrinks to fit its content and, based on
   * `titleAlign`, is pushed left, centered, or right.
   */
  titleBorder?: boolean;
  /** Thickness of the underline. Default: 3. */
  titleBorderWidth?: number;
  /** Color of the underline. Default: same as titleColor. */
  titleBorderColor?: string;
  /** Outer wrapper sx. */
  sx?: SxProps<Theme>;
  /** Title typography overrides. */
  titleSx?: SxProps<Theme>;
  /** Subtitle typography overrides. */
  subtitleSx?: SxProps<Theme>;
  /** Description typography overrides. */
  descriptionSx?: SxProps<Theme>;
  /** Action wrapper overrides. */
  actionSx?: SxProps<Theme>;
}

/* Shared typography for the meta row (subtitle + action). */
const META_TYPOGRAPHY = {
  fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
  fontWeight: 700,
  letterSpacing: { xs: "0.1em", md: "0.15em" },
  textTransform: "uppercase",
  lineHeight: 1.5,
} as const;

/* Responsive title scale. */
const TITLE_SIZE = {
  xs: "1.35rem",
  sm: "1.55rem",
  md: "1.85rem",
  lg: "2rem",
} as const;

export default function SectionHeader({
  title,
  subtitle,
  description,
  action,
  align = "left",
  subtitleAlign,
  titleAlign,
  descriptionAlign,
  subtitlePosition = "below",
  titleUppercase = true,
  titleColor = "primary.main",
  descriptionColor = "text.secondary",
  descriptionMaxWidth = 560,
  titleBorder = false,
  titleBorderWidth = 3,
  titleBorderColor,
  sx,
  titleSx,
  subtitleSx,
  descriptionSx,
  actionSx,
}: SectionHeaderProps) {
  /* Per-element alignment — each falls back to the master `align`. */
  const effSubtitleAlign: SectionAlign = subtitleAlign ?? align;
  const effTitleAlign: SectionAlign = titleAlign ?? align;
  const effDescriptionAlign: SectionAlign = descriptionAlign ?? align;

  const isSubtitleCenter = effSubtitleAlign === "center";
  const isSubtitleRight = effSubtitleAlign === "right";
  const isTitleCenter = effTitleAlign === "center";
  const isTitleRight = effTitleAlign === "right";
  const isDescriptionCenter = effDescriptionAlign === "center";
  const isDescriptionRight = effDescriptionAlign === "right";

  /* ------------- Subtitle ------------- */
  const subtitleNode = subtitle ? (
    <Typography
      component="div"
      sx={{
        ...META_TYPOGRAPHY,
        color: "primary.main",
        textAlign: effSubtitleAlign,
        ...subtitleSx,
      }}
    >
      {subtitle}
    </Typography>
  ) : null;

  /* ------------- Title ------------- */
  const titleNode = (
    <Typography
      component="h2"
      sx={{
        fontSize: TITLE_SIZE,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        lineHeight: { xs: 1.2, md: 1.15 },
        textTransform: titleUppercase ? "uppercase" : "none",
        color: titleColor,
        overflowWrap: "break-word",
        wordBreak: "break-word",
        textAlign: effTitleAlign,
        ...(titleBorder && {
          width: "fit-content",
          maxWidth: "100%",
          /* Block positioning: center → mx auto, right → ml auto, left → none */
          ...(isTitleCenter && { mx: "auto" }),
          ...(isTitleRight && { ml: "auto", mr: 0 }),
          pb: { xs: 0.75, md: 1 },
          borderBottom: `${titleBorderWidth}px solid`,
          borderColor: titleBorderColor ?? titleColor,
        }),
        ...titleSx,
      }}
    >
      {title}
    </Typography>
  );

  /* ------------- Description ------------- */
  const descriptionNode = description ? (
    <Typography
      component="p"
      sx={{
        mt: { xs: 1, md: 1.5 },
        fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
        lineHeight: 1.65,
        color: descriptionColor,
        maxWidth: { xs: "100%", md: descriptionMaxWidth },
        /* Same block positioning logic as the bordered title */
        ...(isDescriptionCenter && { mx: "auto" }),
        ...(isDescriptionRight && { ml: "auto", mr: 0 }),
        textAlign: effDescriptionAlign,
        ...descriptionSx,
      }}
    >
      {description}
    </Typography>
  ) : null;

  /* ------------- Action ------------- */
  const actionNode = action ? (
    <Box
      sx={{
        ...META_TYPOGRAPHY,
        color: "primary.main",
        display: "inline-flex",
        alignItems: "center",
        flexShrink: 0,
        "& .MuiButtonBase-root, & .MuiButton-root, & a, & button": {
          fontSize: "inherit !important",
          fontWeight: "inherit !important",
          letterSpacing: "inherit !important",
          textTransform: "inherit !important",
          color: "inherit !important",
          lineHeight: "inherit !important",
          minWidth: 0,
          padding: 0,
          backgroundColor: "transparent !important",
          "&:hover": {
            backgroundColor: "transparent !important",
            textDecoration: "underline",
          },
        },
        "& .MuiButton-endIcon": { marginLeft: 0.5, marginRight: 0 },
        "& .MuiButton-startIcon": { marginRight: 0.5, marginLeft: 0 },
        ...actionSx,
      }}
    >
      {action}
    </Box>
  ) : null;

  /* Justify-content for the top and meta rows when subtitle shares the row
     with an action. */
  const rowJustify = isSubtitleCenter
    ? "center"
    : isSubtitleRight
      ? action
        ? "flex-end" // subtitle + action both packed to the right
        : "flex-end"
      : action
        ? "space-between" // subtitle left, action right
        : "flex-start";

  /* ============================================================
     TOP ROW (subtitlePosition="above")
     When subtitle is centered AND there's an action, use a
     3-column grid so the subtitle stays truly centered on its own,
     regardless of how wide the action is.
     ============================================================ */
  const topRow =
    subtitlePosition === "above" && (subtitle || action) ? (
      isSubtitleCenter && action ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "minmax(0, 1fr) auto minmax(0, 1fr)",
            },
            alignItems: "center",
            columnGap: { sm: 2 },
            rowGap: { xs: 0.75, sm: 0 },
            mb: { xs: 1, md: 1.5 },
          }}
        >
          {/* Left spacer — mirrors the action column */}
          <Box
            aria-hidden="true"
            sx={{ display: { xs: "none", sm: "block" } }}
          />

          <Box
            sx={{
              minWidth: 0,
              display: "flex",
              justifyContent: "center",
              gridColumn: { xs: 1, sm: 2 },
            }}
          >
            {subtitleNode}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-end" },
              minWidth: 0,
              gridColumn: { xs: 1, sm: 3 },
            }}
          >
            {actionNode}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: rowJustify,
            gap: { xs: 1, sm: 2 },
            mb: { xs: 1, md: 1.5 },
            flexWrap: "wrap",
          }}
        >
          {subtitleNode}
          {actionNode}
        </Box>
      )
    ) : null;

  /* ============================================================
     BELOW ROW (subtitlePosition="below")
     ============================================================ */
  const metaRow =
    subtitlePosition === "below" && (subtitle || action) ? (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: rowJustify,
          gap: { xs: 1, sm: 2 },
          flexWrap: "wrap",
        }}
      >
        {subtitleNode}
        {actionNode}
      </Box>
    ) : null;

  return (
    <Box
      sx={{
        mb: { xs: 2.5, sm: 3, md: 4 },
        ...sx,
      }}
    >
      {subtitlePosition === "above" && topRow}

      {titleNode}
      {descriptionNode}

      {subtitlePosition === "below" && metaRow && (
        <Box sx={{ mt: { xs: 0.75, md: 1 } }}>{metaRow}</Box>
      )}
    </Box>
  );
}
