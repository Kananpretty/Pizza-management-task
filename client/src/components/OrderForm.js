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

const OrderForm = (props) => {
  const websocketRef = props.wscontext;
  const orderPizza = (pizzaId) => {
    const pizzaOrdered = PizzaMenu.filter((pizza) => pizza.pizzaId === pizzaId);
    const pizzaData = {
      pizzaId: pizzaOrdered[0].pizzaId,
      pizzaType: pizzaOrdered[0].name,
      pizzaToppings: pizzaOrdered[0].toppings,
    };
    const newOrder = { message: "New_Order", ...pizzaData };
    websocketRef.send(JSON.stringify(newOrder));
  };

  return (
    <FormControl>
      <Grid container spacing={3} style={{ padding: "15px" }}>
        {PizzaMenu.map((pizzaItem) => {
          return (
            <Grid item xs={4} key={pizzaItem.pizzaId}>
              <Card
                sx={{ maxWidth: 400 }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}>
                <CardMedia
                  sx={{ height: 200 }}
                  image={pizzaItem.imgPath}
                  title={pizzaItem.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {pizzaItem.name}
                  </Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {pizzaItem.description}
                  </Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {pizzaItem.toppings.toString().replaceAll(",", ", ")}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button
                    size="large"
                    onClick={() => {
                      orderPizza(pizzaItem.pizzaId);
                    }}>
                    Order
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </FormControl>
  );
};

export default OrderForm;
