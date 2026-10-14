import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  Chip,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
} from "@mui/material";
import { Search, ShieldCheck } from "lucide-react";
import {
  CommonButton,
  CommonDropDown,
  CommonPageHeader,
  CommonSearchField,
} from "@/components/common";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useAppDispatch } from "@/hooks";
import { showToast } from "@/store/Slice/uiSlice";

export default function UserRoleManagementPage() {
  const dispatch = useAppDispatch();
  const {
    users,
    roles,
    totalUsers,
    loading,
    savingUserID,
    fetchUsersAndRoles,
    assignRole,
  } = useUserRoles();
  const [selectedRoleByUser, setSelectedRoleByUser] = useState<
    Record<number, string>
  >({});
  const [search, setSearch] = useState("");
  const [roleCode, setRoleCode] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedRoleCode, setAppliedRoleCode] = useState("");
  const [searchRequest, setSearchRequest] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    void fetchUsersAndRoles({
      search: appliedSearch,
      roleCode: appliedRoleCode,
      pageNumber: pageNumber + 1,
      pageSize,
    }).catch((reason: unknown) => {
      dispatch(
        showToast({
          message:
            reason instanceof Error
              ? reason.message
              : "Unable to load users and roles",
          severity: "error",
        }),
      );
    });
  }, [
    appliedRoleCode,
    appliedSearch,
    fetchUsersAndRoles,
    pageNumber,
    pageSize,
    dispatch,
    searchRequest,
  ]);

  const roleOptions = useMemo(
    () => roles.map((role) => ({ value: role.roleID, label: role.roleName })),
    [roles],
  );
  const roleFilterOptions = useMemo(
    () => [
      { value: "", label: "All roles" },
      ...roles.map((role) => ({ value: role.roleCode, label: role.roleName })),
    ],
    [roles],
  );

  const handleSearch = () => {
    setPageNumber(0);
    setAppliedSearch(search.trim());
    setAppliedRoleCode(roleCode);
    setSearchRequest((current) => current + 1);
  };

  const handleAssignRole = async (userID: number) => {
    const roleID = Number(selectedRoleByUser[userID]);
    if (!roleID) return;
    try {
      await assignRole(userID, roleID);
      dispatch(
        showToast({
          message: "User role updated successfully.",
          severity: "success",
        }),
      );
    } catch (reason) {
      dispatch(
        showToast({
          message:
            reason instanceof Error ? reason.message : "Unable to assign role",
          severity: "error",
        }),
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pb: 6 }}>
      <CommonPageHeader
        title="User Role Management"
        subtitle="Assign and manage access roles for registered users across the platform."
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "User Roles" },
        ]}
      />

      {/* Filter and Search Bar */}
      <Card
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 280 } }}>
          <CommonSearchField
            value={search}
            onChange={setSearch}
            placeholder="Search by name, username, or email..."
            fullWidth
          />
        </Box>
        <Box sx={{ width: { xs: "100%", sm: 220 } }}>
          <CommonDropDown
            label="Filter by role"
            value={roleCode}
            menuItems={roleFilterOptions}
            onChange={setRoleCode}
          />
        </Box>
        <CommonButton
          startIcon={<Search size={17} />}
          onClick={handleSearch}
          sx={{ px: 3, py: 1.25 }}
        >
          Search
        </CommonButton>
      </Card>

      {/* Users Table Card */}
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
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ bgcolor: "action.hover" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: "70px" }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Current Role</TableCell>
                <TableCell sx={{ fontWeight: 700, minWidth: 200 }}>
                  Assign Role
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                      No users found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {users.map((user, index) => {
                const currentRoleID = user.roles?.[0]?.roleID;
                const selectedRoleID =
                  selectedRoleByUser[user.userID] ??
                  (currentRoleID ? String(currentRoleID) : "");
                const rowNumber = pageNumber * pageSize + index + 1;

                return (
                  <TableRow key={user.userID} hover>
                    <TableCell
                      sx={{ color: "text.secondary", fontWeight: 500 }}
                    >
                      {rowNumber}
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                        {user.fullName || user.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.username}
                        {user.userCode ? ` · ${user.userCode}` : ""}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {user.email || "—"}
                    </TableCell>
                    <TableCell>
                      {user.roles?.length ? (
                        user.roles.map((role) => (
                          <Chip
                            key={role.roleID}
                            size="small"
                            label={role.roleName}
                            color="primary"
                            variant="outlined"
                            sx={{ mr: 0.5, fontWeight: 500 }}
                          />
                        ))
                      ) : (
                        <Chip
                          size="small"
                          label="Unassigned"
                          variant="outlined"
                          color="default"
                          sx={{ opacity: 0.7 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <CommonDropDown
                        label="Select role"
                        value={selectedRoleID}
                        menuItems={roleOptions}
                        disabled={loading || roleOptions.length === 0}
                        onChange={(value) =>
                          setSelectedRoleByUser((current) => ({
                            ...current,
                            [user.userID]: value,
                          }))
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <CommonButton
                        size="small"
                        startIcon={<ShieldCheck size={16} />}
                        loading={savingUserID === user.userID}
                        disabled={
                          !selectedRoleID ||
                          String(currentRoleID ?? "") === selectedRoleID ||
                          savingUserID !== null
                        }
                        onClick={() => void handleAssignRole(user.userID)}
                      >
                        Save
                      </CommonButton>
                    </TableCell>
                  </TableRow>
                );
              })}

              {loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Loading users and roles…
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalUsers}
          page={pageNumber}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={(_, nextPage) => setPageNumber(nextPage)}
          onRowsPerPageChange={(event) => {
            setPageSize(Number(event.target.value));
            setPageNumber(0);
          }}
          sx={{ borderTop: "1px solid", borderColor: "divider" }}
        />
      </Card>
    </Container>
  );
}
