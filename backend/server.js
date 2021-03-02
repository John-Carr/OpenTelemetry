const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
//Body parser Middleware
app.use(express.json());
app.use(cors());
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

// Routes
app.use("/api/telemItem", require("./routes/api/telemItem"));
app.use("/api/vehicle", require("./routes/api/vehicle"));

// Socket Namespaces
const live = io.of("/live");

// Sockets General
io.on("connection", (socket) => {
  console.log("A user connected.");
});

// Live data socket
live.on("connection", (socket) => {
  // On connection to live put the socket in a room that they want
  let { room } = socket.handshake.query;
  socket.join(room);
  /*
   * This handles new data from the collector
   */
  socket.on("new data", (data) => {
    // emit to people looking at this car on live telemetry
    io.of("live").to(data.room.toString(10)).emit("new data", data);
    // save it to the data base
  });
  /*
   * If we want to do anything on socket disconnect
   */
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Server started on port ${port}`));
