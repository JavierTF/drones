// the error property in the form fields could be better validated

import {
  Box,
  Grid,
  Stack,
  Typography
} from "@mui/material";

export default function LoadingData() {
  return (
    <>
      <Box sx={{ height: "auto", padding: 4, overflow: "auto" }}>
        <Stack direction={"row"} sx={{ mt: "20px", mx: "auto" }} spacing={3}>
          <Grid item>
            <Grid container sx={{ mt: 1 }} direction={"row"}>
              <Typography sx={{ mb: 2.5 }}>Describir cómo cargar datos</Typography>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </>
  );
}