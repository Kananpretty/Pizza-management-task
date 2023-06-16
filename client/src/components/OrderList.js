import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
} from "@mui/material";

const OrderList = (props) => {
  const orderData = props.data;
  console.log(props);
  return (
    <div style={{ padding: "10px" }}>
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
            {orderData && orderData.length !== 0 ? (
              orderData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.pizzaType}</TableCell>
                  <TableCell>
                    {row.pizzaToppings.map((pizzaTopping) => {
                      return pizzaTopping + " ";
                    })}
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                  {row.status === "Done" ? (
                    <TableCell align="right">
                      {(row.timeTaken - row.timeOrder) / 1000 + " seconds"}
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            ) : (
              <Typography
                gutterBottom
                style={{ padding: "10px" }}
                component="p">
                No Orders Placed
              </Typography>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrderList;
