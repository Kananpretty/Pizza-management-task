import OrderHeader from "./components/OrderHeader";
import { useRef, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import OrderHome from "./components/OrderHome";
import "./App.css";

function App() {
  const websocketObj = useRef();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    console.log("opening Socket");
    websocketObj.current = new WebSocket("ws://localhost:8080");
    websocketObj.current.onopen = (event) => {
      console.log("Connected");
      const newOrder = { message: "All_Orders" };
      websocketObj.current.send(JSON.stringify(newOrder));
    };

    websocketObj.current.onclose = (event) => {
      console.log("Disconnected");
    };

    return () => {
      websocketObj.current.close();
      setOrders([]);
    };
  }, []);

  useEffect(() => {
    if (!websocketObj.current && websocketObj.current.readyState !== 1) return;

    if (orders.length === 0 && websocketObj.current.readyState === 1) {
      const newOrder = { message: "All_Orders" };
      websocketObj.current.send(JSON.stringify(newOrder));
    }

    websocketObj.current.onmessage = (message) => {
      const data = JSON.parse(message?.data);
      setOrders(data.orders);
    };
  }, [websocketObj]);

  return (
    <Router>
      <div>
        <OrderHeader />
        <Routes>
          <Route exact path="/" element={<OrderHome />} />
          <Route
            path="/createOrder"
            element={<OrderForm wscontext={websocketObj.current} />}
          />
          <Route path="/orderList" element={<OrderList data={orders} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
