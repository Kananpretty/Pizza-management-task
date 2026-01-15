import { AppBar, Box, Toolbar, Typography, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";

const OrderHeader = () => {
  return (
    <AppBar position="static" color="transparent" elevation={1}>
      <Toolbar>
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            mr: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src="/static/images/pizza-logo.jpg"
            alt="logo"
            sx={{ width: 50, height: 50 }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            color: "text.primary",
          }}
        >
          Kanan's Pizza
        </Typography>

        {/* Navigation */}
        <MenuItem
          component={Link}
          to="/createOrder"
          sx={{ textDecoration: "none", color: "text.primary" }}
        >
          <Typography variant="h6">Create Order</Typography>
        </MenuItem>

        <MenuItem
          component={Link}
          to="/orderList"
          sx={{ textDecoration: "none", color: "text.primary" }}
        >
          <Typography variant="h6">Order Listing</Typography>
        </MenuItem>
      </Toolbar>
    </AppBar>
  );
};

export default OrderHeader;
