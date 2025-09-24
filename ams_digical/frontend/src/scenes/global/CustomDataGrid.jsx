import {
  Box,
  Button,
  ButtonGroup,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {
  DataGrid,
  gridPageCountSelector,
  GridPagination,
  useGridSelector,
  useGridApiContext,
  GRID_DATE_COL_DEF,
  getGridDateOperators,
  GridToolbar,
} from "@mui/x-data-grid";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { enGB as locale } from "date-fns/locale";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MuiPagination from "@mui/material/Pagination";

function Pagination({ page, onPageChange, className }) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event, newPage - 1);
      }}
    />
  );
}

function CustomPagination(props) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}

const dateAdapter = new AdapterDateFns({ locale });

const dateColumnType = {
  ...GRID_DATE_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditDateCell {...params} />;
  },
  filterOperators: getGridDateOperators(false).map((item) => ({
    ...item,
    InputComponent: GridFilterDateInput,
  })),
  valueFormatter: (value) => {
    if (value) {
      return dateAdapter.format(value, "keyboardDate");
    }
    return "";
  },
};
const GridEditDateInput = styled(InputBase)({
  fontSize: "inherit",
  padding: "0 9px",
});

function WrappedGridEditDateInput(props) {
  const { InputProps, focused, ...other } = props;
  return <GridEditDateInput fullWidth {...InputProps} {...other} />;
}

function GridEditDateCell({ id, field, value }) {
  const apiRef = useGridApiContext();

  const Component = DatePicker;

  const handleChange = (newValue) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <Component
      value={value}
      autoFocus
      onChange={handleChange}
      slots={{ textField: WrappedGridEditDateInput }}
    />
  );
}

function GridFilterDateInput(props) {
  const { item, applyValue, apiRef } = props;

  const Component = DatePicker;

  const handleFilterChange = (newValue) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <Component
      value={item.value ? new Date(item.value) : null}
      autoFocus
      label={apiRef.current.getLocaleText("filterPanelInputLabel")}
      slotProps={{
        textField: {
          variant: "standard",
        },
        inputAdornment: {
          sx: {
            "& .MuiButtonBase-root": {
              marginRight: -1,
            },
          },
        },
      }}
      onChange={handleFilterChange}
    />
  );
}

const CustomDataGrid = (props) => {
  const {
    title,
    table,
    columns,
    onChange,
    pageSize,
    mode,
    sources,
    source,
    batches_processed,
    last_maintenance,
    onRowClick,
    selectionModel,
    onRowSelectionModelChange,
  } = props;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isProjector = mode === "projector" ? true : false;

  let tabs;
  if (title === "Sources") {
    tabs = (
      <>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            variant={isSmallScreen ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            value={source}
            onChange={onChange}
            aria-label="data tabs"
            selectionFollowsFocus
            sx={{
              ".MuiTab-root": {
                fontSize: { xs: "0.875rem", lg: "1rem" },
                padding: { xs: "8px", lg: "16px" },
              },
            }}
          >
            {sources.map((src, index) => (
              <Tab key={index} label={src.machine_name} />
            ))}
          </Tabs>
        </Box>
      </>
    );
  }

  let source_info;
  if (sources && sources[source]) {
    source_info = (
      <Box display="flex" margin="1rem" width="100%">
        <ButtonGroup size="large">
          <Button
            variant="contained"
            sx={{
              backgroundColor:
                batches_processed >= 8
                  ? "red"
                  : batches_processed > 5
                    ? "orange"
                    : "green",
              color: "#fff",
              "&:hover": {
                backgroundColor:
                  batches_processed >= 8
                    ? "darkred"
                    : batches_processed > 5
                      ? "darkorange"
                      : "darkgreen",
              },
              fontSize: isProjector ? "0.8rem" : "1rem",
            }}
          >
            Runs: {batches_processed}
          </Button>
          <Button
            variant="contained"
            sx={{ fontSize: isProjector ? "0.8rem" : "1rem" }}
          >
            Last Cleaned: {last_maintenance}
          </Button>
        </ButtonGroup>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        ".MuiTablePagination-displayedRows": {
          "margin-top": "1em",
          "margin-bottom": "1em",
        },
        ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
          "margin-top": "1em",
          "margin-bottom": "1em",
        },
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
        <Box width="100%" overflowX="auto">
          {tabs}
          {source_info}
          <DataGrid
            autoPageSize={false}
            sx={{
              overflowX: "auto",
              "& .MuiDataGrid-root": {
                minWidth: 600,
              },
              // Style for projector mode
              "& .MuiDataGrid-columnHeaders": {
                fontSize: isProjector ? "1.2rem" : "1rem", // Increase header font size
                padding: "10px",
              },
              "& .MuiDataGrid-cell": {
                fontSize: isProjector ? "1.5rem" : "1rem",
              },
              "--DataGrid-overlayHeight": "50px",
            }}
            hideFooter={isProjector}
            columnHeaderHeight="1vh"
            getRowHeight={() => (isProjector ? "auto" : null)}
            rows={table}
            onRowClick={onRowClick}
            selectionModel={selectionModel}
            onRowSelectionModelChange={onRowSelectionModelChange}
            columns={columns}
            slots={{
              toolbar: mode === "projector" ? null : GridToolbar,
              pagination: CustomPagination,
            }}
            pageSizeOptions={[5, 10, 20, 50]}
            initialState={{
              ...props.table.initialState,
              pagination: { paginationModel: { pageSize: pageSize } },
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
              filterPanel: {
                filterFormProps: {
                  logicOperatorInputProps: {
                    variant: "outlined",
                    size: "small",
                  },
                  columnInputProps: {
                    variant: "outlined",
                    size: "small",
                    sx: { mt: "auto" },
                  },
                  operatorInputProps: {
                    variant: "outlined",
                    size: "small",
                    sx: { mt: "auto" },
                  },
                  valueInputProps: {
                    InputComponentProps: {
                      variant: "outlined",
                      size: "small",
                    },
                  },
                },
              },
            }}
          />
        </Box>
      </LocalizationProvider>
    </Box>
  );
};
export default CustomDataGrid;
