import {
  Box,
  Typography,
  CircularProgress,
  Pagination,
} from "@mui/material";

import { useEffect, useState } from "react";

import NotificationFilter from "../components/NotificationFilter";
import NotificationCard from "../components/NotificationCard";

import useNotifications from "../hooks/useNotifications";

export default function NotificationsPage() {
  const {
    notifications,
    loading,
    error,
    loadNotifications,
    setNotifications,
  } = useNotifications();

  const [page, setPage] = useState(1);
  const [type, setType] = useState("");

  useEffect(() => {
    loadNotifications(page, 10, type);
  }, [page, type]);

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.ID === id
          ? {
              ...item,
              read: !item.read,
            }
          : item
      )
    );
  };

  if (loading)
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error">
        {error}
      </Typography>
    );

  return (
    <Box sx={{ p: 4 }}>

      <Typography
        variant="h4"
        mb={3}
      >
        All Notifications
      </Typography>

      <NotificationFilter
        value={type}
        onChange={(value) => {
          setPage(1);
          setType(value);
        }}
      />

      {notifications.map((notification) => (
        <NotificationCard
          key={notification.ID}
          notification={notification}
          onClick={() => toggleRead(notification.ID)}
        />
      ))}

      <Pagination
        page={page}
        count={10}
        onChange={(e, value) => setPage(value)}
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center",
        }}
      />

    </Box>
  );
}