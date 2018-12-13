const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");

const Order = require("./Order");

// Mongoose Config
mongoose
  .connect(
    "mongodb://localhost:27017/ordersservice",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log("Error: ", err));

const app = express();

// Body Parser Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Orders Service"));

// Service API Routes
app.post("/order", async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      CustomerID: mongoose.Types.ObjectId(req.body.CustomerId),
      BookID: mongoose.Types.ObjectId(req.body.BookID)
    });

    res.json(order);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({});

    res.json(orders);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/order/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ error: "Invalid ID" });
    }

    const [order] = await Order.find({ _id: req.params.id }).limit(1);

    if (!order) {
      res.status(404).json({ error: "No orders found!" });
    }

    // Call from Book Service
    const book = await axios.get(`http://localhost:4001/book/${order.BookID}`);

    // Call from Customer Service
    const customer = await axios.get(
      `http://localhost:4002/customer/${order.CustomerID}`
    );

    // Example Order Data
    const orderData = {
      orderID: order._id,
      customer: { ...customer.data },
      book: { ...book.data }
    };

    res.json(orderData);
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(4003, console.log("Up and Running -> Orders Service"));
