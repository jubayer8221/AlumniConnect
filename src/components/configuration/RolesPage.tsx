import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Chip,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Plus, Pencil, Trash2, Shield, ShieldCheck } from "lucide-react";
import {
  CommonButton,
  CommonPageHeader,
  CommonConfirmDialog,
} from "@/components/common";
import { useRoles } from "@/hooks/useRoles";
import { useAppDispatch } from "@/hooks";
import { showToast } from "@/store/Slice/uiSlice";
import type { CreateUpdateRoleRequest, RoleItem } from "@/types/role";
import RoleFormDialog from "./RoleFormDialog";

export default function RolesPage() {
  const dispatch = useAppDispatch();
  const { roles, loading, fetchRoles, createUpdateRole, deleteRole } =
    useRoles();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RoleItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoleItem | null>(null);

  useEffect(() => {
    void fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (role: RoleItem) => {
    setEditing(role);
    setDialogOpen(true);
  };

  const handleSubmit = async (values: {
    roleCode: string;
    roleName: string;
    description?: string;
    isActive?: boolean;
  }) => {
    const payload: CreateUpdateRoleRequest = {
      roleID: editing?.roleID ?? null,
      roleCode: values.roleCode.trim().toUpperCase(),
      roleName: values.roleName.trim(),
      description: values.description?.trim() || null,
      isActive: values.isActive ?? true,
    };

    try {
      await createUpdateRole(payload);
      dispatch(
        showToast({
          message: editing
            ? "Role updated successfully."
            : "Role created successfully.",
          severity: "success",
        }),
      );
      setDialogOpen(false);
      setEditing(null);
    } catch (reason) {
      dispatch(
        showToast({
          message:
            reason instanceof Error ? reason.message : "Unable to save role",
          severity: "error",
        }),
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRole(deleteTarget.roleID);
      dispatch(
        showToast({
          message: "Role deleted successfully.",
          severity: "success",
        }),
      );
    } catch (reason) {
      dispatch(
        showToast({
          message:
            reason instanceof Error ? reason.message : "Unable to delete role",
          severity: "error",
        }),
      );
    } finally {
      setDeleteTarget(null);
    }
  };

  const isSystemRole = (role: RoleItem) =>
    role.roleCode === "ADMIN" || role.roleCode === "ALUMNI";

  return (
    <Box sx={{ pb: 6 }}>
      <CommonPageHeader
        title="Roles"
        subtitle="Create and manage access roles used across the platform."
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "Configuration" },
          { label: "Roles" },
        ]}
        actions={
          <CommonButton startIcon={<Plus size={18} />} onClick={handleCreate}>
            Add Role
          </CommonButton>
        }
      />

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          p: 2,
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 600 }}>
            <TableHead sx={{ bgcolor: "action.hover" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && roles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      No roles found. Click "Add Role" to create one.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {roles.map((role) => (
                <TableRow key={role.roleID} hover>
                  <TableCell>
                    <Chip
                      size="small"
                      icon={<Shield size={14} />}
                      label={role.roleCode}
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {role.roleName}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary", maxWidth: 320 }}>
                    {role.description || "—"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={role.isActive === false ? "Inactive" : "Active"}
                      color={role.isActive === false ? "default" : "success"}
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEdit(role)}>
                        <Pencil size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={
                        isSystemRole(role)
                          ? "System roles cannot be deleted"
                          : "Delete"
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          disabled={isSystemRole(role)}
                          onClick={() => setDeleteTarget(role)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Loading roles…
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <RoleFormDialog
        open={dialogOpen}
        role={editing}
        loading={loading}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <CommonConfirmDialog
        open={!!deleteTarget}
        title="Delete Role"
        message={`Are you sure you want to delete the "${deleteTarget?.roleName}" role? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
