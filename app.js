// app.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const  {initPoolServer}  = require("./server/mainpool");
require('dotenv').config();  // Adjust the path if needed

// Initialize the Express app
const app = express();

// Set up CORS
app.use(cors());

// Create an HTTP server for Express

const server = http.createServer(app);

// Set up Socket.IO server with the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (use cautiously in production)
  },
});

initPoolServer(io);


// A simple route to test the server
app.get("/", (req, res) => {
  res.send("Live Pool Server is running...");
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Live Pool Server running on port ${PORT}`);
});