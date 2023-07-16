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
  Tooltip,
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

export default function AddMedication() {
  const [openSMS, setOpenSMS] = useState({});

  const [medication, setMedication] = useState([]);

  const handleChangeMedication = async (e) => {
    setMedication(e.target.value);
    if (e.target.value) {
      try {
        let j = JSON.parse(e.target.value);
        console.log("JSON.parse", j);
        mostrarMensaje(setOpenSMS, "Is valid", 5000, "info");
      } catch (error) {
        console.log("An error ocurred", error.message);
        mostrarMensaje(setOpenSMS, "Invalid JSON format", 5000, "error");
      }
    }
  };

  const createMedication = async () => {
    for (let elem of medication){
      let data = {
        table: "medication",
        action: "create",
        datos: {
          name: elem.name,
          weight: elem.weight,
          code: elem.code,
          image: elem.image,
        },
      };
      await enviarDatos(data);
    }
  }

  return (
    <>
      <Box sx={{ height: "auto", padding: 4, overflow: "auto" }}>
        <Stack direction={"row"} sx={{ mt: "20px", mx: "auto" }} spacing={3}>
          <Grid item>
            <Grid container sx={{ mt: 1 }} direction={"row"}>
              <TextField
                id="medication-json"
                value={medication}
                onChange={handleChangeMedication}
                label="Medication"
                helperText={"Paste medications (JSON format required)"}
                multiline
                rows={4}
                variant="standard"
                sx={{ width: "600px", mx: "auto" }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Box>
      <Grid container justifyContent="flex-end" sx={{ mx: 7, mb: 2 }}>
        <Button
          disabled={!medication}
          variant="contained"
          color={"primary"}
          component="label"
          sx={{ mb: 1 }}
          onClick={() => createMedication()}
        >
          Save
        </Button>
      </Grid>
      <CustomizedSnackbars openSMS={openSMS} setOpenSMS={setOpenSMS} />
    </>
  );
}
