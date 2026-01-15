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
} from "@mui/material";

const OrderList = ({ data = [] }) => {
  const hasOrders = data.length > 0;

  return (
    <Box sx={{ p: 2 }}>
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }} aria-label="order list table">
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Pizza Name</TableCell>
              <TableCell>Pizza Toppings</TableCell>
              <TableCell>Pizza Status</TableCell>
              <TableCell align="right">Total Time</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {hasOrders ? (
              data.map(
                ({
                  id,
                  pizzaType,
                  pizzaToppings,
                  status,
                  timeOrder,
                  timeTaken,
                }) => (
                  <TableRow
                    key={id}
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {id}
                    </TableCell>

                    <TableCell>{pizzaType}</TableCell>

                    <TableCell>{pizzaToppings.join(", ")}</TableCell>

                    <TableCell>{status}</TableCell>

                    <TableCell align="right">
                      {status === "Done"
                        ? `${Math.floor((timeTaken - timeOrder) / 1000)} sec`
                        : "-"}
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography align="center" sx={{ py: 2 }}>
                    No Orders Placed
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
