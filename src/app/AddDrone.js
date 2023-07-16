"use client";

import React, { useState, useEffect } from "react";
import CustomizedSnackbars from "./Snackbar";

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
  quitarValoresCero,
  numRom,
  extension,
  enviarDatos,
  buscarUltimo,
  mostrarMensaje,
  validateSerialNumber,
  validateRange,
} from "../../lib/utiles";

function Drone(serial_number, model, weight_limit, battery_capacity, state) {
  this.serial_number = serial_number;
  this.model = setM(model);
  this.weight_limit = weight_limit;
  this.battery_capacity = battery_capacity;
  this.state = setS(state);

  function setM(model) {
    if (model === "Lightweight") {
      return 1;
    } else if (model === "Middleweight") {
      return 2;
    } else if (model === "Cruiserweight") {
      return 3;
    } else if (model === "Heavyweight") {
      return 4;
    } else {
      return null;
    }
  }

  function setS(state) {
    if (state === "IDLE") {
      return 1;
    } else if (state === "LOADING") {
      return 2;
    } else if (state === "LOADED") {
      return 3;
    } else if (state === "DELIVERING") {
      return 4;
    } else if (state === "DELIVERED") {
      return 5;
    } else if (state === "RETURNING") {
      return 6;
    } else {
      return null;
    }
  }
}

function Medication(name, weight, code, image) {
  this.name = name;
  this.weight = weight;
  this.code = code;
  this.image = image;
}

export default function AddDrone({ dronesList }) {
  const [openSMS, setOpenSMS] = useState({});
  const [object, setObject] = useState();

  const [serialNumber, setSerialNumber] = useState("");
  const [weightLimit, setWeightLimit] = useState("");
  const [batteryCapacity, setBatteryCapacity] = useState("");

  const [model, setModel] = useState([]);
  const [valueModel, setValueModel] = useState("");
  const [inputValueModel, setInputValueModel] = useState("");

  const [state, setState] = useState([]);
  const [valueState, setValueState] = useState("");
  const [inputValueState, setInputValueState] = useState("");

  const [medication, setMedication] = useState([]);

  const [serials, setSerials] = useState([]);
  //   const [valueMedication, setValueMedication] = useState("");
  //   const [inputValueMedication, setInputValueMedication] = useState("");

  const fixedOptions = [];
  const [v, setV] = React.useState([...fixedOptions]);

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
        table: "medication",
        action: "findMany",
      };
      let res = await enviarDatos(data);
      setMedication(res);
    })();
  }, []);

  const handleChangeSerialNumber = (e) => {
    setSerialNumber(e.target.value);
  };

  const handleChangeWeightLimit = (e) => {
    setWeightLimit(e.target.value);
  };

  const handleChangeBatteryCapacity = (e) => {
    setBatteryCapacity(e.target.value);
  };

  const createObj = async () => {
    if (
      !serialNumber ||
      !valueModel ||
      !weightLimit ||
      !batteryCapacity ||
      !valueState
    ) {
      mostrarMensaje(setOpenSMS, "Complete all required fields", 5000, "error");
    } else {
      const serials = dronesList.map((el) => el.serial_number);
      if (!validateSerialNumber(serialNumber, serials))
        mostrarMensaje(
          setOpenSMS,
          "Serial number is empty or length greater than 100 or already exist",
          5000,
          "error"
        );

      if (!validateRange(batteryCapacity, 100))
        mostrarMensaje(
          setOpenSMS,
          "Battery capacity must be greater than 0 and less or equal to 100",
          5000,
          "error"
        );

      if (!validateRange(weightLimit, 500))
        mostrarMensaje(
          setOpenSMS,
          "Weight limit must be greater than 0 and less or equal to 500",
          5000,
          "error"
        );

      let data = {
        table: "drone",
        action: "findMany",
        datos: {
          where: {
            serial_number: `${serialNumber}`,
          },
        },
      };
      let res = await enviarDatos(data);
      if (res?.message || res.length > 0) {
        mostrarMensaje(
          setOpenSMS,
          "There is already a drone with that serial number",
          5000,
          "error"
        );
      }

      if (
        validateSerialNumber(serialNumber, serials) &&
        validateRange(batteryCapacity, 100) &&
        validateRange(weightLimit, 500)
      ) {
        const obj = new Drone(
          serialNumber,
          valueModel.name,
          parseInt(weightLimit),
          parseInt(batteryCapacity),
          valueState.name
          // v
        );
        let data = {
          table: "drone",
          action: "create",
          datos: { ...obj },
        };
        let res = await enviarDatos(data);
        if (res && !res?.message) {
          let idsMedications = v.map((el) => el.id);
          for (let elem of idsMedications) {
            let data = {
              table: "drone_medication",
              action: "create",
              datos: { 
                drone_id: res.id,
                medication_id: parseInt(elem),
                timelog: new Date()
              },
            };
            let sended = await enviarDatos(data);
            mostrarMensaje(
              setOpenSMS,
              `Drone ${sended[0].serial_number} created successfully`,
              5000,
              "error"
            );
          }
        }
        
      }
    }
  };

  return (
    <>
      <Box sx={{ height: "auto", padding: 4 }}>
        <Stack direction={"row"} sx={{ mt: "20px", mx: "auto" }} spacing={3}>
          <TextField
            id="serial-number"
            value={serialNumber}
            onChange={handleChangeSerialNumber}
            label="Serial number"
            required
            variant="standard"
            sx={{ width: "730px" }}
          />
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
                variant="standard"
                fullWidth
                label="Select model"
                size={"small"}
                // focused
                key="model-autocomplete"
              />
            )}
          />
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
                variant="standard"
                fullWidth
                label="Select state"
                size={"small"}
                // focused
                key="state-autocomplete"
              />
            )}
          />
        </Stack>
        <Stack direction={"row"} sx={{ mt: "20px", mx: "auto" }} spacing={3}>
          <TextField
            id="weight-limit"
            value={weightLimit}
            onChange={handleChangeWeightLimit}
            label="Weight limit"
            required
            type="number"
            variant="standard"
            sx={{ width: "100px" }}
            InputProps={{
              inputProps: {
                max: 0,
                min: 500,
              },
            }}
          />
          <TextField
            id="battery-capacity"
            value={batteryCapacity}
            onChange={handleChangeBatteryCapacity}
            label="Battery capacity"
            required
            type="number"
            variant="standard"
            sx={{ width: "140px" }}
            InputProps={{
              inputProps: {
                max: 0,
                min: 100,
              },
            }}
          />
          <Autocomplete
            multiple
            value={v}
            onChange={(event, newValue) => {
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
        <Button
          variant="contained"
          color={"primary"}
          component="label"
          sx={{ mb: 1 }}
          onClick={() => createObj()}
        >
          Save
        </Button>
      </Grid>
      <CustomizedSnackbars openSMS={openSMS} setOpenSMS={setOpenSMS} />
    </>
  );
}
