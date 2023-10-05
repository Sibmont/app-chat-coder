import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./utils.js";

const app = express();

// Static files
app.use(express.static(`${__dirname}/public`));

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Routes
app.use("/", viewsRouter);

const server = app.listen(8080, console.log("Server running on port 8080"));

// Socket.io
const socketServer = new Server(server);

const messages = [];

socketServer.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("message", (data) => {
    messages.push(data);
    socketServer.emit("messageLogs", messages);
  });

  socket.on("authenticated", (data) => {
    // We send all the stored messages up to this point, ONLY to the newly connected client
    socket.emit("messageLogs", messages);
    socket.broadcast.emit("newUserConnected", data);
  });
});
