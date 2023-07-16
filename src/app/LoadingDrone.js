"use client";

import React, { useState, useEffect } from "react";
import CustomizedSnackbars from "./Snackbar";

import {
  Backdrop,
  Box,
  Button,
  Grid,
  CircularProgress,
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
  Tooltip
} from "@mui/material";

import {
  quitarValoresCero,
  numRom,
  extension,
  enviarDatos,
  buscarUltimo,
  mostrarMensaje,
  validateSerialNumber,
  validateRange,
} from "../../lib/utiles";

import BatteryAlertIcon from "@mui/icons-material/BatteryAlert";
import BatterySaverIcon from "@mui/icons-material/BatterySaver";

export default function LoadingDrone({ dronesList, actionDialog }) {
  const [openSMS, setOpenSMS] = useState({});
  const [progress, setProgress] = useState(1);
  const [colorProgress, setColorProgress] = useState("success");

  const [drone, setDrone] = useState(dronesList);
  const [valueDrone, setValueDrone] = useState("");
  const [inputValueDrone, setInputValueDrone] = useState("");

  const [medication, setMedication] = useState([]);

  const fixedOptions = [];
  const [v, setV] = React.useState([...fixedOptions]);

  useEffect(() => {
    let res;
    if (actionDialog === "loading") {
      res = dronesList.filter(
        (el) => el.state == "IDLE" || el.state == "LOADING"
      );
    } else {
      res = dronesList.filter(
        (el) =>
          el.state != "IDLE" ||
          el.state == "DELIVERED" ||
          el.state == "RETURNING"
      );
    }
    setDrone(res);
    (async () => {
      let data = {
        table: "medication",
        action: "findMany",
      };
      let med = await enviarDatos(data);
      setMedication(med);
    })();
  }, []);

  const loadMedications = async () => {
    try {
      if (typeof valueDrone !== "null" && valueDrone) {
        let idsMedications = v.map((el) => el.id);
        if (valueDrone.battery_capacity < 25) {
          mostrarMensaje(
            setOpenSMS,
            "Can't load medications. Please, recharge this drone",
            5000,
            "error"
          );
        } else {
          let sql = {
            table: "deleteMedicationByDrone",
            action: "raw",
            datos: {
              drone_id: valueDrone?.id,
            },
          };
          await enviarDatos(sql);
          for (let elem of idsMedications) {
            let data = {
              table: "drone_medication",
              action: "create",
              datos: {
                drone_id: valueDrone.id,
                medication_id: parseInt(elem),
                timelog: new Date(),
              },
            };
            await enviarDatos(data);
          }
          mostrarMensaje(
            setOpenSMS,
            "Medication(s) loaded successfully",
            5000,
            "success"
          );
        }
      } else {
        mostrarMensaje(setOpenSMS, "An error ocurred", 5000, "error");
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const load = async (newValue2) => {
    setValueDrone(newValue2);
    let data = {
      table: "getMedicationByDrone",
      action: "raw",
      datos: {
        drone_id: newValue2?.id,
      },
    };
    const med = await enviarDatos(data);
    if (!med?.message) {
      setV(med);
    }
  };

  const calculateProgress = () => {
    let suma = 0;
    suma = v.map((el) => (suma += parseFloat(el.weight)));
    let val =
      v.length === 0 ? 0.05 : suma / parseFloat(valueDrone.weight_limit);
    console.log("VALOR", val);
    setProgress(val * 100);
    if (val >= 0.8) setColorProgress("error");
    if (val >= 0.5 && val < 0.8) setColorProgress("warning");
    if (val >= 0.2 && val < 0.5) setColorProgress("secondary");
    if (val >= 0 && val < 0.2) setColorProgress("success");
  };

  const showBatteryCapacity = () => {
    mostrarMensaje(
      setOpenSMS,
      `Battery on ${valueDrone.battery_capacity}%`,
      5000,
      valueDrone.battery_capacity < 25 ? "warning" : "info"
    );
  }

  return (
    <>
      <Box sx={{ height: "auto", padding: 4, overflow: "auto" }}>
        <Stack direction={"row"} sx={{ mt: "20px", mx: "auto" }} spacing={3}>
          <Grid item>
            <Grid container sx={{ mt: 1 }} direction={"row"}>
              {typeof valueDrone === "null" || !valueDrone ? (
                <IconButton
                  aria-label="delete drone"
                  sx={{ visibility: "hidden", mr: 2, mt: 1 }}
                >
                  <BatteryAlertIcon />
                </IconButton>
              ) : (
                <Tooltip title={`Battery on ${valueDrone.battery_capacity}%`}>
                  <IconButton
                    color={
                      valueDrone.battery_capacity < 25 ? "error" : "success"
                    }
                    aria-label="delete drone"
                    sx={{ mr: 2, mt: 1 }}
                    onClick={() => showBatteryCapacity()}
                  >
                    {valueDrone.battery_capacity < 25 ? (<BatteryAlertIcon />) : (<BatterySaverIcon />)}
                  </IconButton>
                </Tooltip>
              )}
              <Autocomplete
                value={valueDrone || null}
                onChange={async (_event, newValue2) => {
                  await load(newValue2);
                }}
                inputValue={inputValueDrone}
                onInputChange={(_event, newInputValue2) => {
                  setInputValueDrone(newInputValue2);
                }}
                id="drone"
                options={drone}
                autoHighlight
                getOptionLabel={(option) => `${option.serial_number}`}
                style={{ height: 40 }}
                size={"small"}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    variant="standard"
                    fullWidth
                    label="Select drone"
                    size={"small"}
                    sx={{ width: "400px" }}
                    key="drone-autocomplete"
                  />
                )}
              />
              <CircularProgress
                color={colorProgress}
                variant="determinate"
                value={progress}
                sx={{ ml: 4 }}
              />
            </Grid>
          </Grid>
        </Stack>
        <Stack direction={"row"} sx={{ mt: "20px", mx: "auto" }} spacing={3}>
          <Autocomplete
            readOnly={actionDialog === "checking"}
            disabled={
              !valueDrone ||
              typeof valueDrone === "null" ||
              valueDrone.battery_capacity < 25
                ? true
                : false
            }
            multiple
            value={v}
            onChange={(event, newValue) => {
              calculateProgress();
              setV([
                ...fixedOptions,
                ...newValue.filter(
                  (option) => fixedOptions.indexOf(option) === -1
                ),
              ]);
            }}
            id="medication"
            options={medication}
            getOptionLabel={(option) => option.name}
            style={{ width: 840 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select medication(s)"
                variant="standard"
                sx={{ width: "550px" }}
              />
            )}
            // renderOption={(v, option) => {
            //   return (
            //     <li {...v} key={option}>
            //       {option}
            //     </li>
            //   );
            // }}
            // renderTags={(name, getTagProps) => {
            //   return name.map((option, index) => (
            //     <Chip {...getTagProps({ index })} key={option} label={option} />
            //   ));
            // }}
          />
        </Stack>
      </Box>
      <Grid container justifyContent="flex-end" sx={{ mx: 7, mb: 2 }}>
        {actionDialog !== "checking" && <Button
          disabled={v.length == 0}
          variant="contained"
          color={"primary"}
          component="label"
          sx={{ mb: 1 }}
          onClick={() => loadMedications()}
        >
          Save
        </Button>}
      </Grid>
      <CustomizedSnackbars openSMS={openSMS} setOpenSMS={setOpenSMS} />
    </>
  );
}
