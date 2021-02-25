const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require('cors');

const app = express();

//enable cross site requests
app.use(cors({
  origin: 'https://ufsolargators.org',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

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
// app.use('/api/events', require('./routes/api/events'));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/sponsors", require("./routes/api/sponsors"));
app.use("/api/permissions", require("./routes/api/permissions"));
app.use("/api/roles", require("./routes/api/roles"));
app.use("/api/contact", require("./routes/api/contact"));
// app.use('/api/lessons', require('./routes/api/lessons'));
app.use("/api/inventory", require("./routes/api/inventory"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
