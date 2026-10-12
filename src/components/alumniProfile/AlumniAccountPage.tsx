import { Box, Card, CardContent, Typography } from "@mui/material";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "@/store/Slice/uiSlice";
import {
  CommonPageHeader,
  CommonInputField,
  CommonButton,
} from "@/components/common";
import { useAppDispatch } from "@/hooks";
import { ChangePasswordRequest } from "@/types/auth";
// import type { ChangePasswordRequest } from "@/types/auth";

/* ============================================================
   Form validation — inline
   ============================================================ */
const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "New password must be at least 8 characters"),
  confirmNewPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>;

export default function AlumniAccountPage() {
  const dispatch = useAppDispatch();
  const { loading, changePassword, authUser: user } = useAuth();

  const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      const message = await changePassword(data as ChangePasswordRequest);
      dispatch(showToast({ message, severity: "success" }));
      reset();
    } catch (err) {
      dispatch(
        showToast({
          message:
            err instanceof Error ? err.message : "Failed to change password",
          severity: "error",
        }),
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
                name="confirmNewPassword"
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
