import express from "express";
import http from "http";
import cors from "cors";
// const uuidv4 = require("uuid").v4;
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
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

  socket.on("join", (data) => {
    console.log(`${data.name} ${data.id} joined`);

    const checkUserExist = users.find((item) => item.id === data.id);

    if (checkUserExist) {
      io.emit("user-reject", data);
      console.log("user is exist");
    } else {
      // Add the user to a "users" array
      users.push({ id: data.id, name: data.name });
      console.log(users);
      // Broadcast a "user joined" message to all connected clients
      io.emit("user-joined", { id: data.id, name: data.name, messages });
      console.log("boardcast chat-messages");
    }
  });

  socket.on("chat-message", (data) => {
    // Find the user's name in the "users" array
    console.log("chat-message");
    console.log(data);
    console.log(users);
    const user = users.find((user) => user.id === data.id);
    if (user) {
      // Add the chat message to the "messages" array
      messages.push({ id: data.id, name: data.name, message: data.message });
      // Broadcast the chat message to all connected clients
      console.log("emit chat-message");
      io.emit("chat-message", {
        id: data.id,
        name: data.name,
        message: data.message,
      });
    }
  });

  socket.on("leave", (data) => {
    console.log(`User left: ${data.id} ${data.name}`);

    users = users.filter((item) => item.id !== data.id);
    console.log(messages);
    const updateMessages = messages.map((item) =>
      data.id === item.id
        ? { ...item, message: `${data.name} has left the chat.` }
        : item
    );
    messages = updateMessages;
    console.log("updateMessages");
    console.log(messages);
    io.emit("update-messages", messages);
  });

  socket.on("disconnect", (data) => {
    console.log(`A user disconnected ${socket.id}`);

    // Remove the user from the "users" array

    const findUser = users.find((item) => item.id !== socket.id);

    if (findUser && findUser.name) {
      users = users.filter((item) => item.id !== socket.id);
      console.log(users);
      // Broadcast a "user left" message to all connected clients
      io.emit("user-left", findUser.name);
    } else {
      console.log("guest disconnected");
    }
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
