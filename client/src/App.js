import { useRef, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import OrderHeader from "./components/OrderHeader";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import OrderHome from "./components/OrderHome";

import "./App.css";

const getSocketUrl = () => {
  const isProduction = window.location.hostname !== "localhost";

  // In production (Render), your server URL will be something like your-app.onrender.com
  // If your React app and Server are on different domains, replace 'window.location.host'
  // with your actual Render backend URL string.
  const host = isProduction
    ? "your-pizza-server.onrender.com"
    : "localhost:5000";
  const protocol = isProduction ? "wss://" : "ws://";

  return `${protocol}${host}`;
};

function App() {
  const websocketRef = useRef(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const url = getSocketUrl();
    console.log(`Opening WebSocket to: ${url}`);

    const ws = new WebSocket(url);
    websocketRef.current = ws;

    const handleOpen = () => {
      console.log("Connected");
      ws.send(JSON.stringify({ message: "All_Orders" }));
    };

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setOrders(data.orders ?? []);
      } catch (err) {
        console.error("Invalid WS message", err);
      }
    };

    const handleClose = () => {
      console.log("Disconnected");
    };

    ws.addEventListener("open", handleOpen);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", handleClose);

    return () => {
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("message", handleMessage);
      ws.removeEventListener("close", handleClose);

      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  }, []);

  return (
    <Router>
      <OrderHeader />

      <Routes>
        <Route path="/" element={<OrderHome />} />

        <Route path="/createOrder" element={<OrderForm />} />

        <Route path="/orderList" element={<OrderList />} />
      </Routes>
    </Router>
  );
}

export default App;
