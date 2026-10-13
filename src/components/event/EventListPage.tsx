import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Tabs,
  Tab,
  TextField,
} from "@mui/material";
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import {
  CommonPageHeader,
  CommonSearchField,
  CommonEmptyState,
  CommonErrorState,
  CommonLoading,
  CommonButton,
  CommonStatusBadge,
  CommonPagination,
} from "@/components/common";
import { formatDate, formatTime } from "@/utils/dateUtils";
import type { EventItem } from "@/types/event";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { hasAdminAccess } from "@/utils/authUtils";

const TAB_ALL = 0;
const TAB_UPCOMING = 1;
const TAB_PAST = 2;

export default function EventListPage() {
  const navigate = useNavigate();
  const { authUser: user } = useAuth();
  const isAdmin = hasAdminAccess(user?.role);
  const basePath = isAdmin ? "/events" : "/alumni/events";
  const homePath = isAdmin ? "/dashboard" : "/alumni/dashboard";

  const {
    items,
    loading,
    error,
    totalCount,
    search,
    pageNumber,
    pageSize,
    fetchEvents,
    setSearch,
    setPage,
    setPageSize,
  } = useEvents();

  const [tab, setTab] = useState(TAB_ALL);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const upcomingOnly = tab === TAB_UPCOMING ? true : undefined;
  const pastToDate =
    tab === TAB_PAST && !toDate
      ? new Date().toISOString().slice(0, 10)
      : undefined;

  const buildParams = () => ({
    pageNumber,
    pageSize,
    search: debouncedSearch || undefined,
    upcomingOnly,
    fromDate: fromDate || undefined,
    toDate: toDate || pastToDate || undefined,
  });

  useEffect(() => {
    void fetchEvents(buildParams());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    void fetchEvents(buildParams());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, tab, fromDate, toDate, pageNumber, pageSize]);

  const filtered = items.filter((e) => {
    if (tab === TAB_UPCOMING) return e.status === "UPCOMING";
    if (tab === TAB_PAST)
      return e.status === "COMPLETED" || e.status === "CANCELLED";
    return true;
  });

  return (
    <Box>
      <CommonPageHeader
        title="Events"
        subtitle={`${totalCount} events total`}
        breadcrumbs={[{ label: "Home", path: homePath }, { label: "Events" }]}
        actions={
          isAdmin ? (
            <CommonButton
              startIcon={<Plus size={18} />}
              onClick={() => navigate(`${basePath}/new`)}
            >
              Create Event
            </CommonButton>
          ) : undefined
        }
      />

      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Box sx={{ flexGrow: 1, minWidth: 250 }}>
          <CommonSearchField
            value={search}
            onChange={setSearch}
            placeholder="Search events..."
          />
        </Box>
        <TextField
          label="From"
          type="date"
          size="small"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setPage(1);
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="To"
          type="date"
          size="small"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setPage(1);
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => {
          setTab(v);
          setPage(1);
        }}
        sx={{ mb: 2 }}
      >
        <Tab label="All Events" />
        <Tab label="Upcoming" />
        <Tab label="Past Events" />
      </Tabs>

      {error && !items.length ? (
        <CommonErrorState
          message={error}
          onRetry={() => void fetchEvents(buildParams())}
        />
      ) : loading ? (
        <CommonLoading fullHeight={false} />
      ) : filtered.length === 0 ? (
        <CommonEmptyState
          title="No events found"
          message="No events match your criteria."
          icon={<CalendarDays size={48} className="text-gray-300" />}
        />
      ) : (
        <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
          {filtered.map((evt: EventItem) => (
            <Grid key={evt.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  overflow: "hidden",
                  transition: "all 0.2s",
                  "&:hover": { boxShadow: 4, transform: "translateY(-2px)" },
                }}
              >
                {/* Fixed image area — always same height */}
                <Box
                  sx={{
                    width: "100%",
                    height: 180,
                    flexShrink: 0,
                    bgcolor: "action.hover",
                  }}
                >
                  <Box
                    component="img"
                    src={evt.image || "/image/logo-small.png"}
                    alt={evt.title}
                    onError={(e) => {
                      e.currentTarget.src = "/image/logo-small.png";
                    }}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>

                <CardContent
                  sx={{
                    p: 3,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{ display: "flex", gap: 0.5, mb: 1, flexWrap: "wrap" }}
                  >
                    <Chip
                      label={evt.eventType}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <CommonStatusBadge status={evt.status} />
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                      fontWeight: 700,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "3rem", // ~2 lines
                    }}
                  >
                    {evt.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      color: "text.secondary",
                      minHeight: "2.5rem", // ~2 lines
                    }}
                  >
                    {evt.description}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      mb: 2,
                      flex: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "text.secondary",
                      }}
                    >
                      <CalendarDays size={14} /> {formatDate(evt.date)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "text.secondary",
                      }}
                    >
                      <Clock size={14} /> {formatTime(evt.startTime)} -{" "}
                      {formatTime(evt.endTime)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "text.secondary",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <MapPin size={14} /> {evt.venue}, {evt.location}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "text.secondary",
                      }}
                    >
                      <Users size={14} /> Capacity: {evt.capacity}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(`${basePath}/${evt.id}`)}
                    endIcon={<ArrowRight size={16} />}
                    sx={{ mt: "auto" }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {totalCount > 0 && (
        <CommonPagination
          count={Math.max(1, Math.ceil(totalCount / pageSize))}
          page={pageNumber}
          pageSize={pageSize}
          onChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </Box>
  );
}
