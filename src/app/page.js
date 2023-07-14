"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  Backdrop,
  Box,
  Button,
  Grid,
  CircularProgress,
  LinearProgress,
  TextField,
  Card,
  CardContent,
  Autocomplete,
} from "@mui/material";

import {
  DataGrid,
  esES,
  GridRowModes,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import MedicationIcon from "@mui/icons-material/Medication";

import {
  quitarValoresCero,
  numRom,
  extension,
  enviarDatos,
  buscarUltimo,
  mostrarMensaje,
} from "../../lib/utiles";

// id, serial_number, model, weight_limit, battery_capacity, state

const columns = [
  {
    field: "id",
    headerName: "Id",
    width: 20,
    editable: false,
    hidden: true,
    sortable: false,
  },
  {
    field: "serial_number",
    headerName: "Serial number",
    width: 150,
    editable: false,
    sortable: false,
  },
  {
    field: "model",
    headerName: "Model",
    width: 120,
    editable: false,
    sortable: false,
  },
  {
    field: "weight_limit",
    headerName: "Weight limit",
    width: 120,
    editable: false,
    sortable: false,
  },
  {
    field: "battery_capacity",
    headerName: "Battery capacity",
    width: 140,
    editable: false,
    sortable: false,
  },
  {
    field: "state",
    headerName: "State",
    width: 120,
    editable: false,
    sortable: false,
  },
  {
    field: "medication",
    headerName: "Medication",
    width: 650,
    editable: false,
    sortable: false,
  },
];

const columnVisibilityModel = {
  id: false,
};

const Home = () => {
  const pathname = usePathname();

  const [rows, setRows] = useState([]);

  const [model, setModel] = useState([]);
  const [valueModel, setValueModel] = useState("");
  const [inputValueModel, setInputValueModel] = useState("");

  const [state, setState] = useState([]);
  const [valueState, setValueState] = useState("");
  const [inputValueState, setInputValueState] = useState("");

  useEffect(() => {
    (async () => {
      let data = {
        table: "model",
        action: "findMany",
      };
      let res = await enviarDatos(data);
      setModel(res);
    })();
    (async () => {
      let data = {
        table: "state",
        action: "findMany",
      };
      let res = await enviarDatos(data);
      setState(res);
    })();
    (async () => {
      let data = {
        table: "getDrones",
        action: "raw",
        datos: {
          model_id: null,
          state_id: null,
        },
      };
      let res = await enviarDatos(data);
      console.log('---Drones', res);
      setRows(res);
    })();
  }, []);

  return (
    <>
      <Grid
        container
        spacing={1}
        direction="row"
        //alignItems="center"
        //justifyContent="center"
      >
        <Grid item container sm={12} md={3} xl={2} lg={2}>
          <Button
            disabled={false}
            variant={pathname === "/medication" ? "outlined" : "contained"}
            startIcon={<LocalAirportIcon />}
            color={"primary"}
            component="label"
            sx={{ mb: 1 }}
          >
            Drone
          </Button>
          <Button
            disabled={false}
            variant={
              pathname === "/" || pathname === "/drone"
                ? "outlined"
                : "contained"
            }
            startIcon={<MedicationIcon />}
            color={"primary"}
            component="label"
          >
            Medication
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item sm={12} md={9} xl={3} lg={3}>
          <Autocomplete
            fullWidth
            value={valueModel || null}
            onChange={(_event, newValue2) => {
              setValueModel(newValue2);
            }}
            inputValue={inputValueModel}
            onInputChange={(_event, newInputValue2) => {
              setInputValueModel(newInputValue2);
            }}
            id="model"
            options={model}
            autoHighlight
            getOptionLabel={
              (option) => `${option.name}` // ${option.version} / ${option.anno}
            }
            style={{ height: 40 }}
            size={"small"}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                variant="outlined"
                fullWidth
                label="Search drone by model"
                size={"small"}
                focused
                key="model-autocomplete"

              />
            )}
          />
        </Grid>
        <Grid item sm={12} md={9} xl={3} lg={3}>
          <Autocomplete
            fullWidth
            value={valueState || null}
            onChange={(_event, newValue2) => {
              setValueState(newValue2);
            }}
            inputValue={inputValueState}
            onInputChange={(_event, newInputValue2) => {
              setInputValueState(newInputValue2);
            }}
            id="state"
            options={state}
            autoHighlight
            getOptionLabel={(option) => `${option.name}`}
            style={{ height: 40 }}
            size={"small"}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                variant="outlined"
                fullWidth
                label="Search drone by state"
                size={"small"}
                focused
                key="state-autocomplete"

              />
            )}
          />
        </Grid>
      </Grid>
      <Box sx={{ height: 400, width: "100%", mt: 3 }}>
        <DataGrid
          density="compact"
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={rows}
          columns={columns}
          columnVisibilityModel={columnVisibilityModel}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[25]}
          disableMultipleRowSelection={true}
          getRowHeight={() => "auto"}
          // slots={{
          //   pagination: CustomPagination,
          // }}
          // editMode={enTiempo && puedeEditar && "row"}
          // rowModesModel={rowModesModel}
          // onRowModesModelChange={handleRowModesModelChange}
          // onRowEditStart={handleRowEditStart}
          // onRowEditStop={handleRowEditStop}
          // processRowUpdate={item?.id == norma?.id && processRowUpdate}
          // slotProps={{
          //   toolbar: { setRows, setRowModesModel },
          // }}
        />
      </Box>
    </>
  );
};

export default Home;
