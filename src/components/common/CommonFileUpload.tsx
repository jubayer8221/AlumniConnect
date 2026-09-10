import { Box, Button, Typography } from "@mui/material";
import { UploadCloud } from "lucide-react";

interface CommonFileUploadProps {
  onFileSelect: (dataUrl: string) => void;
  accept?: string;
  label?: string;
  currentFile?: string;
  /** Diameter of the circular preview, in px. Defaults to 160. */
  previewSize?: number;
}

export default function CommonFileUpload({
  onFileSelect,
  accept = "image/*",
  label = "Upload Photo",
  currentFile,
  previewSize = 260,
}: CommonFileUploadProps) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => onFileSelect(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      {currentFile && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <img
            src={currentFile}
            alt="Preview"
            style={{
              width: previewSize,
              height: previewSize,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          />
        </Box>
      )}
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadCloud size={18} />}
        fullWidth
        sx={{
          minHeight: 180,
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
        Click to upload an image
      </Typography>
    </Box>
  );
}
