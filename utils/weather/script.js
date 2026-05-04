async function load() {
  const lat = window.lat;
  const lon = window.lon;
  const URL = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m&hourly=temperature_2m,apparent_temperature,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&temperature_unit=fahrenheit&forecast_days=7&timezone=auto";

  const r = await fetch(URL);
const d = await r.json();
const lines = [];

lines.push("=== Current ===");
lines.push("Time: " + d.current.time);
lines.push("Temp: " + d.current.temperature_2m + d.current_units.temperature_2m);

lines.push("\n=== Daily ===");
for (let i = 0; i < d.daily.time.length; i++) {
lines.push(
d.daily.time[i].slice(5) + ":" +
"  high: " + d.daily.temperature_2m_max[i] + d.daily_units.temperature_2m_max + "," +
"  low: " + d.daily.temperature_2m_min[i] + d.daily_units.temperature_2m_min + "," +
"  precip: " + d.daily.precipitation_sum[i] + d.daily_units.precipitation_sum + "."
    );
  }

lines.push("\n=== Next 24 hours ===");
// Use the UTC offset from the response to find local "now"
const offsetSec = d.utc_offset_seconds;
const nowUtcMs = Date.now();
const nowLocalStr = new Date(nowUtcMs + offsetSec * 1000).toISOString().slice(0, 16);

let count = 0;
for (let i = 0; i < d.hourly.time.length && count < 24; i++) {
if (d.hourly.time[i] < nowLocalStr) continue;
lines.push(
d.hourly.time[i].slice(11) + ":" +
"  " + d.hourly.temperature_2m[i] + d.hourly_units.temperature_2m + "," +
"  feels like: " + d.hourly.apparent_temperature[i] + d.hourly_units.apparent_temperature + "," +
"  precip. chance: " + d.hourly.precipitation_probability[i] + d.hourly_units.precipitation_probability + "."
    );
count++;
  }

document.getElementById("out").textContent = lines.join("\n");
}
load().catch(e => document.getElementById("out").textContent = "Error: " + e);
