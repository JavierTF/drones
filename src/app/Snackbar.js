'use client'

import * as React from "react";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars({ openSMS, setOpenSMS }) {

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSMS({ open: false });
  };

  const vertical = "bottom";
  const horizontal = "right";

  return (
    <Snackbar
      open={openSMS.open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert onClose={handleClose} variant="filled" severity={openSMS?.typeSMS}>
        {openSMS?.sms}
      </Alert>
    </Snackbar>
  );
}
