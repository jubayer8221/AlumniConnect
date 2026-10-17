import { Box, Button, Typography } from "@mui/material";
import { UploadCloud } from "lucide-react";

interface CommonFileUploadProps {
  /**
   * Called with:
   *  - dataUrl: base64 preview for immediate display
   *  - file:    the raw File object (use this to upload to the server)
   */
  onFileSelect: (dataUrl: string, file: File) => void;
  accept?: string;
  label?: string;
  currentFile?: string;
  previewSize?: number;
  /** "circle" (default) → square avatar. "cover" → 16:6 banner. */
  variant?: "circle" | "cover";
}

export default function CommonFileUpload({
  onFileSelect,
  accept = "image/*",
  label = "Upload Photo",
  currentFile,
  previewSize = 260,
  variant = "circle",
}: CommonFileUploadProps) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => onFileSelect(reader.result as string, file);
    reader.readAsDataURL(file);
  };

  const isCover = variant === "cover";

  return (
    <Box>
      {currentFile && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={currentFile}
            alt="Preview"
            style={
              isCover
                ? {
                    width: "100%",
                    maxWidth: 640,
                    aspectRatio: "16 / 6",
                    borderRadius: 12,
                    objectFit: "cover",
                    border: "1px solid rgba(var(--rgb-black), 0.08)",
                  }
                : {
                    width: previewSize,
                    height: previewSize,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid rgba(var(--rgb-black), 0.08)",
                  }
            }
          />
        </Box>
      )}
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadCloud size={18} />}
        fullWidth
        sx={{
          minHeight: isCover ? 120 : 180,
          flexDirection: "column",
          gap: 1,
          borderStyle: "dashed",
        }}
      >
        {label}
        <input type="file" accept={accept} hidden onChange={handleFile} />
      </Button>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          mt: 1,
          display: "block",
          textAlign: "center",
        }}
      >
        Click to upload an image (max 5 MB)
      </Typography>
    </Box>
  );
}
