import { Box, Collapse, Button, Grid, TextField, MenuItem } from "@mui/material";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import type { AlumniFilters as FilterType } from "@/types/alumni";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { setFilters, clearFilters } from "@/Slice/alumniSlice";

const years = Array.from({ length: 20 }, (_, i) => 2025 - i);
const departments = ["Computer Science", "Electrical Engineering", "Business Administration", "Civil Engineering", "Architecture", "Mechanical Engineering", "Pharmacy", "English", "Biotechnology", "Environmental Science", "Psychology", "Law", "Information Systems", "Agriculture", "Statistics"];
const programs = ["BSc in Computer Science", "BSc in Electrical Engineering", "Bachelor of Business Administration", "BSc in Civil Engineering", "Bachelor of Architecture", "BSc in Mechanical Engineering", "Bachelor of Pharmacy", "BA in English Literature", "BSc in Biotechnology", "BSc in Environmental Science", "BA in Psychology", "LLB in Law", "BSc in Information Systems", "BSc in Agriculture", "BSc in Statistics", "BBA in Finance", "BBA in Marketing"];
const industries = ["Information Technology", "Finance", "Healthcare", "Construction", "Education", "Media", "Legal", "Telecommunications", "Manufacturing", "Energy", "Consulting", "Environmental", "Agriculture", "Human Resources", "FMCG"];
const cities = ["Dhaka", "Chittagong", "Sylhet", "Khulna", "Rajshahi", "New York", "London", "Toronto", "Singapore", "Dubai", "Berlin", "Sydney", "Tokyo", "Kolkata"];
const countries = ["Bangladesh", "USA", "UK", "Canada", "Singapore", "UAE", "Germany", "Australia", "Japan", "India"];

export default function AlumniFilters() {
  const dispatch = useAppDispatch();
  const currentFilters = useAppSelector((s) => s.alumni.filters);
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<FilterType>(currentFilters);

  useEffect(() => { setLocal(currentFilters); }, [currentFilters]);

  const apply = () => dispatch(setFilters(local));

  const clear = () => { dispatch(clearFilters()); setLocal({}); };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <Button size="small" startIcon={<Filter size={16} />} endIcon={open ? <ChevronUp size={16} /> : <ChevronDown size={16} />} onClick={() => setOpen(!open)}>
          Filters
        </Button>
        <Button size="small" onClick={clear} color="error">Clear All</Button>
      </Box>
      <Collapse in={open}>
        <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2, bgcolor: "white" }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3}}>
              <TextField select size="small" fullWidth label="Department" value={local.departmentId || ""} onChange={(e) => setLocal({ ...local, departmentId: e.target.value || undefined })}>
                <MenuItem value=""><em>All</em></MenuItem>
                {departments.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3}}>
              <TextField select size="small" fullWidth label="Program" value={local.programId || ""} onChange={(e) => setLocal({ ...local, programId: e.target.value || undefined })}>
                <MenuItem value=""><em>All</em></MenuItem>
                {programs.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3}}>
              <TextField select size="small" fullWidth label="Graduation Year" value={local.graduationYear || ""} onChange={(e) => setLocal({ ...local, graduationYear: e.target.value ? Number(e.target.value) : undefined })}>
                <MenuItem value=""><em>All</em></MenuItem>
                {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3}}>
              <TextField select size="small" fullWidth label="Gender" value={local.gender || ""} onChange={(e) => setLocal({ ...local, gender: e.target.value as FilterType["gender"] || undefined })}>
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3}}>
              <TextField select size="small" fullWidth label="City" value={local.city || ""} onChange={(e) => setLocal({ ...local, city: e.target.value || undefined })}>
                <MenuItem value=""><em>All</em></MenuItem>
                {cities.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3}}>
              <TextField select size="small" fullWidth label="Country" value={local.country || ""} onChange={(e) => setLocal({ ...local, country: e.target.value || undefined })}>
                <MenuItem value=""><em>All</em></MenuItem>
                {countries.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3}}>
              <TextField select size="small" fullWidth label="Industry" value={local.industry || ""} onChange={(e) => setLocal({ ...local, industry: e.target.value || undefined })}>
                <MenuItem value=""><em>All</em></MenuItem>
                {industries.map((i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3}}>
              <TextField select size="small" fullWidth label="Status" value={local.status || ""} onChange={(e) => setLocal({ ...local, status: e.target.value as FilterType["status"] || undefined })}>
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3}}>
              <TextField select size="small" fullWidth label="Verified" value={local.isVerified === undefined ? "" : String(local.isVerified)} onChange={(e) => setLocal({ ...local, isVerified: e.target.value === "" ? undefined : e.target.value === "true" })}>
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="true">Verified</MenuItem>
                <MenuItem value="false">Unverified</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3}}>
              <TextField select size="small" fullWidth label="Mentor Available" value={local.willingToMentor === undefined ? "" : String(local.willingToMentor)} onChange={(e) => setLocal({ ...local, willingToMentor: e.target.value === "" ? undefined : e.target.value === "true" })}>
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button variant="contained" size="small" onClick={apply}>Apply Filters</Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
