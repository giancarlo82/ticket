const express = require("express");
const session = require("express-session");
const app = express();
const dotenv = require("dotenv");
dotenv.config({
  path: "./config/.env",
});
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

// Set up the express app
app.use(express.static("public"));
app.use(express.urlencoded({ extended: "false" }));
app.use(express.json());
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // secure true solo in produzione
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // sameSite none solo in produzione
    },
  })
);

app.get("/test", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

// setup middleware
const authMiddleware = require("./middlewares/authMiddleware");

// Import routes
const authRouter = require("./routes/authRouter");
app.use("/", authRouter);

const ticketRouter = require("./routes/ticketRouter");
app.use("/ticket", ticketRouter);

const adminRouter = require("./routes/adminRouter");
app.use("/admin", authMiddleware, adminRouter);

// Start the server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

// Import socket.io and listen on the same server
const io = require("socket.io")({
  allowEIO3: true,
}).listen(server);

// Import socket events
const socketEvents = require("./socket/events");
socketEvents(io);
