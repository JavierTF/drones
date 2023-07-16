"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import CustomizedSnackbars from "./Snackbar";
import FullScreenDialog from "./Dialog";

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
  IconButton,
  AppBar,
  Checkbox,
  Dialog,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  DataGrid,
  esES,
  GridRowModes,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import MedicationIcon from "@mui/icons-material/Medication";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

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
    valueGetter: (params) => {
      return `${params.value}%`;
    },
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
  const [openSMS, setOpenSMS] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  // const [open, setOpen] = useState(true);
  const [title, setTitle] = useState("Register drone (load medications)");
  const [actionDialog, setActionDialog] = useState("create");

  const pathname = usePathname();

  const [allRows, setAllRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  const [available, setAvailable] = useState();

  useEffect(() => {
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
      setAllRows(res);
      setRows(res);
    })();
  }, []);

  const create = () => {
    if (rows.length === 10) {
      mostrarMensaje(
        setOpenSMS,
        "The fleet does not accept more drones",
        5000,
        "warning"
      );
    } else {
      setOpenDialog(true);
    }
  };

  const loading = () => {
    setActionDialog("loading");
    setTitle("Loading a drone with medication items");
    setOpenDialog(true);
  };

  const checking = () => {
    // we can check this in the list
    // i used the same component that loads medicines, I just put the button and the autocomplete disable el.state != "IDLE" || el.state == "DELIVERED" || el.state == "RETURNING"
    setActionDialog("checking");
    setTitle("Checking loaded medication items for a given drone");
    setOpenDialog(true);
  };

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    setSelectedRow(selectedRowsData);
  };

  const handleChangeAvailable = () => {
    setAvailable(() => !available);
    available ? setRows(rows.filter(el => el.battery_capacity >= 25 && (el.state === 'IDLE' || el.state === 'LOADING'))) : setRows(allRows);
  }

  return (
    <>
      {/* sorry for the prop driling ha ha, to avoid this i could use a context  */}
      {openDialog && (
        <FullScreenDialog
          open={openDialog}
          setOpen={setOpenDialog}
          title={title}
          actionDialog={actionDialog}
          dronesList={rows}
        />
      )}
      <Grid
        container
        spacing={1}
        direction="row"
        //alignItems="center"
        //justifyContent="center"
      >
        <Grid item container sm={12} md={3} xl={2} lg={2}>
          <Button
            variant={pathname === "/medication" ? "outlined" : "contained"}
            startIcon={<LocalAirportIcon />}
            color={"primary"}
            component="label"
            sx={{ mb: 1 }}
          >
            Drone
          </Button>
          <Button
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
          <Grid item>
            <Grid container sx={{ mt: 1 }} direction={"row"}>
              <Checkbox
                id="available"
                name={"checking-available-drones-for-loading"}
                checked={!available}
                onChange={handleChangeAvailable}
                sx={{ width: "100px", justifyContent: "left" }}
              />
              <Typography
                sx={{ width: "800px", mt: 1, justifyContent: "left" }}
              >
                Checking available drones for loading
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12} md={3} xl={2} lg={2}>
          <IconButton
            color="primary"
            aria-label="add medication to drone"
            onClick={() => create()}
          >
            <AddCircleIcon />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="load medications"
            onClick={() => loading()}
          >
            <SystemUpdateAltIcon />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="checking medications"
            onClick={() => checking()}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton color="primary" aria-label="delete drone">
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Box sx={{ height: 500, width: "100%", mt: 3 }}>
        <DataGrid
          density="compact"
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={rows}
          columns={columns}
          columnVisibilityModel={columnVisibilityModel}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
          }}
          pageSizeOptions={[25]}
          disableMultipleRowSelection={true}
          getRowHeight={() => "auto"}
          onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
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
      <CustomizedSnackbars openSMS={openSMS} setOpenSMS={setOpenSMS} />
    </>
  );
};

export default Home;
