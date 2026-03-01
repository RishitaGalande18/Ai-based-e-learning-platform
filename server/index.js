import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/uploads", express.static("uploads"));

import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";

app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

const port = process.env.PORT || 5000;

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((err) => {
  console.log("Database connection failed:", err);
});