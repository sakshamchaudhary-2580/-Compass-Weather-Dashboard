import express from "express";
import fetch from "node-fetch";
import WeatherLog from "../models/WeatherLog.js";

const router = express.Router();

router.get("/weather/:city", async (req,res)=>{
  try{
    const city = req.params.city;
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    if(data.cod!==200) return res.json({ error: data.message });
    const weather = {
      place: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      wind: data.wind.speed,
      icon: data.weather[0].icon,
      lat: data.coord.lat,
      lon: data.coord.lon
    };
    const log = new WeatherLog(weather);
    await log.save();
    res.json(weather);
  }catch(err){
    res.json({ error: "Error fetching weather" });
  }
});
router.get("/weather-logs", async (req,res)=>{
  const logs = await WeatherLog.find().sort({ createdAt:-1 }).limit(10);
  res.json(logs);
});

export default router;
