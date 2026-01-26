import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { useOrders } from "../../hooks/useOrders";

const OrderList = () => {
  const { orders, loading, error } = useOrders();

  // Helper to determine Chip color based on status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "new order":
        return "info";
      case "baking":
        return "warning";
      case "out for delivery":
        return "primary";
      case "done":
        return "success";
      default:
        return "default";
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Live Order Tracker
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }} aria-label="order list table">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Pizza Name</TableCell>
              <TableCell>Toppings</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Total Time</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map(({ _id, pizzaId, status, createdAt, updatedAt }) => (
                <TableRow key={_id} hover>
                  <TableCell sx={{ fontFamily: "monospace" }}>
                    {_id.slice(-6)} {/* Show last 6 chars for cleaner look */}
                  </TableCell>

                  <TableCell>{pizzaId?.name || "Loading..."}</TableCell>

                  <TableCell>
                    {pizzaId?.toppings ? pizzaId.toppings.join(", ") : "-"}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={status}
                      size="small"
                      color={getStatusColor(status)}
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell align="right">
                    {status === "Done"
                      ? `${Math.floor((new Date(updatedAt) - new Date(createdAt)) / 1000)} sec`
                      : "---"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography sx={{ py: 3, color: "text.secondary" }}>
                    No orders found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderList;
