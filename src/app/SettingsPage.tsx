import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  Grid,
} from "@mui/material";
import { Settings as SettingsIcon, RotateCcw, Save } from "lucide-react";
import { useState } from "react";
import { useAppDispatch } from "@/hooks";
import { showToast } from "@/Slice/uiSlice";
import {
  CommonPageHeader,
  CommonButton,
  CommonConfirmDialog,
  CommonCard,
} from "@/components/common";
import { localStorageService } from "@/services/storage/localStorageService";
import { STORAGE_KEYS } from "@/services/storage/storageKeys";
import { appConfig } from "@/config/appConfig";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const [confirmReset, setConfirmReset] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({
    institutionName: appConfig.institutionName,
    contactEmail: appConfig.contactEmail,
    contactPhone: appConfig.contactPhone,
    address: appConfig.address,
    website: appConfig.website,
    defaultPageSize: String(appConfig.defaultPageSize),
    dateFormat: appConfig.dateFormat,
  });

  const handleSave = () => {
    localStorageService.set(STORAGE_KEYS.SETTINGS, settings);
    dispatch(
      showToast({
        message: "Settings saved successfully",
        severity: "success",
      }),
    );
  };

  const handleReset = () => {
    localStorageService.clear();
    dispatch(
      showToast({
        message: "Demo data reset. Please refresh the page.",
        severity: "info",
      }),
    );
    setConfirmReset(false);
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <Box>
      <CommonPageHeader
        title="Settings"
        subtitle="Manage institution and application settings"
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "Settings" },
        ]}
        actions={
          <CommonButton
            variant="contained"
            startIcon={<Save size={18} />}
            onClick={handleSave}
          >
            Save Settings
          </CommonButton>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <CommonCard>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <SettingsIcon size={20} className="text-blue-600" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Institution Settings
              </Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                label="Institution Name"
                value={settings.institutionName}
                onChange={(e) =>
                  setSettings({ ...settings, institutionName: e.target.value })
                }
                size="small"
                fullWidth
              />
              <TextField
                label="Contact Email"
                value={settings.contactEmail}
                onChange={(e) =>
                  setSettings({ ...settings, contactEmail: e.target.value })
                }
                size="small"
                fullWidth
              />
              <TextField
                label="Contact Phone"
                value={settings.contactPhone}
                onChange={(e) =>
                  setSettings({ ...settings, contactPhone: e.target.value })
                }
                size="small"
                fullWidth
              />
              <TextField
                label="Website"
                value={settings.website}
                onChange={(e) =>
                  setSettings({ ...settings, website: e.target.value })
                }
                size="small"
                fullWidth
              />
              <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
                <TextField
                  label="Address"
                  value={settings.address}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                  size="small"
                  rows={3}
                  multiline
                  fullWidth
                />
              </Box>
            </Box>
          </CommonCard>
        </Grid>

        {/* <Grid size={{ xs: 12, md: 4}}>
          <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "error.main" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: "error.main" }}>Danger Zone</Typography>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Resetting demo data will clear all alumni, events, notices, and settings from localStorage. This cannot be undone.
              </Alert>
              <Button variant="outlined" color="error" fullWidth startIcon={<RotateCcw size={18} />} onClick={() => setConfirmReset(true)}>
                Reset Demo Data
              </Button>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>

      <CommonConfirmDialog
        open={confirmReset}
        title="Reset Demo Data"
        message="Are you sure you want to reset all demo data? This will clear all localStorage data and reinitialize seed data."
        confirmLabel="Reset Data"
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
        color="error"
      />
    </Box>
  );
}
