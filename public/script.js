async function fetchWeather(city){
  const res = await fetch(`/api/weather/${encodeURIComponent(city)}`);
  return res.json();
}
async function fetchLogs(){
  const res = await fetch(`/api/weather-logs`);
  return res.json();
}
function renderWeather(data){
  const wrap = document.getElementById("weatherResult");
  if(data.error){ wrap.innerHTML = `<p style="color:red">${data.error}</p>`; return; }
  const iconUrl = data.icon ? `https://openweathermap.org/img/wn/${data.icon}@2x.png` : "";
  wrap.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; justify-content:center;">
      ${iconUrl ? `<img src="${iconUrl}" width="60" height="60" />` : ""}
      <div>
        <h3>${data.place}, ${data.country}</h3>
        <div>🌡 Temp: <b>${data.temperature}°C</b> (feels like ${data.feels_like}°C)</div>
        <div>☁️ Condition: ${data.description}</div>
        <div>💧 Humidity: ${data.humidity}% | 💨 Wind: ${data.wind} m/s</div>
      </div>
    </div>`;
}
function renderLogs(logs){
  const box = document.getElementById("weatherLogs");
  if(!logs.length){ box.innerHTML = "<p>No logs yet.</p>"; return; }
  box.innerHTML = `<h4>Recent Searches</h4><table><thead><tr><th>Place</th><th>Temp</th><th>Condition</th><th>Time</th></tr></thead><tbody>
    ${logs.map(l=>`<tr><td>${l.place}, ${l.country}</td><td>${l.temperature}°C</td><td>${l.description}</td><td>${new Date(l.createdAt).toLocaleString()}</td></tr>`).join("")}
  </tbody></table>`;
}
function findDirection(targetPlace){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(async (pos)=>{
      const lat1 = pos.coords.latitude * Math.PI/180;
      const lon1 = pos.coords.longitude * Math.PI/180;
      const geo = await fetch(`/api/weather/${encodeURIComponent(targetPlace)}`);
      const data = await geo.json();
      if(data.error){ document.getElementById("result").innerText = data.error; return; }
      const lat2deg = (data.lat ?? (data.coord && data.coord.lat));
      const lon2deg = (data.lon ?? (data.coord && data.coord.lon));
      if(lat2deg==null || lon2deg==null){ document.getElementById("result").innerText = "Couldn't fetch coordinates"; return; }
      const lat2 = lat2deg * Math.PI/180;
      const lon2 = lon2deg * Math.PI/180;
      const y = Math.sin(lon2-lon1) * Math.cos(lat2);
      const x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
      let brng = Math.atan2(y,x) * 180/Math.PI;
      brng = (brng+360)%360;
      document.getElementById("arrow").style.transform = `rotate(${brng}deg)`;
      const dir = getDirection(brng);
      document.getElementById("result").innerText = `Direction to ${targetPlace}: ${dir} (${Math.round(brng)}°)`;
    });
  } else {
    document.getElementById("result").innerText = "Geolocation not supported";
  }
}
async function handleSearch(){
  const place = document.getElementById("place").value.trim();
  if(!place){ alert("Please enter a place"); return; }
  findDirection(place);
  const data = await fetchWeather(place);
  renderWeather(data);
  const logs = await fetchLogs();
  renderLogs(logs);
}
function getDirection(bearing){
  const dirs=["N","NE","E","SE","S","SW","W","NW","N"];
  return dirs[Math.round(bearing/45)];
}
