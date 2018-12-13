const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Customer = require("./Customer");

// Mongoose Config
mongoose
  .connect(
    "mongodb://localhost:27017/customersservice",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected!"))
  .catch(error => console.log("Error: ", error));

const app = express();

// Body Parser Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Customers Service"));

// Service API Routes
app.post("/customer", async (req, res) => {
  try {
    const customer = await Customer.create(req.body);

    res.json(customer);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find({});

    res.json(customers);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/customer/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ error: "Invalid id" });
    }

    const [customer] = await Customer.find({ _id: req.params.id }).limit(1);

    res.json(customer);
  } catch (err) {
    console.log(err.message);
  }
});

app.delete("/customer/:id", async (req, res) => {
  ``;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ error: "Invalid id" });
    }

    await Customer.findByIdAndRemove(req.params.id);

    res.json({ success: "Customer was successfully removed!" });
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(4002, console.log("Up and Running -> Customers Service"));
