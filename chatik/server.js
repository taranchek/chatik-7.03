const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

const port = 5000;

// Online
let UserOnline = 0;


app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", function(socket) {
    socket.on("login", function(username) {
        socket.broadcast.emit("update", username + " присоединился к чату")
        UserOnline++;
        io.emit('user-count', UserOnline);
    });
    socket.on("logout", function(username) {
        socket.broadcast.emit("update", username + " покинул")
    });
    socket.on("chat", function(message) {
        socket.broadcast.emit("chat", message)
    });
    socket.on("typing", ({ uname, message }) => {
        socket.broadcast.emit("typing", { uname, message });
    });
    socket.on('disconnect', () => {
        UserOnline--;
        io.emit('user-count', UserOnline);
    });
});


server.listen(port, () => {
	console.log("\x1b[35m%s\x1b[0m", `The server is running on the port ${port}`);
	console.log("\x1b[32m%s\x1b[0m", `http://localhost:${port}/`);
});