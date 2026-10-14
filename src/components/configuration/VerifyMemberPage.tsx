import { useEffect, useState } from "react";
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
import { Search, ShieldCheck, BadgeCheck } from "lucide-react";
import {
  CommonButton,
  CommonPageHeader,
  CommonSearchField,
  CommonAvatar,
  CommonConfirmDialog,
} from "@/components/common";
import { useAlumni } from "@/hooks/useAlumni";
import { useAppDispatch } from "@/hooks";
import { showToast } from "@/store/Slice/uiSlice";
import type { AlumniProfileFullModel } from "@/types/alumni";

export default function VerifyMemberPage() {
  const dispatch = useAppDispatch();
  const { alumniData, loading, totalCount, fetchAlumniData, verifyAlumni } =
    useAlumni();

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [searchRequest, setSearchRequest] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [confirmTarget, setConfirmTarget] =
    useState<AlumniProfileFullModel | null>(null);

  useEffect(() => {
    void fetchAlumniData({
      search: appliedSearch || undefined,
      pageNumber: pageNumber + 1,
      pageSize,
    }).catch((reason: unknown) => {
      dispatch(
        showToast({
          message:
            reason instanceof Error ? reason.message : "Unable to load alumni",
          severity: "error",
        }),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedSearch, pageNumber, pageSize, dispatch, searchRequest]);

  const handleSearch = () => {
    setPageNumber(0);
    setAppliedSearch(search.trim());
    setSearchRequest((c) => c + 1);
  };

  const handleVerify = async () => {
    if (!confirmTarget) return;
    try {
      await verifyAlumni(confirmTarget.alumniID, {
        search: appliedSearch || undefined,
        pageNumber: pageNumber + 1,
        pageSize,
      });
      dispatch(
        showToast({
          message: "Member verified successfully.",
          severity: "success",
        }),
      );
    } catch (reason) {
      dispatch(
        showToast({
          message:
            reason instanceof Error
              ? reason.message
              : "Unable to verify member",
          severity: "error",
        }),
      );
    } finally {
      setConfirmTarget(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pb: 6 }}>
      <CommonPageHeader
        title="Verify Member"
        // subtitle="Review and verify alumni profiles to grant full network access."
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "Configuration" },
          { label: "Verify Member" },
        ]}
      />

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
            placeholder="Search by name or email..."
            fullWidth
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
                <TableCell sx={{ fontWeight: 700 }}>Member</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && alumniData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                      No members found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {alumniData.map((alum, index) => {
                const p = alum.personalInformation;
                const c = alum.contactInformation;
                const rowNumber = pageNumber * pageSize + index + 1;

                return (
                  <TableRow key={alum.alumniID} hover>
                    <TableCell
                      sx={{ color: "text.secondary", fontWeight: 500 }}
                    >
                      {rowNumber}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <CommonAvatar
                          src={p.profilePhoto ?? undefined}
                          name={p.fullName}
                          size={36}
                        />
                        <Box>
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.9rem" }}
                          >
                            {p.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {p.nativeName ?? ""}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {c.email || "—"}
                    </TableCell>
                    <TableCell>
                      {alum.isVerified ? (
                        <Chip
                          size="small"
                          icon={<BadgeCheck size={14} />}
                          label="Verified"
                          color="success"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      ) : (
                        <Chip
                          size="small"
                          label="Pending"
                          color="warning"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <CommonButton
                        size="small"
                        startIcon={<ShieldCheck size={16} />}
                        disabled={alum.isVerified || loading}
                        onClick={() => setConfirmTarget(alum)}
                      >
                        {alum.isVerified ? "Verified" : "Verify"}
                      </CommonButton>
                    </TableCell>
                  </TableRow>
                );
              })}

              {loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Loading members…
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalCount}
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

      <CommonConfirmDialog
        open={!!confirmTarget}
        title="Verify Member"
        message={`Are you sure you want to verify "${confirmTarget?.personalInformation.fullName}"?`}
        confirmLabel="Verify"
        onConfirm={handleVerify}
        onCancel={() => setConfirmTarget(null)}
        color="primary"
      />
    </Container>
  );
}
