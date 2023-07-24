"use client";

import * as React from "react";
import {
  Grid,
  IconButton,
  AppBar,
  Dialog,
  Toolbar,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddDrone from './AddDrone';
import LoadingDrone from "./LoadingDrone";
import AddMedication from "./AddMedication";

export default function FullScreenDialog({ open, setOpen, title, actionDialog, dronesList }) {
  const handleClose = () => {
    window.location.reload();
  };

  return (
    <div>
      <Dialog maxWidth={(actionDialog === 'create' || actionDialog === 'addMedication') ? 'lg' : 'sm'} open={open} onClose={handleClose} sx={{ height: "auto", padding: 4, overflow: "auto" }}>
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
            {(actionDialog === 'loading' || actionDialog === 'checking') && <LoadingDrone dronesList={dronesList} actionDialog={actionDialog} />}
            {actionDialog === 'addMedication' && <AddMedication />}
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
}