import mongoose from "mongoose";

const WeatherLogSchema = new mongoose.Schema({
  place: String,
  country: String,
  temperature: Number,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("WeatherLog", WeatherLogSchema);
