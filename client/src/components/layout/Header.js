import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";

const OrderHeader = () => {
  const { user, logout } = useAuth();
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
        <Box sx={{ display: "flex", gap: 2 }}>
          {user && (
            <>
              <Button component={RouterLink} to="/createOrder" color="inherit">
                Create Order
              </Button>
              <Button component={RouterLink} to="/orderList" color="inherit">
                Orders List
              </Button>
              <Button onClick={logout} color="error" variant="outlined">
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default OrderHeader;
