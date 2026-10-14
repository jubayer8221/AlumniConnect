import { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  CommonInputField,
  CommonCheckbox,
  CommonButton,
} from "@/components/common";
import type { RoleItem } from "@/types/role";

const schema = yup.object({
  roleCode: yup
    .string()
    .trim()
    .required("Role code is required")
    .max(50, "Too long"),
  roleName: yup
    .string()
    .trim()
    .required("Role name is required")
    .max(100, "Too long"),
  description: yup.string().default(""),
  isActive: yup.boolean().default(true),
});

type FormValues = yup.InferType<typeof schema>;

interface Props {
  open: boolean;
  role: RoleItem | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
}

export default function RoleFormDialog({
  open,
  role,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const isEdit = !!role;

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: yupResolver(schema) as never,
    defaultValues: {
      roleCode: "",
      roleName: "",
      description: "",
      isActive: true,
    } as never,
  });

  useEffect(() => {
    if (!open) return;
    if (role) {
      reset({
        roleCode: role.roleCode,
        roleName: role.roleName,
        description: role.description ?? "",
        isActive: role.isActive ?? true,
      } as never);
    } else {
      reset({
        roleCode: "",
        roleName: "",
        description: "",
        isActive: true,
      } as never);
    }
  }, [open, role, reset]);

  const close = () => {
    if (loading) return;
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={close} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isEdit ? "Edit Role" : "Create Role"}
        <IconButton size="small" onClick={close} disabled={loading}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2.5}>
            <CommonInputField
              name="roleCode"
              label="Role Code"
              control={control}
              placeholder="e.g. MODERATOR"
              required
            />
            <CommonInputField
              name="roleName"
              label="Role Name"
              control={control}
              placeholder="e.g. Moderator"
              required
            />
            <CommonInputField
              name="description"
              label="Description"
              control={control}
              placeholder="Optional"
            />
            <CommonCheckbox name="isActive" label="Active" control={control} />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <CommonButton variant="outlined" onClick={close} disabled={loading}>
            Cancel
          </CommonButton>
          <CommonButton type="submit" loading={loading}>
            {isEdit ? "Update Role" : "Create Role"}
          </CommonButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
