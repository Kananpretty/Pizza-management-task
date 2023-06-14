import {
  Typography,
  Card,
  Box,
  CardContent,
  Button,
  CardMedia,
} from "@mui/material";

import { Link } from "react-router-dom";

const OrderHome = () => {
  return (
    <>
      <div
        style={{ width: "50%", top: "15%", left: "25%", position: "absolute" }}>
        <Card sx={{ display: "flex" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h5">
                Welcome to our pizza management system
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div">
                Choose below to either create a new order or check the status of
                all order
              </Typography>
            </CardContent>
            <Box>
              <Button size="large" component={Link} to="/createOrder">
                New Order
              </Button>
              <Button size="large" component={Link} to="/orderList">
                Order Status
              </Button>
            </Box>
          </Box>
          <CardMedia
            component="img"
            sx={{ width: 350, height: 300 }}
            image="/static/images/margherita.jpg"
          />
        </Card>
      </div>
    </>
  );
};

export default OrderHome;
