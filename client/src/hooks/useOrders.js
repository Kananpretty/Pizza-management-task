import { useState, useEffect, useRef } from "react";
import { fetchOrders } from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

export const useOrders = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reconnectCount, setReconnectCount] = useState(0);
  const ws = useRef(null);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const getInitialOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        setError("Failed to sync orders.");
      } finally {
        setLoading(false);
      }
    };
    getInitialOrders();

    const token = localStorage.getItem("token");
    if (!token) return;

    const socketUrl = `${process.env.REACT_APP_WS_URL}?token=${token}`;
    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => console.log("✅ WS Connected");

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WS Message Received:", data);

        if (
          data.type === "ORDER_CONFIRMED" ||
          data.type === "NEW_ORDER_RECEIVED"
        ) {
          setOrders((prev) => [data.order, ...prev]);
        }

        if (data.message === "order_updated") {
          setOrders((prev) =>
            prev.map((o) => (o._id === data.order._id ? data.order : o))
          );
        }
      } catch (err) {
        console.error("WebSocket Parse Error:", err);
      }
    };

    ws.current.onclose = async (event) => {
      console.log("WS Closed code:", event.code);

      // Handle Auth Failure (Expired Token)
      if (event.code === 4001 || event.code === 1008) {
        try {
          const res = await api.post("/auth/refresh");
          const newToken = res.data.token;
          localStorage.setItem("token", newToken);

          console.log("🔄 Token refreshed. Triggering reconnect...");
          setReconnectCount((prev) => prev + 1);
        } catch (refreshError) {
          logout();
        }
      }
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [user, logout, reconnectCount]);

  return { orders, loading, socket: ws.current, error };
};
