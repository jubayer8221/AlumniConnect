import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
  CardActionArea,
} from "@mui/material";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  Calendar,
  Users,
  Globe,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { formatDate, formatTime } from "@/utils/dateUtils";
import type { EventItem } from "@/types/event";
import LandingHeader from "../LandingHeader";
import LandingFooter from "../LandingFooter";
import EventDetailsDialog from "./EventDetailsDialog";
import CommonBanner from "@/components/common/CommonBanner";
import { CommonButton } from "@/components/common";

const PAGE_SIZE_OPTIONS = [9, 18, 36] as const;

export default function PublicEventsListPage() {
  const navigate = useNavigate();
  const { items, loading, error, fetchEvents } = useEvents();
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(9);

  useEffect(() => {
    void fetchEvents({ pageNumber: 1, pageSize: 100 });
  }, [fetchEvents]);

  /* ---------- Base list ---------- */
  const allEvents: EventItem[] = useMemo(() => items ?? [], [items]);

  /* ---------- Search filter ---------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allEvents;
    return allEvents.filter(
      (e) =>
        (e.title ?? "").toLowerCase().includes(q) ||
        (e.venue ?? "").toLowerCase().includes(q) ||
        (e.location ?? "").toLowerCase().includes(q) ||
        (e.description ?? "").toLowerCase().includes(q) ||
        (e.eventType ?? "").toLowerCase().includes(q),
    );
  }, [allEvents, search]);

  /* ---------- Reset to page 1 on search / page-size change ---------- */
  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  /* ---------- Pagination math ---------- */
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalCount);
  const paged = useMemo(
    () => filtered.slice(startIdx, endIdx),
    [filtered, startIdx, endIdx],
  );

  /* ---------- Page change → scroll ---------- */
  const handlePageChange = (
    _: React.ChangeEvent<unknown>,
    nextPage: number,
  ) => {
    setPage(nextPage);
    document
      .getElementById("events-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const eventCount = allEvents.length;

  const eventStats = [
    {
      icon: <Calendar size={22} />,
      value: `${eventCount}+`,
      label: "Upcoming Events",
    },
    {
      icon: <Globe size={22} />,
      value: "Global",
      label: "Chapters & Meets",
    },
    {
      icon: <Users size={22} />,
      value: "Active",
      label: "Community Gatherings",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <LandingHeader />

      <CommonBanner
        badge="Community Gatherings"
        title="Connect, Celebrate, and Relive"
        highlightText="Alumni Events"
        subtitle="Explore upcoming reunions, networking sessions, and cultural programs organized by the network across the globe."
        stats={eventStats}
      />

      <Box component="main" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          {/* ============ Page header + search + back ============ */}
          <Box
            id="events-grid"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "flex-end" },
              gap: 3,
              mb: 4,
              scrollMarginTop: 100,
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  mb: 1,
                }}
              >
                All Events
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                  mb: 0.5,
                }}
              >
                Upcoming Events
              </Typography>
              {/* <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "0.9rem",
                  maxWidth: 560,
                }}
              >
                {filtered.length} {filtered.length === 1 ? "event" : "events"}{" "}
                available
                {search ? ` for "${search}"` : ""}.
              </Typography> */}
            </Box>

            <Box
              sx={{
                width: { xs: "100%", md: "auto" },
                flexShrink: 0,
                display: "flex",
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              <TextField
                size="small"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  width: { xs: "100%", md: 300 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "background.paper",
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} style={{ opacity: 0.6 }} />
                      </InputAdornment>
                    ),
                    endAdornment: search ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearch("")}
                          aria-label="Clear search"
                        >
                          <X size={14} />
                        </IconButton>
                      </InputAdornment>
                    ) : undefined,
                  },
                }}
              />
              <CommonButton
                startIcon={<ArrowLeft size={18} />}
                onClick={() => navigate(-1)}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Back
              </CommonButton>
            </Box>
          </Box>

          {/* ============ Loading ============ */}
          {loading && allEvents.length === 0 && (
            <Grid container spacing={3}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton
                    variant="rounded"
                    height={360}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* ============ Empty ============ */}
          {!loading && (error || filtered.length === 0) && (
            <Box
              sx={{
                py: 10,
                textAlign: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 3,
                color: "text.secondary",
              }}
            >
              <CalendarDays
                size={40}
                style={{ marginBottom: 12, opacity: 0.5 }}
              />
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                {search ? "No matching events" : "No upcoming events"}
              </Typography>
              <Typography sx={{ fontSize: "0.9rem" }}>
                {search
                  ? "Try a different search term or clear the search."
                  : "Please check back later."}
              </Typography>
              {search && (
                <Button
                  onClick={() => setSearch("")}
                  sx={{
                    mt: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                  }}
                >
                  Clear search
                </Button>
              )}
            </Box>
          )}

          {/* ============ Cards ============ */}
          {filtered.length > 0 && (
            <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
              {paged.map((evt: EventItem) => (
                <Grid key={evt.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 16px 32px rgba(var(--rgb-black), 0.08)",
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => setSelected(evt)}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                      }}
                    >
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
                        {evt.eventType && evt.eventType !== "Other" && (
                          <Chip
                            label={evt.eventType}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mb: 1.5, alignSelf: "flex-start" }}
                          />
                        )}
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "1.05rem",
                            lineHeight: 1.35,
                            mb: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "2.8rem",
                          }}
                        >
                          {evt.title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.75,
                            flex: 1,
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
                            <Clock size={14} /> {formatTime(evt.startTime)} –{" "}
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
                            <MapPin size={14} /> {evt.venue}
                            {evt.location ? `, ${evt.location}` : ""}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            mt: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.75,
                            color: "primary.main",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            py: 1,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                          }}
                        >
                          View Details <ArrowRight size={16} />
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* ============================================================
              BOTTOM BAR — info + page-size + pagination
             ============================================================ */}
          {filtered.length > 0 && (
            <Box
              sx={{
                mt: 6,
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Typography
                  sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                >
                  Showing{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                  >
                    {totalCount === 0 ? 0 : startIdx + 1}–{endIdx}
                  </Box>{" "}
                  of{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                  >
                    {totalCount}
                  </Box>{" "}
                  {totalCount === 1 ? "event" : "events"}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: "center" }}
                >
                  <Typography
                    sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                  >
                    Per page:
                  </Typography>
                  <Select
                    size="small"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    sx={{
                      minWidth: 80,
                      "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2 },
                    }}
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Box>

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    siblingCount={1}
                    boundaryCount={1}
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontWeight: 600,
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>

      <EventDetailsDialog
        open={!!selected}
        event={selected}
        onClose={() => setSelected(null)}
        onLoginClick={() => navigate("/login")}
      />

      <LandingFooter />
    </Box>
  );
}
