import { useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Chip, Button, Tabs, Tab } from "@mui/material";
import { CalendarDays, MapPin, Clock, Users, Plus, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchEventsAsync } from "@/Slice/eventSlice";
import { CommonPageHeader, CommonSearchField, CommonEmptyState, CommonLoading, CommonButton, CommonStatusBadge } from "@/components/common";
import { formatDate, formatTime } from "@/utils/dateUtils";
import type { EventItem } from "@/types/event";

export default function EventListPage({ isAdmin = false }: { isAdmin?: boolean }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading, totalCount, search, pageNumber } = useAppSelector((s) => s.events);
  const [tab, setTab] = useState(0);

  useEffect(() => { dispatch(fetchEventsAsync()); }, [dispatch, pageNumber]);

  const filtered = items.filter((e) => {
    if (tab === 0) return e.status === "UPCOMING";
    if (tab === 1) return e.status === "COMPLETED";
    return true;
  });

  const basePath = isAdmin ? "/events" : "/alumni/events";

  return (
    <Box>
      <CommonPageHeader
        title="Events"
        subtitle={`${totalCount} events total`}
        breadcrumbs={[{ label: "Home", path: isAdmin ? "/dashboard" : "/alumni/dashboard" }, { label: "Events" }]}
        actions={isAdmin ? <CommonButton startIcon={<Plus size={18} />} onClick={() => navigate("/events/create")}>Create Event</CommonButton> : undefined}
      />

      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Box sx={{ flexGrow: 1, minWidth: 250 }}>
          <CommonSearchField value={search} onChange={(v) => dispatch(fetchEventsAsync({ search: v } as never))} placeholder="Search events..." />
        </Box>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Upcoming" />
        <Tab label="Past Events" />
        <Tab label="All Events" />
      </Tabs>

      {loading ? <CommonLoading fullHeight={false} /> : filtered.length === 0 ? (
        <CommonEmptyState title="No events found" message="No events match your criteria." icon={<CalendarDays size={48} className="text-gray-300" />} />
      ) : (
        <Grid container spacing={3}>
          {filtered.map((evt: EventItem) => (
            <Grid key={evt.id} size={{ xs: 12, sm: 6, md: 4}}>
              <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden", transition: "all 0.2s", "&:hover": { boxShadow: 4, transform: "translateY(-2px)" } }}>
                {evt.image && <Box component="img" src={evt.image} alt={evt.title} sx={{ width: "100%", height: 180, objectFit: "cover" }} />}
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", gap: 0.5, mb: 1, flexWrap: "wrap" }}>
                    <Chip label={evt.eventType} size="small" color="primary" variant="outlined" />
                    <CommonStatusBadge status={evt.status} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>{evt.title}</Typography>
                  <Typography variant="body2" sx={{ mb: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", color: "text.secondary" }}>{evt.description}</Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
                    <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}><CalendarDays size={14} /> {formatDate(evt.date)}</Typography>
                    <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}><Clock size={14} /> {formatTime(evt.startTime)} - {formatTime(evt.endTime)}</Typography>
                    <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}><MapPin size={14} /> {evt.venue}, {evt.location}</Typography>
                    <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}><Users size={14} /> Capacity: {evt.capacity}</Typography>
                  </Box>
                  <Button variant="outlined" fullWidth onClick={() => navigate(`${basePath}/${evt.id}`)} endIcon={<ArrowRight size={16} />}>View Details</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
