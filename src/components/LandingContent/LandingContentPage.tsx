import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Container,
  IconButton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
  Skeleton,
} from "@mui/material";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanding } from "@/hooks/useLanding";
import { getIcon } from "@/components/landingPage/HeroSection";

/* tab indices — keep in sync with the <Tab> order below */
const TAB_SLIDES = 0;
const TAB_GALLERY = 1;
const TAB_HERO_STATS = 2;
const TAB_ABOUT_STATS = 3;

export default function LandingContentPage() {
  const navigate = useNavigate();
  const {
    heroSlides,
    heroStats,
    aboutStats,
    galleryPhotos,
    loading,
    error,
    fetchLandingContent,
    deleteHeroSlide,
    deleteGalleryPhoto,
  } = useLanding();

  const [tab, setTab] = useState(TAB_SLIDES);

  useEffect(() => {
    void fetchLandingContent(true);
  }, [fetchLandingContent]);

  const handleDeleteSlide = async (id: string) => {
    if (!window.confirm("Delete this hero slide?")) return;
    try {
      await deleteHeroSlide(id);
    } catch {
      /* store has the error */
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!window.confirm("Delete this gallery photo?")) return;
    try {
      await deleteGalleryPhoto(id);
    } catch {
      /* store has the error */
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Landing Page Content
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage hero slides, gallery, and preview stats shown on the landing
            page.
          </Typography>
        </Box>

        {tab === TAB_SLIDES && (
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => navigate("/alumni/configuration/landing-page/slides/new")}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            Add Hero Slide
          </Button>
        )}

        {tab === TAB_GALLERY && (
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => navigate("/alumni/configuration/landing-page/gallery/new")}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            Add Gallery Photo
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card
        elevation={0}
        sx={{
          borderRadius: 3.5,
          border: "none",
          boxShadow: "0px 4px 20px rgba(var(--rgb-black), 0.04)",
          overflow: "hidden",
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{
            px: 3,
            pt: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Tab
            label={`Hero Slides (${heroSlides.length})`}
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
          <Tab
            label={`Gallery (${galleryPhotos.length})`}
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
          <Tab
            label="Hero Stats"
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
          <Tab
            label="About Stats"
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
        </Tabs>

        {/* ---------- Hero Slides ---------- */}
        {tab === TAB_SLIDES && (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Order</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Preview</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Badge</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading &&
                  heroSlides.length === 0 &&
                  [0, 1, 2].map((i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <Skeleton variant="text" height={40} />
                      </TableCell>
                    </TableRow>
                  ))}

                {!loading && heroSlides.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        No hero slides yet. Click "Add Hero Slide" to create
                        one.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {heroSlides.map((slide) => (
                  <TableRow key={slide.slideID} hover>
                    <TableCell>{slide.displayOrder}</TableCell>
                    <TableCell>
                      {slide.image ? (
                        <Box
                          component="img"
                          src={slide.image}
                          alt={slide.title}
                          sx={{
                            width: 80,
                            height: 45,
                            objectFit: "cover",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.visibility = "hidden";
                          }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, maxWidth: 260 }}>
                      {slide.title}
                      {slide.subtitle && (
                        <Typography variant="caption" color="text.secondary">
                          {slide.subtitle.substring(0, 60)}
                          {slide.subtitle.length > 60 ? "…" : ""}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {slide.badge ?? "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={slide.isActive ? "Active" : "Hidden"}
                        color={slide.isActive ? "success" : "default"}
                        icon={
                          slide.isActive ? (
                            <Eye size={12} />
                          ) : (
                            <EyeOff size={12} />
                          )
                        }
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(`/alumni/configuration/landing-page/slides/${slide.slideID}`)
                          }
                        >
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteSlide(slide.slideID)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* ---------- Gallery ---------- */}
        {tab === TAB_GALLERY && (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Order</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Preview</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Caption</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Span</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading &&
                  galleryPhotos.length === 0 &&
                  [0, 1, 2].map((i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <Skeleton variant="text" height={40} />
                      </TableCell>
                    </TableRow>
                  ))}

                {!loading && galleryPhotos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        No gallery photos yet. Click "Add Gallery Photo" to
                        create one.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {galleryPhotos.map((photo) => (
                  <TableRow key={photo.photoID} hover>
                    <TableCell>{photo.displayOrder}</TableCell>
                    <TableCell>
                      <Box
                        component="img"
                        src={photo.imageURL}
                        alt={photo.caption ?? ""}
                        sx={{
                          width: 80,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                        onError={(e) => {
                          (
                            e.currentTarget as HTMLImageElement
                          ).style.visibility = "hidden";
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, maxWidth: 260 }}>
                      {photo.caption ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={photo.span === 2 ? "Large" : "Normal"}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={photo.isActive ? "Active" : "Hidden"}
                        color={photo.isActive ? "success" : "default"}
                        icon={
                          photo.isActive ? (
                            <Eye size={12} />
                          ) : (
                            <EyeOff size={12} />
                          )
                        }
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(`/alumni/configuration/landing-page/gallery/${photo.photoID}`)
                          }
                        >
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeletePhoto(photo.photoID)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* ---------- Hero Stats ---------- */}
        {tab === TAB_HERO_STATS && (
          <StatsPanel
            loading={loading}
            stats={heroStats}
            hint="These values are computed live from the database and cannot be edited here."
          />
        )}

        {/* ---------- About Stats ---------- */}
        {tab === TAB_ABOUT_STATS && (
          <StatsPanel
            loading={loading}
            stats={aboutStats}
            hint="These values are computed live from the database. Editorial numbers (school age, years of legacy) come from Landing.Setting."
          />
        )}
      </Card>
    </Box>
  );
}

/* ---------- shared read-only stat panel ---------- */
function StatsPanel({
  loading,
  stats,
  hint,
}: {
  loading: boolean;
  stats: {
    statID: number;
    iconKey: string;
    value: string;
    label: string;
    displayOrder: number;
  }[];
  hint: string;
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        {hint}
      </Alert>

      {loading && stats.length === 0 ? (
        <Skeleton variant="rounded" height={160} />
      ) : (
        <Stack spacing={2}>
          {stats.map((s) => (
            <Card
              key={s.statID}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getIcon(s.iconKey, 22)}
              </Box>
              <Box>
                <Typography
                  sx={{ fontSize: "1.5rem", fontWeight: 800, lineHeight: 1.1 }}
                >
                  {s.value}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.85rem", color: "text.secondary" }}
                >
                  {s.label}
                </Typography>
              </Box>
              <Typography
                sx={{
                  ml: "auto",
                  fontSize: "0.75rem",
                  color: "text.disabled",
                  fontFamily: "monospace",
                }}
              >
                iconKey: {s.iconKey}
              </Typography>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
