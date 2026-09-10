import { Pagination, PaginationItem, Box } from "@mui/material";

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
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {pageSizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
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
