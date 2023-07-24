"use client";

// the error property in the form fields could be better validated

import React, { useState, useEffect } from "react";
import CustomizedSnackbars from "./Snackbar";

import {
  Box,
  Button,
  Grid,
  CircularProgress,
  TextField,
  Autocomplete,
  IconButton,
  Stack,
  Tooltip,
  
} from "@mui/material";

import {
  enviarDatos,
  mostrarMensaje,
  addWeights,
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

  const [tooHeavy, setTooHeavy] = useState(false);

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
    return med;
  };

  const totalWeight = (updatedV, suma) => {
    return updatedV.length === 0
      ? 0.05
      : suma / parseFloat(valueDrone.weight_limit);
  };

  const calculateProgress = (updatedV) => {
    try {
      let suma = 0;
      if (updatedV.length !== 0) {
        suma = addWeights(updatedV);
        let total = totalWeight(updatedV, suma);
        if (total <= 1) {
          setTooHeavy(false);
          setProgress(total * 100);
          if (total >= 0.7 && total < 0.8) {
            setColorProgress("warning");
          } else if (total >= 0.3 && total < 0.7) {
            setColorProgress("secondary");
          } else if (total >= 0 && total < 0.3) {
            setColorProgress("success");
          } else {
            throw new Error("Invalid total value");
          }
        } else {
          setTooHeavy(true);
          setProgress(total * 100);
          setColorProgress("error");
          mostrarMensaje(
            setOpenSMS,
            "The load is too heavy for this drone",
            5000,
            "error"
          );
        }
      }
    } catch (error) {
      console.log("An error ocurred", error.message);
    }
  };

  const showBatteryCapacity = () => {
    mostrarMensaje(
      setOpenSMS,
      `Battery on ${valueDrone.battery_capacity}%`,
      5000,
      valueDrone.battery_capacity < 25 ? "warning" : "info"
    );
  };

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
                    {valueDrone.battery_capacity < 25 ? (
                      <BatteryAlertIcon />
                    ) : (
                      <BatterySaverIcon />
                    )}
                  </IconButton>
                </Tooltip>
              )}
              <Autocomplete
                value={valueDrone || null}
                onChange={async (_event, newValue2) => {
                  let med = await load(newValue2);
                  calculateProgress(med);
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
              setV((prevV) => {
                const updatedV = [
                  ...fixedOptions,
                  ...newValue.filter(
                    (option) => fixedOptions.indexOf(option) === -1
                  ),
                ];
                calculateProgress(updatedV); // Pasar el valor actualizado a calculateProgress
                return updatedV;
              });
            }}
            id="medication"
            options={medication}
            getOptionLabel={(option) => option.name}
            style={{ width: 840 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select medication(s)"
                error={tooHeavy}
                variant="standard"
                sx={{ width: "550px" }}
              />
            )}
          />
        </Stack>
      </Box>
      <Grid container justifyContent="flex-end" sx={{ mx: 7, mb: 2 }}>
        {actionDialog !== "checking" && (
          <Button
            disabled={v.length == 0 || tooHeavy}
            variant="contained"
            color={"primary"}
            component="label"
            sx={{ mb: 1 }}
            onClick={() => loadMedications()}
          >
            Save
          </Button>
        )}
      </Grid>
      <CustomizedSnackbars openSMS={openSMS} setOpenSMS={setOpenSMS} />
    </>
  );
}