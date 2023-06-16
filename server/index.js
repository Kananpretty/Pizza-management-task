const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/menu", require("./routes/api/menu"));

app.listen(5000, () => {
  console.log("Server started on port 5000");
  require("../server/webSocket/connection.js");
});

app.get("/", function (req, res) {
  res.send(orders);
});

//run().catch(console.dir);
