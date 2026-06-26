import { useEffect, useState } from "react";
import { fetchNotifications } from "../api/notifications";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadNotifications = async (
    page = 1,
    limit = 10,
    notificationType = ""
  ) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchNotifications({
        page,
        limit,
        notificationType,
      });

      const list = (data.notifications || []).map((n) => ({
        ...n,
        read: false,
      }));

      setNotifications(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    loadNotifications,
    setNotifications,
  };
}