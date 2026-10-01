import {
  DataGrid,
  type GridColDef,
  type GridFeatureMode,
  type GridPaginationModel,
  type GridRowSelectionModel,
  type GridSortModel,
  type GridValidRowModel,
} from "@mui/x-data-grid";
import { alpha, Box, type SxProps, type Theme } from "@mui/material";

interface CommonDataGridProps<T extends GridValidRowModel> {
  columns: GridColDef<T>[];
  rows: T[];
  rowCount?: number;
  page?: number;
  pageSize?: number;
  sortModel?: GridSortModel;
  paginationMode?: GridFeatureMode;
  sortingMode?: GridFeatureMode;
  filterMode?: GridFeatureMode;
  loading?: boolean;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  onSortModelChange?: (model: GridSortModel) => void;
  rowSelectionModel?: GridRowSelectionModel;
  onRowSelectionModelChange?: (model: GridRowSelectionModel) => void;
  onSelectedRowsChange?: (rows: T[]) => void;
  onRowClick?: (params: { id: string | number; row: T }) => void;
  getRowId?: (row: T) => string | number;
  checkboxSelection?: boolean;
  sx?: SxProps<Theme>;
  height?: number | string;
  rowHeight?: number;
  autoHeight?: boolean;
  hideFooter?: boolean;
}

export default function CommonDataGrid<T extends GridValidRowModel>({
  columns,
  rows,
  rowCount,
  page = 0,
  pageSize = 10,
  sortModel,
  paginationMode,
  sortingMode = "client",
  filterMode = "client",
  loading = false,
  onPaginationModelChange,
  onSortModelChange,
  rowSelectionModel,
  onRowSelectionModelChange,
  onSelectedRowsChange,
  onRowClick,
  getRowId,
  checkboxSelection = false,
  sx,
  height = 600,
  rowHeight = 52,
  autoHeight = false,
  hideFooter = false,
}: CommonDataGridProps<T>) {
  return (
    <Box sx={{ width: "100%", height: autoHeight ? "auto" : height }}>
      <DataGrid
        columns={columns}
        rows={rows}
        rowCount={rowCount ?? rows.length}
        paginationModel={{ page, pageSize }}
        sortModel={sortModel}
        onPaginationModelChange={onPaginationModelChange}
        onSortModelChange={onSortModelChange}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(model) => {
          onRowSelectionModelChange?.(model);
          if (!onSelectedRowsChange) return;

          const selectedIds = model.ids;
          onSelectedRowsChange(
            model.type === "include"
              ? rows.filter((row) => selectedIds.has(getRowId?.(row) ?? row.id))
              : rows.filter(
                  (row) => !selectedIds.has(getRowId?.(row) ?? row.id),
                ),
          );
        }}
        onRowClick={(params) =>
          onRowClick?.({
            id: params.id as string | number,
            row: params.row as T,
          })
        }
        getRowId={getRowId ?? ((row) => row.id as string | number)}
        checkboxSelection={checkboxSelection}
        loading={loading}
        pageSizeOptions={[5, 10, 25, 50]}
        rowHeight={rowHeight}
        paginationMode={
          paginationMode ?? (rowCount !== undefined ? "server" : "client")
        }
        sortingMode={sortingMode}
        filterMode={filterMode}
        autoHeight={autoHeight}
        hideFooter={hideFooter}
        disableRowSelectionOnClick
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            borderRadius: 1,
            backgroundColor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.mode === "dark" ? 0.24 : 0.12,
              ),
            borderBottom: "2px solid",
            borderColor: "primary.main",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "transparent",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            color: "text.primary",
            fontWeight: 700,
          },
          "& .MuiDataGrid-virtualScroller": {
            scrollbarWidth: "none",
            "&::-webkit-scrollbar:vertical": { display: "none" },
          },
          "& .MuiDataGrid-scrollbar--vertical": { display: "none" },
          ...sx,
        }}
      />
    </Box>
  );
}
