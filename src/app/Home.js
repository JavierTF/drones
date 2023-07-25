"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import CustomizedSnackbars from "./Snackbar";
import FullScreenDialog from "./Dialog";

import {
  Box,
  Button,
  Grid,
  TextField,
  IconButton,
  Checkbox,
  Typography,
  Tooltip,
} from "@mui/material";

import { DataGrid, esES } from "@mui/x-data-grid";

import AppsIcon from "@mui/icons-material/Apps";
import MedicationIcon from "@mui/icons-material/Medication";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

import { enviarDatos, mostrarMensaje } from "../../lib/utiles";

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

export const Home = ({ executed }) => {
  const [openSMS, setOpenSMS] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const [title, setTitle] = useState("Register drone (load medications)");
  const [actionDialog, setActionDialog] = useState("create");

  const [time, setTime] = useState(1);
  const [showTime, setShowTime] = useState();

  const [allRows, setAllRows] = useState([]);
  const [rows, setRows] = useState([]);

  // const [selectedRow, setSelectedRow] = useState([]);

  const [available, setAvailable] = useState(true);

  useEffect(() => {
    // not so many custom functions were used since in most cases such action was executed only once in the test
    (async () => {
      let data = {
        table: "getDrones",
        action: "raw",
      };
      let res = await enviarDatos(data);
      setAllRows(res);
      setRows(res);
    })();

    (async () => {
      setInterval(async () => {
        await localTime();
      }, 5000);
    })();
  }, []);

  const localTime = async () => {
    if (localStorage.getItem("save-logs") == null) {
      localStorage.setItem("save-logs", Date.now());
    } else {
      let t = localStorage.getItem("save-logs");
      let res = Date.now() - t;
      let seconds = Math.floor(res / 1000);
      let data = {
        table: "getTimeToLog",
        action: "raw",
      };

      let delay = await enviarDatos(data);
      delay = parseInt(delay[0].value);
      setShowTime(delay / 1000 - seconds);
      if (seconds >= delay / 1000) {
        await droneLog();
        localStorage.setItem("save-logs", Date.now());
      }
    }
    setTimeout(localTime, 5000);
  };

  const droneLog = async () => {
    mostrarMensaje(setOpenSMS, "Saving logs", 5000, "info");
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
      await enviarDatos(data);
    }
  };

  const create = async () => {
    let data = {
      table: "getDrones",
      action: "raw",
    };
    let res = await enviarDatos(data);
    if (res.length == 10) {
      mostrarMensaje(
        setOpenSMS,
        "The fleet does not accept more drones",
        5000,
        "warning"
      );
    } else {
      setActionDialog("create");
      setTitle("Registering a drone");
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

  // const onRowsSelectionHandler = (ids) => {
  //   const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
  //   setSelectedRow(selectedRowsData);
  // };

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

  const handleChangeTime = (e) => {
    setTime(e.target.value);
  };

  const updateTimeLog = async () => {
    if (time) {
      let data1 = {
        table: "getTimeToLog",
        action: "raw",
      };

      let timeLog = await enviarDatos(data1);
      if (!timeLog?.message) {
        let data = {
          table: "updateTimeToLog",
          action: "raw",
          datos: {
            id: timeLog[0]?.id,
            miliseconds: parseInt(time * 60000),
          },
        };

        let res = await enviarDatos(data);
        if (!res?.message) {
          mostrarMensaje(
            setOpenSMS,
            `Frecuency updated to ${time} minutes`,
            5000,
            "success"
          );
        }
      }
    } else {
      mostrarMensaje(setOpenSMS, "Select frecuency, please", 5000, "error");
    }
  };

  let exec = executed;

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
      <Grid container spacing={1} direction="row">
        <Grid item container sm={12} md={3} xl={2} lg={2}>
          <Link
            href={"/Revision-manual.pdf"}
            target="_blank"
            style={{
              textDecoration: "none",
              color: "green",
            }}
          >
            <Button
              variant={"outlined"}
              startIcon={<FileOpenIcon />}
              color={"primary"}
              component="label"
              sx={{ mb: 1 }}
            >
              Revision´s manual
            </Button>
          </Link>
        </Grid>
        <Grid
          item
          container
          alignItems="center"
          justifyContent="center"
          direction="row"
          spacing={1}
          sm={12}
          md={6}
          xl={8}
          lg={8}
        >
          <Grid item>
            <TextField
              id="frecuency-drone-log"
              label="Frecuency drones log"
              value={time}
              helperText={"Value in minutes"}
              onChange={handleChangeTime}
              size="small"
              color="primary"
              type="number"
              InputProps={{
                inputProps: {
                  max: 0,
                  min: 180000,
                },
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant={"contained"}
              startIcon={<AccessTimeIcon />}
              onClick={updateTimeLog}
              color={"primary"}
              component="label"
              sx={{ mb: 3 }}
            >
              set time
            </Button>
          </Grid>
          <Grid item>
            {showTime && (
              <Typography sx={{ mb: 2.5 }}>{`${showTime} secs`}</Typography>
            )}
          </Grid>
        </Grid>
        <Grid item container sm={12} md={3} xl={2} lg={2} style={{ height: "100%" }}  justifyContent="flex-end">
          <Button
            variant={"contained"}
            startIcon={<AppsIcon />}
            color={"primary"}
            component="label"
            onClick={() => {
              exec = false;
              window.location.reload();
            }}
          >
            Load data
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
          <Tooltip title={"Registering a drone"}>
            <IconButton
              color="primary"
              aria-label="Registering a drone / add medication (without validation)"
              onClick={() => create()}
            >
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={"Loading a drone"}>
            <IconButton
              color="primary"
              aria-label="load medications"
              onClick={() => loading()}
            >
              <SystemUpdateAltIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={"Checking loaded"}>
            <IconButton
              color="primary"
              aria-label="checking medications"
              onClick={() => checking()}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={"Add medication"}>
            <IconButton
              color="primary"
              aria-label="add medications"
              onClick={() => addMedication()}
            >
              <MedicationIcon />
            </IconButton>
          </Tooltip>
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
          // onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
        />
      </Box>
      <CustomizedSnackbars openSMS={openSMS} setOpenSMS={setOpenSMS} />
    </>
  );
};

export default Home;
