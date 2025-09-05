import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import weatherRoutes from "./routes/weather.js";
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(express.static("public"));

app.use("/api", weatherRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log("MongoDB Connected"))
  .catch(err=> console.error("MongoDB Error:", err));

app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
