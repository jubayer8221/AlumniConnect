import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Check, X, UserPlus, MessageSquare, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  CommonAvatar,
  CommonEmptyState,
  CommonLoading,
  CommonPageHeader,
} from "@/components/common";
import { useConnections } from "@/hooks/useConnections";
import { useAlumni } from "@/hooks/useAlumni";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/hooks";
import { showToast } from "@/store/Slice/uiSlice";
import type { ConnectionItem } from "@/types/connection";

const TAB_CONNECTIONS = 0;
const TAB_REQUESTS = 1;
const TAB_SUGGESTIONS = 2;

export default function MyNetworkPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { authUser: me } = useAuth();

  const {
    connections,
    pendingRequests,
    loading: connLoading,
    fetchMyConnections,
    fetchPendingRequests,
    respondRequest,
    removeConnection,
  } = useConnections();

  const {
    alumniData: suggestions,
    loading: alumniLoading,
    fetchAlumniData,
  } = useAlumni();

  const [tab, setTab] = useState(TAB_CONNECTIONS);

  /* ---------- Initial load ---------- */
  useEffect(() => {
    void fetchMyConnections().catch(() => undefined);
    void fetchPendingRequests().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Lazy load suggestions when tab opens ---------- */
  useEffect(() => {
    if (tab === TAB_SUGGESTIONS && (!suggestions || suggestions.length === 0)) {
      void fetchAlumniData({ pageNumber: 1, pageSize: 24 }).catch(
        () => undefined,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  /* ---------- Suggestions = alumni not already connected / requested ---------- */
  const connectedUserIDs = useMemo(() => {
    const set = new Set<number>();
    connections.forEach((c) => set.add(c.otherUserID));
    pendingRequests.forEach((p) => set.add(p.otherUserID));
    return set;
  }, [connections, pendingRequests]);

  const filteredSuggestions = useMemo(
    () =>
      (suggestions ?? []).filter(
        (a) => String(a.userID) !== me?.id && !connectedUserIDs.has(a.userID),
      ),
    [suggestions, connectedUserIDs, me],
  );

  const handleRespond = async (connectionID: number, accept: boolean) => {
    try {
      await respondRequest(connectionID, accept);
      dispatch(
        showToast({
          message: accept ? "Request accepted." : "Request rejected.",
          severity: accept ? "success" : "info",
        }),
      );
    } catch {
      dispatch(
        showToast({
          message: "Unable to respond to request.",
          severity: "error",
        }),
      );
    }
  };

  const handleRemove = async (otherUserID: number) => {
    try {
      await removeConnection(otherUserID);
      dispatch(showToast({ message: "Connection removed.", severity: "info" }));
    } catch {
      dispatch(
        showToast({
          message: "Unable to remove connection.",
          severity: "error",
        }),
      );
    }
  };

  const renderConnectionCard = (
    c: ConnectionItem,
    actions: React.ReactNode,
  ) => (
    <Grid key={c.connectionID} size={{ xs: 12, sm: 6, md: 4 }}>
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          height: "100%",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: "0 12px 28px rgba(var(--rgb-black), 0.06)",
          },
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >
            <CommonAvatar
              src={c.profilePhoto ?? undefined}
              name={c.fullName ?? "User"}
              size={52}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {c.fullName ?? "Unknown"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {c.email ?? ""}
              </Typography>
            </Box>
          </Box>

          {actions}
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box>
      <CommonPageHeader
        title="My Network"
        subtitle="Connect with fellow alumni, manage requests, and grow your circle."
        breadcrumbs={[
          { label: "Home", path: "/alumni/dashboard" },
          { label: "My Network" },
        ]}
      />

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          mb: 3,
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{
            px: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Tab
            label={`My Connections (${connections.length})`}
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
          <Tab
            label={`Requests (${pendingRequests.length})`}
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
          <Tab
            label="Suggestions"
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
        </Tabs>
      </Card>

      {/* --- TAB 1: Connections --- */}
      {tab === TAB_CONNECTIONS && (
        <>
          {connLoading && connections.length === 0 ? (
            <CommonLoading fullHeight={false} />
          ) : connections.length === 0 ? (
            <CommonEmptyState
              title="No connections yet"
              message="Start connecting with fellow alumni from the directory or suggestions tab."
              icon={<Users size={48} className="text-gray-300" />}
            />
          ) : (
            <Grid container spacing={2.5}>
              {connections.map((c) =>
                renderConnectionCard(
                  c,
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<MessageSquare size={16} />}
                      onClick={() =>
                        navigate(`/alumni/network/messages?to=${c.otherUserID}`)
                      }
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                      }}
                    >
                      Message
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => void handleRemove(c.otherUserID)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                      }}
                    >
                      Remove
                    </Button>
                  </Box>,
                ),
              )}
            </Grid>
          )}
        </>
      )}

      {/* --- TAB 2: Requests --- */}
      {tab === TAB_REQUESTS && (
        <>
          {connLoading && pendingRequests.length === 0 ? (
            <CommonLoading fullHeight={false} />
          ) : pendingRequests.length === 0 ? (
            <CommonEmptyState
              title="No pending requests"
              message="When someone sends you a connection request, it will appear here."
              icon={<UserPlus size={48} className="text-gray-300" />}
            />
          ) : (
            <Grid container spacing={2.5}>
              {pendingRequests.map((c) =>
                renderConnectionCard(
                  c,
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<Check size={16} />}
                      onClick={() => void handleRespond(c.connectionID, true)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<X size={16} />}
                      onClick={() => void handleRespond(c.connectionID, false)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                      }}
                    >
                      Reject
                    </Button>
                  </Box>,
                ),
              )}
            </Grid>
          )}
        </>
      )}

      {/* --- TAB 3: Suggestions --- */}
      {tab === TAB_SUGGESTIONS && (
        <>
          {alumniLoading && (!suggestions || suggestions.length === 0) ? (
            <CommonLoading fullHeight={false} />
          ) : filteredSuggestions.length === 0 ? (
            <CommonEmptyState
              title="No new suggestions"
              message="You've already connected with everyone we can suggest. Check back later."
            />
          ) : (
            <Grid container spacing={2.5}>
              {filteredSuggestions.map((a) => (
                <Grid key={a.alumniID} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      height: "100%",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        boxShadow: "0 12px 28px rgba(var(--rgb-black), 0.06)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 2,
                        }}
                      >
                        <CommonAvatar
                          src={a.personalInformation.profilePhoto ?? undefined}
                          name={a.personalInformation.fullName}
                          size={52}
                        />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.95rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {a.personalInformation.fullName}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {a.academicInformation[0]?.departmentName || ""}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 1.5 }} />

                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          size="small"
                          startIcon={<UserPlus size={16} />}
                          onClick={() =>
                            navigate(`/alumni/profile-details/${a.alumniID}`)
                          }
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                          }}
                        >
                          View Profile
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
