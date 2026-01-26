import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import OrderForm from "./components/orders/OrderForm";
import OrderList from "./components/orders/OrderList";
import OrderHome from "./components/orders/OrderHome";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/orderProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <OrderProvider>
          <Header />
          <Routes>
            <Route path="/" element={<OrderHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Area */}
            <Route
              path="/createOrder"
              element={
                <ProtectedRoute>
                  <OrderForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orderList"
              element={
                <ProtectedRoute>
                  <OrderList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </OrderProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
