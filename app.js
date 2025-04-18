// app.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const livepoolroute = require('./routes/livepool'); 
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

// Initialize the pool server (this is where your Socket.IO logic is triggered)
initPoolServer(io);

// Set up the route for livepool (assuming you're using it for some API)
app.use('/livepool', livepoolroute);


// A simple route to test the server
app.get("/", (req, res) => {
  res.send("Live Pool Server is running...");
});

// Start the server on port 3001
server.listen(3001, () => {
  console.log("Live Pool Server running on port 3001");
});