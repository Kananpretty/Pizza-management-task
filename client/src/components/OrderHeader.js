import { AppBar, Box, Toolbar, Typography, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";

const OrderHeader = () => {
  return (
    <>
      <Box>
        <AppBar position="static" style={{ background: "white" }}>
          <Toolbar>
            <Box
              size="small"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => <Link to="/" />}
              component={Link}
              to="/">
              <img
                src="/static/images/pizza-logo.jpg"
                alt="logo"
                width="50px"
                height="50px"
              />
            </Box>
            <Typography
              variant="h3"
              style={{ color: "black", flexGrow: 1, textAlign: "center" }}>
              Kanan's Pizza
            </Typography>
            <MenuItem>
              <Typography
                style={{ textDecoration: "none", color: "black" }}
                variant="h6"
                component={Link}
                to="/createOrder"
                sx={{ flexGrow: 1 }}>
                Create Order
              </Typography>
            </MenuItem>
            <MenuItem>
              <Typography
                style={{ textDecoration: "none", color: "black" }}
                variant="h6"
                component={Link}
                to="/orderList"
                sx={{ flexGrow: 1 }}>
                Order Listing
              </Typography>
            </MenuItem>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default OrderHeader;
