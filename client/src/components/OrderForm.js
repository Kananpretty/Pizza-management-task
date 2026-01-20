import Button from "@mui/material/Button";
import {
  FormControl,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { fetchMenu } from "../api/menuService";
import { useOrderHandler } from "../context/orderProvider";

const OrderForm = () => {
  const navigate = useNavigate();
  const { socket } = useOrderHandler();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMenu = async () => {
      try {
        const data = await fetchMenu();
        setMenuItems(data);
      } catch (err) {
        setError("Could not load the menu. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getMenu();
  }, []);

  const orderPizza = ({ pizzaId, name, toppings }) => {
    const newOrder = {
      message: "New_Order",
      pizzaId,
      pizzaType: name,
      pizzaToppings: toppings,
    };
    console.log(socket);
    socket?.send(JSON.stringify(newOrder));
    navigate("/orderList");
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <FormControl fullWidth>
      <Grid container spacing={3} sx={{ p: 2 }}>
        {menuItems.map((pizza) => (
          <Grid item xs={12} sm={6} md={3} key={pizza.pizzaId}>
            <Card
              sx={{
                maxWidth: 300,
                m: "auto",
                display: "flex",
                flexDirection: "column",
                height: "100%", // ensures card takes full height
                boxShadow: 3,
              }}
            >
              <CardMedia
                component="img"
                sx={{ height: 100 }}
                image={pizza.imgPath}
                title={pizza.name}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{pizza.name}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {pizza.description}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {pizza.toppings.join(", ")}
                </Typography>
              </CardContent>

              <CardActions>
                <Button variant="contained" onClick={() => orderPizza(pizza)}>
                  Order
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </FormControl>
  );
};

export default OrderForm;
