const express = require("express");
const auth = require("./routes/Auth.route");
const conversation = require("./routes/Conversation.route");
const message = require("./routes/Message.route");
const port = process.env.PORT || 8080;
// Setting & Connect to the Database
let configDB = require("./config/database");
const morgan = require("morgan");
const { createServer } = require("http");
const cors = require("cors");
const session = require("cookie-session");
const jwtVariable = require('./constant/jwt');
const authMethod = require('./services/auth.service');
// initialize our express app
const app = express();
app.use(express.static(__dirname + "/public"));

const httpServer = createServer(app);
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const messageController = require("./controllers/Message.controller");
const authController = require("./controllers/Auth.controller");
const UserModel = require("./models/User.model");
const io = new Server(httpServer,{
  cors: {
    origin: "*"
  }
});

mongoose
  .connect(configDB.url, configDB.config)
  .then(async () => {
    console.log("Connected DB");
  })
  .catch((e) => {
    console.log("error connect db", e);
  });
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    credentials: true,
    origin: "*",
    exposedHeaders: ["Set-Cookie", "Date", "ETag"],
  })
);
app.use("/upload", express.static("upload"));

app.use(morgan("combined"));
app.use(
  session({
    secret: require("crypto").randomBytes(48).toString("hex"),
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/api/v1/auth", auth);
app.use("/api/v1/conversation", conversation);
app.use("/api/v1/message", message);

httpServer.listen(port, () => {
  console.log("Http sv listen in ", port);
});

io.of('/room')
io.on("connection",async (socket) => {

  let listUser = []
  // const res = authController.updateOnline({token:socket.handshake.query.token,status: true})
  const accessTokenSecret =
		process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
	const accessTokenLife =
		process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

	const decoded = await authMethod.decodeToken(
		socket?.handshake?.query?.token,
		accessTokenSecret,
		accessTokenLife
	);
  if(decoded){
    await UserModel.findOneAndUpdate({_id: decoded.payload._id},{$set: {is_online: true}},{new: true})
    // listUser.push({_id: decoded.payload._id})
    // //user online status
    // return socket.broadcast.emit('getOnlineUser',listUser)
  }

  

  socket.on("disconnect", async () => {
    console.log("user disconnected");
    if(decoded){
      await UserModel.findOneAndUpdate({_id: decoded.payload._id},{$set: {is_online: false}}, {new: true})
      // const index = await listUser.findIndex(item => item._id === decoded.payload._id);
      // if (index > -1) {
      //   listUser.splice(index, 1);
      // }
      // console.log(listUser);
      // //user offline status
      // return socket.broadcast.emit('getOnlineUser',listUser)
    }
    
  });

  socket.on('join', (conversation_id)=>{
    socket.join(conversation_id);
  });

  socket.on("send-message", async (msg) => {
    await messageController.createMessage(msg)
    const dataChat = {
      sender: {_id:msg.sender},
      content: msg.content,
      conversation_id: msg.conversation_id
    }
		return io.to(msg.conversation_id).emit("return-message", dataChat)
  });
});
