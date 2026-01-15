import { useRef, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import OrderHeader from "./components/OrderHeader";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import OrderHome from "./components/OrderHome";

import "./App.css";

function App() {
  const websocketRef = useRef(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    console.log("Opening WebSocket");

    const ws = new WebSocket("ws://localhost:8080");
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

        <Route
          path="/createOrder"
          element={<OrderForm wscontext={websocketRef.current} />}
        />

        <Route path="/orderList" element={<OrderList data={orders} />} />
      </Routes>
    </Router>
  );
}

export default App;
