import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import { connectDB } from "./config/db.js";

import rateLimitMiddleware from "./middleware/rateLimiter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

connectDB();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
//app.use(rateLimit);
app.use(rateLimitMiddleware); // Apply rate limiting middleware to all routes

// Enable CORS for all routes and origin your frotned url
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
  }),
);

app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "../../frontend/Note_project/dist")),
  );
  app.use((req, res) => {
    res.sendFile(
      path.join(__dirname, "../../frontend/Note_project/dist/index.html")
    );
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
