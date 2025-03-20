import { Snackbar, Alert } from "@mui/material";

export default function NotificationSnackbar({ alert, onClose }) {
  return (
    <Snackbar open={alert.open} autoHideDuration={3000} onClose={onClose}>
      <Alert severity={alert.severity}>{alert.message}</Alert>
    </Snackbar>
  );
}
