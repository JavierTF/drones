"use client";

import React, { useState } from "react";
import CustomizedSnackbars from "./Snackbar";

import {
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
  validateString,
} from "../../lib/utiles";

export default function AddMedication() {
  const [openSMS, setOpenSMS] = useState({});

  const [medication, setMedication] = useState([]);

  const handleChangeMedication = async (e) => {
    setMedication(e.target.value);
  };

  const createMedication = async () => {
    if (medication) {
      try {
        let j = JSON.parse(medication);
        console.log("JJJ", j);
        if (Array.isArray(j)) {
          let valid = true;
          for (let elem of j) {
            if (!validateString(elem.name.toString(), /^[a-zA-Z0-9\-_]+$/)) {
              mostrarMensaje(
                setOpenSMS,
                `Invalid medication's name ${elem.name}, just letters, numbers, hyphens, and underscores`,
                5000,
                "error"
              );
              valid = false;
              break;
            }

            if (!validateString(elem.code.toString(), /^[A-Z0-9_]+$/)) {
              mostrarMensaje(
                setOpenSMS,
                `Invalid medication's code ${elem.code}, just uppercase letters, numbers, and underscores`,
                5000,
                "error"
              );
              valid = false;
              break;
            }
          }

          if (valid) {
            for (let elem of j) {
              console.log('IMAGEN', elem.image);
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
            mostrarMensaje(setOpenSMS, "Medication saved in database", 5000, "success");
          }
        } else {
          mostrarMensaje(
            setOpenSMS,
            "Invalid JSON format, should be an array",
            5000,
            "error"
          );
        }
      } catch (error) {
        if (error.name === 'TypeError'){
          mostrarMensaje(setOpenSMS, "Invalid JSON format", 5000, "error");
        }
        console.log("An error occurred", error.message);
      }
    }
  };

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
