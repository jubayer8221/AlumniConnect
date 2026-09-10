import { Card, CardContent, type SxProps, type Theme } from "@mui/material";

interface CommonCardProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  onClick?: () => void;
  elevation?: number;
}

export default function CommonCard({ children, sx, onClick, elevation = 0 }: CommonCardProps) {
  return (
    <Card
      onClick={onClick}
      elevation={elevation}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": onClick ? { boxShadow: 3, transform: "translateY(-2px)" } : {},
        ...sx,
      }}
    >
      <CardContent sx={{ p: 3 }}>{children}</CardContent>
    </Card>
  );
}
