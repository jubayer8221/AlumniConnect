import { Avatar, type SxProps, type Theme } from "@mui/material";

interface CommonAvatarProps {
  src?: string;
  name: string;
  size?: number;
  sx?: SxProps<Theme>;
}

export default function CommonAvatar({ src, name, size = 48, sx }: CommonAvatarProps) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <Avatar
      src={src}
      sx={{ width: size, height: size, fontSize: size * 0.4, bgcolor: "primary.main", fontWeight: 600, ...sx }}
    >
      {!src && initials}
    </Avatar>
  );
}
