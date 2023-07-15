"use client";

import * as React from "react";
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

import CloseIcon from "@mui/icons-material/Close";
import AddDrone from './AddDrone';
import LoadingDrone from "./LoadingDrone";

export default function FullScreenDialog({ open, setOpen, title, actionDialog, dronesList }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog maxWidth={actionDialog === 'create' ? 'lg' : 'sm'} open={open} onClose={handleClose}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {title}
            </Typography>            
          </Toolbar>
        </AppBar>
        <Grid item sm={12}>
          <Grid container spacing={2}>
            {actionDialog === 'create' && <AddDrone dronesList={dronesList} />}
            {actionDialog === 'loading' && <LoadingDrone dronesList={dronesList} />}
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
}
