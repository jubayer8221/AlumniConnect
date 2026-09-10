import { Box, Card, CardContent, Typography, Alert } from "@mui/material";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { changePasswordAsync } from "@/Slice/authSlice";
import { showToast } from "@/Slice/uiSlice";
import { changePasswordSchema } from "@/validation/authValidation";
import {
  CommonPageHeader,
  CommonInputField,
  CommonButton,
} from "@/components/common";
import type { ChangePasswordRequest } from "@/types/auth";

export default function AlumniAccountPage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const { user } = useAppSelector((s) => s.auth);

  const { control, handleSubmit, reset } = useForm<ChangePasswordRequest>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordRequest) => {
    const res = await dispatch(changePasswordAsync(data));
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(
        showToast({
          message: "Password changed successfully",
          severity: "success",
        }),
      );
      reset();
    } else {
      dispatch(
        showToast({ message: "Failed to change password", severity: "error" }),
      );
    }
  };

  return (
    <Box>
      <CommonPageHeader
        title="My Account"
        subtitle="Manage your account settings and password"
        breadcrumbs={[
          { label: "Home", path: "/alumni/dashboard" },
          { label: "My Account" },
        ]}
      />

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          maxWidth: "100%",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <KeyRound size={20} className="text-blue-600" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Change Password
            </Typography>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Account: {user?.username}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <CommonInputField
                name="currentPassword"
                label="Current Password"
                control={control}
                type="password"
                required
              />
              <CommonInputField
                name="newPassword"
                label="New Password"
                control={control}
                type="password"
                required
              />
              <CommonInputField
                name="confirmPassword"
                label="Confirm New Password"
                control={control}
                type="password"
                required
              />
              <CommonButton type="submit" loading={loading}>
                Change Password
              </CommonButton>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
