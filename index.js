const express = require("express");
const dotenv = require("dotenv");

const cors = require("cors");
const { dbConnect } = require("./Config/Bd.config.js");
const userRoutes = require("./Router/userRoutes.js");
const chatRoutes = require("./Router/chatRoutes.js");
const messageRoutes = require("./Router/messageRoutes.js");
const createServer = require("http");
const { use } = require("./Router/userRoutes.js");
const path = require("path");

dotenv.config();
dbConnect();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const Server = app.listen(
  Number(process.env.PORT),
  console.log("Servidor no Ar")
);

const io = require("socket.io")(Server, {
  pingTimeout: 60000,
  cors: {
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData.data._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("Usuario entrou na sala" + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});
