import { Pagination, PaginationItem, Box } from "@mui/material";
import CommonDropDown from "./CommonDropDown";

interface CommonPaginationProps {
  count: number;
  page: number;
  onChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export default function CommonPagination({
  count, page, onChange, pageSize, onPageSizeChange, pageSizeOptions = [5, 10, 25, 50],
}: CommonPaginationProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mt: 2 }}>
      {pageSize && onPageSizeChange && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span className="text-sm text-gray-500">Rows per page:</span>
          <CommonDropDown
            label="Rows per page"
            value={pageSize}
            menuItems={pageSizeOptions.map((size) => ({
              value: size,
              label: String(size),
            }))}
            onChange={(value) => onPageSizeChange(Number(value))}
            sx={{ width: 90 }}
          />
        </Box>
      )}
      <Pagination
        count={count}
        page={page}
        onChange={(_, p) => onChange(p)}
        color="primary"
        shape="rounded"
        renderItem={(item) => <PaginationItem {...item} />}
      />
    </Box>
  );
}
