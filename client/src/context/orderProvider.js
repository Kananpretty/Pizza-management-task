import { useContext } from "react";
import { OrderContext } from "./orderContext";
import { useOrders } from "../hooks/useOrders";

export const OrderProvider = ({ children }) => {
  const sync = useOrders(); // This contains { orders, socket, loading }

  return <OrderContext.Provider value={sync}>{children}</OrderContext.Provider>;
};

export const useOrderHandler = () => useContext(OrderContext);
