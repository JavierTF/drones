"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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

import AppsIcon from "@mui/icons-material/Apps";
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

  const [time, setTime] = useState();
  const [delay, setDelay] = useState();
  const [interval, setInterval] = useState();

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

  useEffect(() => {
    const fetchData = async () => {
      let data = {
        table: "getTimeToLog",
        action: "raw",
      };

      let delay = await enviarDatos(data);
      delay = parseInt(delay[0].value);
      console.log("DELAY", delay);

      const intervalID = setInterval(() => {
        droneLog();
      }, delay);

      setTime(delay);

      return () => {
        clearInterval(intervalID); // Limpia el intervalo cuando el componente se desmonte
      };
    };

    fetchData();
  }, [interval]);

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

  const addMedication = () => {
    // we can check this in the list
    // i used the same component that loads medicines, I just put the button and the autocomplete disable el.state != "IDLE" || el.state == "DELIVERED" || el.state == "RETURNING"
    setActionDialog("addMedication");
    setTitle("Adding medications JSON input");
    setOpenDialog(true);
  };

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    setSelectedRow(selectedRowsData);
  };

  const handleChangeAvailable = () => {
    setAvailable(() => !available);
    available
      ? setRows(
          rows.filter(
            (el) =>
              el.battery_capacity >= 25 &&
              (el.state === "IDLE" || el.state === "LOADING")
          )
        )
      : setRows(allRows);
  };

  // un minuto son 60000 milisegundos por tanto minutos * 60000 da intervalo de tiempo

  const droneLog = async () => {
    console.log("TIME", time);
    if (time) {
      for (let elem of allRows) {
        let data = {
          table: "drone_log",
          action: "create",
          datos: {
            drone_id: elem.id,
            battery_log: elem.battery_capacity,
            update: new Date(),
          },
        };
        let res = await enviarDatos(data);
      }
    }
  };

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
            variant={"contained"}
            startIcon={<AppsIcon />}
            color={"primary"}
            component="label"
            sx={{ mb: 1 }}
          >
            Load data
          </Button>
        </Grid>
        {/* <Grid
          item
          container
          alignItems="center"
          justifyContent="center"
          direction="column"
          sm={12}
          md={3}
          xl={8}
          lg={8}
        >
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {`Last drone log ${time}`}
          </Typography>
        </Grid> */}
      </Grid>
      <Grid
        container
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item sm={12} md={9} xl={3} lg={3}>
          <Grid container direction="row" alignItems="center">
            <Checkbox
              id="available"
              name="checking-available-drones-for-loading"
              checked={!available}
              onChange={handleChangeAvailable}
              sx={{ justifyContent: "flex-start" }}
            />
            <Typography>Checking available drones for loading</Typography>
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
          <IconButton
            color="primary"
            aria-label="add medications"
            onClick={() => addMedication()}
          >
            <MedicationIcon />
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
        />
      </Box>
      <CustomizedSnackbars openSMS={openSMS} setOpenSMS={setOpenSMS} />
    </>
  );
};

export default Home;
