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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #fff8f0, #fff)",
        p: 2,
        overflow: "hidden", // Prevents body-level scrollbars
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          maxWidth: 900,
          height: { sm: "500px" },
          maxHeight: "80vh",
          boxShadow: 5,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Text Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center", // Vertically centers text against the image
          }}
        >
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Welcome to Our Pizza Management System
            </Typography>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Choose below to either create a new order or check the status of
              all orders
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                size="large"
                variant="contained"
                component={Link}
                to="/createOrder"
                sx={{ flex: { xs: "1 1 100%", sm: "1" }, py: 1.5 }}
              >
                New Order
              </Button>

              <Button
                size="large"
                variant="outlined"
                component={Link}
                to="/orderList"
                sx={{ flex: { xs: "1 1 100%", sm: "1" }, py: 1.5 }}
              >
                Order Status
              </Button>
            </Box>
          </CardContent>
        </Box>

        {/* Image */}
        <CardMedia
          component="img"
          image="/static/images/margherita.jpg"
          alt="Margherita Pizza"
          sx={{
            width: { xs: "100%", sm: "45%" }, // Percentage-based width is more dynamic
            height: { xs: "250px", sm: "100%" }, // Fills card height on desktop
            objectFit: "cover", // Crops the image to fill the space without scrollbars
          }}
        />
      </Card>
    </Box>
  );
};

export default OrderHome;
