import {
  Box,
  Collapse,
  Button,
  Grid,
} from "@mui/material";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks";
import {
  setFilters,
  clearFilters,
  type AlumniFilters as FilterType,
} from "@/store/Slice/alumniSlice";
import CommonDropDown from "@/components/common/CommonDropDown";

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
              <CommonDropDown
                label="Program"
                value={local.programId ?? ""}
                menuItems={[{ label: "All", value: "" }, ...programs]}
                onChange={(value) =>
                  setLocal({
                    ...local,
                    programId: value ? Number(value) : undefined,
                  })
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
              <CommonDropDown
                label="Graduation Year"
                value={local.graduationYear ?? ""}
                menuItems={[
                  { label: "All", value: "" },
                  ...years.map((year) => ({ label: String(year), value: year })),
                ]}
                onChange={(value) =>
                  setLocal({
                    ...local,
                    graduationYear: value ? Number(value) : undefined,
                  })
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
              <CommonDropDown
                label="Status"
                value={local.status ?? ""}
                menuItems={[
                  { label: "All", value: "" },
                  { label: "Active", value: "ACTIVE" },
                  { label: "Inactive", value: "INACTIVE" },
                ]}
                onChange={(value) =>
                  setLocal({ ...local, status: value || undefined })
                }
              />
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
