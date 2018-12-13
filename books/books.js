const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Book = require("./Book");

const app = express();

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Mongoose Config
mongoose
  .connect(
    "mongodb://localhost:27017/booksservice",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected!"))
  .catch(error => console.log("Error: ", error));

app.get("/", (req, res) => res.send("Books Service"));

// Service API Routes
app.post("/books", async (req, res) => {
  try {
    const book = await Book.create(req.body);

    res.json(book);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find({});

    res.json(books);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/book/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ error: "Invalid Book Id" });
    }

    const [book] = await Book.find({ _id: req.params.id }).limit(1);

    res.json(book);
  } catch (err) {
    console.log(err.message);
  }
});

app.delete("/book/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ error: "Invalid Book Id" });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ success: "Book was successfully removed!" });
  } catch (err) {
    console.log(err.message);
  }
});

app.put("/book/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ error: "Invalid Book Id" });
    }

    const book = await Book.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true
    });

    res.json(book);
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(4001, () => console.log("Up and Running -> Books Service"));
