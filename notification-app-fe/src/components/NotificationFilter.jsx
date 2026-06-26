import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export default function NotificationFilter({
  value,
  onChange,
}) {
  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel>Notification Type</InputLabel>

      <Select
        value={value}
        label="Notification Type"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Placement">Placement</MenuItem>
        <MenuItem value="Result">Result</MenuItem>
        <MenuItem value="Event">Event</MenuItem>
      </Select>
    </FormControl>
  );
}