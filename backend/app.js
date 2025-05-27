const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const googleRouter = require("./routes/auth");
const verifyRouter = require("./routes/verify");
const userRouter = require("./routes/user");
const uploadRouter = require("./routes/upload");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const notificationRouter = require("./routes/notification");
const likeRouter = require("./routes/like");
const followRouter = require("./routes/follow");
const bookmarkRouter = require("./routes/bookmark");
const audioRouter = require("./routes/audio");
const perspectiveRouter = require("./routes/perspective");
const adminRouter = require("./controllers/adminController");
const reportItemRouter = require("./routes/reportItem");
const historyRoutes = require("./routes/history");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
app.use(
  cors({
    origin: [
      "https://netlify-social.netlify.app",
      "https://thuctaptotnghiep-production.up.railway.app",
      "https://accounts.google.com",
      "http://localhost:3000",
      "https://netlifysocialblog-production.up.railway.app",
    ],
    credentials: true,
    exposedHeaders: ["Content-Type", "Authorization"],
  })
);
connectDB();
app.use(helmet());
app.use(compression());
// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://accounts.google.com",
      "connect-src 'self' https://netlifysocialblog-production.up.railway.app https://netlify-social.netlify.app https://accounts.google.com http://localhost:8080",
      "style-src 'self' 'unsafe-inline' https://accounts.google.com https://fonts.googleapis.com",
      "frame-src 'self' https://accounts.google.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: http://localhost:8080 https://res.cloudinary.com https://img.freepik.com",
    ].join("; ")
  );
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// API ROUTES
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/api/auth/google", googleRouter);
app.use("/verify", verifyRouter);
app.use("/api/users", userRouter);
app.use("/cloudinary", uploadRouter);
// Serve static files từ thư mục 'public'
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/likes", likeRouter);
app.use("/api/follows", followRouter);
app.use("/bookmarks", bookmarkRouter);
app.use("/api/audio", audioRouter);
app.use("/api/perspective", perspectiveRouter);
app.use("/api/admin", adminRouter);
app.use("/api/report-items", reportItemRouter);
app.use("/api/history", historyRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// General error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: req.app.get("env") === "development" ? err : {},
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

module.exports = app;
