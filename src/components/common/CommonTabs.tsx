import { Tabs, Tab, Box } from "@mui/material";
import { useState, type SyntheticEvent } from "react";

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface CommonTabsProps {
  tabs: TabItem[];
  initialTab?: number;
  onChange?: (index: number) => void;
}

export default function CommonTabs({ tabs, initialTab = 0, onChange }: CommonTabsProps) {
  const [value, setValue] = useState(initialTab);
  const handleChange = (_e: SyntheticEvent, newVal: number) => {
    setValue(newVal);
    onChange?.(newVal);
  };
  return (
    <Box>
      <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
        {tabs.map((t, i) => <Tab key={i} label={t.label} />)}
      </Tabs>
      <Box sx={{ mt: 3 }}>{tabs[value]?.content}</Box>
    </Box>
  );
}
