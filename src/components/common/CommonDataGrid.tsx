import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRowSelectionModel,
  type GridSortModel,
} from "@mui/x-data-grid";
import { Box, type SxProps, type Theme } from "@mui/material";

interface CommonDataGridProps {
  columns: GridColDef[];
  rows: Record<string, unknown>[];
  rowCount?: number;
  page?: number;
  pageSize?: number;
  loading?: boolean;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  onSortModelChange?: (model: GridSortModel) => void;
  onRowSelectionModelChange?: (model: GridRowSelectionModel) => void;
  onRowClick?: (params: {
    id: string | number;
    row: Record<string, unknown>;
  }) => void;
  getRowId?: (row: Record<string, unknown>) => string | number;
  checkboxSelection?: boolean;
  sx?: SxProps<Theme>;
  height?: number | string;
  rowHeight?: number;
}

export default function CommonDataGrid({
  columns,
  rows,
  rowCount,
  page = 0,
  pageSize = 10,
  loading = false,
  onPaginationModelChange,
  onSortModelChange,
  onRowSelectionModelChange,
  onRowClick,
  getRowId,
  checkboxSelection = false,
  sx,
  height = 600,
  rowHeight = 52,
}: CommonDataGridProps) {
  return (
    <Box sx={{ width: "100%", height: height }}>
      <DataGrid
        columns={columns}
        rows={rows}
        rowCount={rowCount ?? rows.length}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={onPaginationModelChange}
        onSortModelChange={onSortModelChange}
        onRowSelectionModelChange={onRowSelectionModelChange}
        onRowClick={(params) =>
          onRowClick?.({
            id: params.id as string | number,
            row: params.row as Record<string, unknown>,
          })
        }
        getRowId={getRowId ?? ((row) => row.id as string | number)}
        checkboxSelection={checkboxSelection}
        loading={loading}
        pageSizeOptions={[5, 10, 25, 50]}
        rowHeight={rowHeight}
        paginationMode={rowCount !== undefined ? "server" : "client"}
        disableRowSelectionOnClick
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeaders": { borderRadius: 1 },
          ...sx,
        }}
      />
    </Box>
  );
}
