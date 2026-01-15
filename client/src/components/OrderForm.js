import Button from "@mui/material/Button";
import {
  FormControl,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
} from "@mui/material";
import PizzaMenu from "../PizzaMenu";
import { useNavigate } from "react-router-dom";

const OrderForm = ({ wscontext }) => {
  const navigate = useNavigate();

  const orderPizza = ({ pizzaId, name, toppings }) => {
    const newOrder = {
      message: "New_Order",
      pizzaId,
      pizzaType: name,
      pizzaToppings: toppings,
    };

    wscontext?.send(JSON.stringify(newOrder));
    navigate("/orderList");
  };

  return (
    <FormControl fullWidth>
      <Grid container spacing={3} sx={{ p: 2 }}>
        {PizzaMenu.map((pizza) => (
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
