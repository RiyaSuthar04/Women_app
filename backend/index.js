require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("./models/users");
const Message = require("./models/Message");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/women-chat-app";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Failed to connect to MongoDB:", err));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
  },
});

// Track online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔵 A user connected:", socket.id);

  // Handle user login and track online status
  socket.on("user_login", async (userId) => {
    if (!userId) return;
    onlineUsers.set(userId, socket.id);
    console.log(`✅ User ${userId} is online`);

    await Users.findByIdAndUpdate(userId, { status: "online" });
    io.emit("user_status_update", { userId, status: "online" });
  });

  // Handle user joining a chat room
  socket.on("join_room", (roomId) => {
    if (!roomId) return;
    socket.join(roomId);
    console.log(`✅ User joined room: ${roomId}`);
  });

  // Handle sending messages
  socket.on("send_message", async (data) => {
    try {
      const { senderId, receiverId, message } = data;

      if (!senderId || !receiverId || !message) {
        console.log("❌ Invalid message data received:", data);
        return;
      }

      console.log(`✅ Message from ${senderId} to ${receiverId}:`, message);

      // Save message to database
      const newMessage = new Message({
        senderId: senderId,
        receiverId: receiverId,
        message,
      });

      await newMessage.save();
      console.log("✅ Message saved to database:", newMessage);

      // Generate room ID
      const roomId = [senderId, receiverId].sort().join("_");

      // Emit message to both users in the room
      io.to(roomId).emit("receive_message", newMessage);
      console.log("✅ Message emitted to room:", roomId);
    } catch (err) {
      console.error("❌ Error handling send_message:", err);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", async () => {
    console.log("🔴 A user disconnected:", socket.id);

    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`❌ User ${userId} is offline`);

        await Users.findByIdAndUpdate(userId, { status: "offline" });
        io.emit("user_status_update", { userId, status: "offline" });
        break;
      }
    }
  });
});

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, skills, education, job } = req.body;

    if (!email || !password) return res.status(400).json({ message: "❌ Email and password required" });

    const existingUser = await Users.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "❌ User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Users({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      ...(role === "illiterate" ? { skills } : { education, job }),
      status: "offline",
    });

    await user.save();
    res.status(201).json({ message: "✅ User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "❌ Server error", error: err.message });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) return res.status(400).json({ message: "❌ Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "❌ Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    await Users.findByIdAndUpdate(user._id, { status: "online" });

    res.status(200).json({ message: "✅ Login successful", user, token });
  } catch (err) {
    res.status(500).json({ message: "❌ Server error", error: err.message });
  }
});

// Save new message
app.post("/chat", async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "senderId and receiverId are required" });
    }

    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      message,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Database Error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get all users
app.get("/chat", async (req, res) => {
  try {
    const users = await Users.find({}, { password: 0 }); // Exclude passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "❌ Server error", error: err.message });
  }
});

// Fetch chat messages between two users
app.get("/chat/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
