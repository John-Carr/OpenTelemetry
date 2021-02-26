const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const app = express();

//Body parser Middleware
app.use(express.json());

// DB config
const db = config.get("mongoURI");

// connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.use(express.static("public"));

// Use routes
app.use("/api/telemItem", require("./routes/api/telemItem"));
app.use("/api/vehicle", require("./routes/api/vehicle"));
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
