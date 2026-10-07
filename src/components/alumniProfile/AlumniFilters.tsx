import {
  Box,
  Collapse,
  Button,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks";
import {
  setFilters,
  clearFilters,
  type AlumniFilters as FilterType,
} from "@/store/Slice/alumniSlice";

const years = Array.from(
  { length: 20 },
  (_, i) => new Date().getFullYear() - i,
);

const programs = [
  { label: "SSC", value: 1 },
  { label: "HSC", value: 2 },
  { label: "Honours", value: 3 },
  { label: "Masters", value: 4 },
];

export default function AlumniFilters() {
  const dispatch = useAppDispatch();
  const currentFilters = useAppSelector((s) => s.alumni.filters);
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<FilterType>(currentFilters);

  useEffect(() => {
    setLocal(currentFilters);
  }, [currentFilters]);

  const apply = () => dispatch(setFilters(local));

  const clear = () => {
    dispatch(clearFilters());
    setLocal({});
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <Button
          size="small"
          startIcon={<Filter size={16} />}
          endIcon={open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          onClick={() => setOpen(!open)}
        >
          Filters
        </Button>
        <Button size="small" onClick={clear} color="error">
          Clear All
        </Button>
      </Box>

      <Collapse in={open}>
        <Box
          sx={{
            p: 1.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.5,
            bgcolor: "background.paper",
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
              <TextField
                select
                size="small"
                margin="dense"
                fullWidth
                label="Program"
                value={local.programId ?? ""}
                onChange={(e) =>
                  setLocal({
                    ...local,
                    programId: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {programs.map((p) => (
                  <MenuItem key={p.value} value={p.value}>
                    {p.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
              <TextField
                select
                size="small"
                margin="dense"
                fullWidth
                label="Graduation Year"
                value={local.graduationYear ?? ""}
                onChange={(e) =>
                  setLocal({
                    ...local,
                    graduationYear: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
              <TextField
                select
                size="small"
                margin="dense"
                fullWidth
                label="Status"
                value={local.status ?? ""}
                onChange={(e) =>
                  setLocal({ ...local, status: e.target.value || undefined })
                }
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </TextField>
            </Grid>

            <Grid
              size={{ xs: 12, sm: 6, md: 3, lg: 3 }}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                size="small"
                onClick={apply}
                sx={{ height: 40, mt: 0.5 }}
              >
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
}
