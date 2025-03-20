import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DatePickerInput({ label, value, onChange }) {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      slotProps={{
        textField: {
          fullWidth: true,
          variant: "standard",
          required: true,
          sx: {
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          },
        },
      }}
    />
  );
}
