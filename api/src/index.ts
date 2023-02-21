import express from "express";
import http from "http";
import cors from "cors";

import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Use the "cors" middleware to allow cross-origin requests
app.use(cors());

let users = [];
let messages = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (name) => {
    // Add the user to a "users" array
    users.push({ id: socket.id, name });

    // Broadcast a "user joined" message to all connected clients
    io.emit("user-joined", name);
    socket.emit("chat-messages", messages);
  });

  socket.on("chat-message", (data) => {
    console.log(data);
    // Find the user's name in the "users" array
    const user = users.find((user) => user.id === socket.id);

    if (user) {
      // Add the chat message to the "messages" array
      messages.push({ name: user.name, message: data.message });

      // Broadcast the chat message to all connected clients
      io.emit("chat-message", { name: user.name, message: data.message });
    }
  });

  socket.on("leave", (name) => {
    console.log(`User left: ${name}`);
    const index = users.findIndex((user) => user.name === name);
    if (index !== -1) {
      users.splice(index, 1);
      io.emit("user-left", name);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");

    // Remove the user from the "users" array
    const index = users.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      const { name } = users[index];
      users.splice(index, 1);

      // Broadcast a "user left" message to all connected clients
      io.emit("user-left", name);
    }
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
