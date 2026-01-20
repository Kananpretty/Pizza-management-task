import { useState, useEffect, useRef } from "react";

const getUrl = (type) => {
  const isProduction = window.location.hostname !== "localhost";

  // In production (Render), your server URL will be something like your-app.onrender.com
  // If your React app and Server are on different domains, replace 'window.location.host'
  // with your actual Render backend URL string.
  const host = isProduction
    ? "your-pizza-server.onrender.com"
    : "localhost:5000";
  const protocol =
    type === "socket"
      ? isProduction
        ? "wss://"
        : "ws://"
      : isProduction
      ? "https://"
      : "http://";

  return `${protocol}${host}`;
};

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const ws = useRef(null);

  useEffect(() => {
    // 1. Initial HTTP Fetch
    const getInitialOrders = async () => {
      const apiUrl = getUrl("API");
      try {
        const response = await fetch(`${apiUrl}/api/orders`);
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("HTTP Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getInitialOrders();

    // 2. WebSocket Connection
    const socketUrl = getUrl("socket");
    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      console.log("WS Connected");
      ws.current.send(JSON.stringify({ message: "All_Orders" }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message === "order_updated" || data.message === "all orders") {
        const updatedOrders = data.orders.default || data.orders;
        setOrders(updatedOrders);
      }
    };

    ws.current.onclose = () => console.log("WS Disconnected");

    // Cleanup on unmount
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  return { orders, loading, socket: ws.current };
};
