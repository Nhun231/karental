import { Grid } from "@mui/joy";
import { Box, Typography, Stack, Divider } from "@mui/material";
import DocumentBookingEdit from "./DocumentBookingEdit";
import { useDispatch, useSelector } from "react-redux";


export const EditBookingCar = () => {

  return (
    <Box>

      <Divider sx={{ p: 2 }} />

      <Grid container item xs={12} sx={{ p: 4 }}>
        <Grid item xs={8}>
          <Stack direction="column" alignItems="left">
            <Typography
              sx={{ color: "#767676", fontSize: "16px", fontWeight: "bold" }}
            >
              Vehicle Registration Documents
            </Typography>
            <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
              <DocumentBookingEdit/>
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
