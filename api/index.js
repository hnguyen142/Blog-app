// server.js or app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import postsRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js"; // Import auth routes

// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies)
  })
);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "./uploads"); // Ensure this path exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Upload route
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json("No file uploaded.");
    }
    // Return the filename and the path for frontend access
    res.status(200).json(`/uploads/${req.file.filename}`);
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json("Failed to upload file.");
  }
});

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "./uploads"))); // Serve uploaded files from '/uploads'

// Use Routes
app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes); // Use auth routes

// Start the server
app.listen(8800, () => {
  console.log("Backend running on http://localhost:8800");
});
