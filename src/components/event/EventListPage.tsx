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
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  setPage,
  setPageSize,
  setSearch,
  fetchEventsAsync,
} from "@/store/Slice/eventSlice";
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
import type { EventItem, EventFilters } from "@/types/event";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

// Tab indices — matches visual order (All first, then Upcoming, then Past)
const TAB_ALL = 0;
const TAB_UPCOMING = 1;
const TAB_PAST = 2;

/**
 * Build the filter object sent to the API based on the active tab and
 * the two date inputs. `TAB_ALL` sends nothing — the SP returns every
 * event ordered by StartDate DESC.
 */
function buildFilters(
  tab: number,
  fromDate: string,
  toDate: string,
): EventFilters {
  if (tab === TAB_UPCOMING) {
    return {
      status: "UPCOMING",
      dateFrom: fromDate || undefined,
      dateTo: toDate || undefined,
    };
  }
  if (tab === TAB_PAST) {
    return {
      dateFrom: fromDate || undefined,
      dateTo: toDate || new Date().toISOString().slice(0, 10),
    };
  }
  return {
    dateFrom: fromDate || undefined,
    dateTo: toDate || undefined,
  };
}

export default function EventListPage({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, loading, error, totalCount, search, pageNumber, pageSize } =
    useAppSelector((s) => s.events);

  const [tab, setTab] = useState(TAB_ALL);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  /* ============================================================
     Effect 1 — Initial mount
     Fetch only if the store is empty. If we already have cached
     events (user visited the page earlier), skip the network call.
     ============================================================ */
  useEffect(() => {
    if (!items || items.length === 0) {
      void dispatch(
        fetchEventsAsync({
          pageNumber,
          pageSize,
          search: debouncedSearch || undefined,
          filters: buildFilters(tab, fromDate, toDate),
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============================================================
     Effect 2 — Filter / search / pagination changes
     Refetch whenever any of these change. Skip the very first
     render because Effect 1 already handled the mount case.
     ============================================================ */
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    void dispatch(
      fetchEventsAsync({
        pageNumber,
        pageSize,
        search: debouncedSearch || undefined,
        filters: buildFilters(tab, fromDate, toDate),
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, tab, fromDate, toDate, pageNumber, pageSize]);

  // Client-side filter safety net — the server already filters, but
  // this keeps the UI consistent if an event's status changes mid-session.
  const filtered = items.filter((e) => {
    if (tab === TAB_UPCOMING) return e.status === "UPCOMING";
    if (tab === TAB_PAST) return e.status === "COMPLETED";
    return true;
  });

  const basePath = isAdmin ? "/events" : "/alumni/events";

  return (
    <Box>
      <CommonPageHeader
        title="Events"
        subtitle={`${totalCount} events total`}
        breadcrumbs={[
          { label: "Home", path: isAdmin ? "/dashboard" : "/alumni/dashboard" },
          { label: "Events" },
        ]}
        actions={
          isAdmin ? (
            <CommonButton
              startIcon={<Plus size={18} />}
              onClick={() => navigate("/events/new")}
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
            onChange={(value) => dispatch(setSearch(value))}
            placeholder="Search events..."
          />
        </Box>
        <TextField
          label="From"
          type="date"
          size="small"
          value={fromDate}
          onChange={(event) => {
            setFromDate(event.target.value);
            dispatch(setPage(1));
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="To"
          type="date"
          size="small"
          value={toDate}
          onChange={(event) => {
            setToDate(event.target.value);
            dispatch(setPage(1));
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <Tabs
        value={tab}
        onChange={(_, value) => {
          setTab(value);
          dispatch(setPage(1));
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
          onRetry={() =>
            void dispatch(
              fetchEventsAsync({
                pageNumber,
                pageSize,
                search: debouncedSearch || undefined,
                filters: buildFilters(tab, fromDate, toDate),
              }),
            )
          }
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
        <Grid container spacing={3}>
          {filtered.map((evt: EventItem) => (
            <Grid key={evt.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  overflow: "hidden",
                  transition: "all 0.2s",
                  "&:hover": { boxShadow: 4, transform: "translateY(-2px)" },
                }}
              >
                {evt.image && (
                  <Box
                    component="img"
                    src={evt.image}
                    alt={evt.title}
                    onError={(event) => {
                      event.currentTarget.src = "/image/favicon.png";
                    }}
                    sx={{ width: "100%", height: 180, objectFit: "cover" }}
                  />
                )}
                <CardContent sx={{ p: 3 }}>
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
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
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
          onChange={(page) => dispatch(setPage(page))}
          onPageSizeChange={(size) => dispatch(setPageSize(size))}
        />
      )}
    </Box>
  );
}
