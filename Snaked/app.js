const express = require("express");
const { join } = require("path");
const app = express();
const server = require('http').Server(app);

// Serve static assets from the /public folder
app.use(express.static(join(__dirname, "public")));

// Serve the index page for all other requests
app.get("/*", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

// Listen on port 3000
server.listen(3000, () => console.log("Application running on port 3000"));

var io = require("socket.io") (server, {});
io.sockets.on("connection", socket => {
  socket.id = Math.random();

  socket.on("find_normal_game", data => {
    console.log(socket.id + ": " + data.elo);
  });

  socket.emit("serverMessage", {
    //data
  });

});
