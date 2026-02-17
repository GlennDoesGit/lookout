// Wave text animation
const waveText = document.querySelector('.wave-text');

if (waveText) {
    const string = waveText.textContent;
    waveText.textContent = '';

    [...string].forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${i * 0.1}s`;
        waveText.appendChild(span);
    });
}

// ---------- TIME ----------

const timeElement = document.getElementById("local-time");

if (timeElement) {
    const timezone = Intl.DateTimeFormat([], { timeZoneName: "short" })
        .formatToParts(new Date())
        .find(p => p.type === "timeZoneName").value;

    function updateTime() {
        timeElement.textContent =
            new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }) + " " + timezone;
    }

    updateTime();
    setInterval(updateTime, 1000);
}


// ---------- WEATHER ----------

// Weather code mapping
const weatherCodes = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    51: "Light Drizzle",
    53: "Drizzle",
    55: "Heavy Drizzle",
    61: "Light Rain",
    63: "Rain",
    65: "Heavy Rain",
    80: "Rain Showers",
    81: "Rain Showers",
    82: "Heavy Showers",
    95: "Thunderstorm"
};


// Wind description function
function getWindDescription(speed) {
    if (speed < 1) return "Still Air";
    if (speed < 6) return "Light Air";
    if (speed < 12) return "Light Breeze";
    if (speed < 20) return "Gentle Breeze";
    if (speed < 29) return "Moderate Breeze";
    if (speed < 39) return "Fresh Breeze";
    if (speed < 50) return "Strong Breeze";
    if (speed < 62) return "Near Gale";
    if (speed < 75) return "Gale";
    return "Storm";
}


// Fetch weather
// Fetch weather
const weatherTemp = document.getElementById("weather-temp");
const weatherDesc = document.getElementById("weather-desc");
const weatherWind = document.getElementById("weather-wind");

if (weatherTemp && weatherDesc && weatherWind) {

    function loadWeather() {

        fetch("https://api.open-meteo.com/v1/forecast?latitude=1.3667&longitude=103.8&current=temperature_2m,weather_code,is_day,wind_speed_10m&timezone=Asia%2FSingapore")
            .then(res => res.json())
            .then(data => {

                const temp = data.current.temperature_2m;
                const code = data.current.weather_code;
                const wind = data.current.wind_speed_10m;

                weatherTemp.textContent = temp + "°C";
                weatherDesc.textContent = weatherCodes[code] || "Unknown";
                weatherWind.textContent =
                    getWindDescription(wind) + " (" + wind + " km/h)";
            })
            .catch(() => {
                weatherTemp.textContent = "Unavailable";
                weatherDesc.textContent = "Unavailable";
                weatherWind.textContent = "Unavailable";
            });

    }

    loadWeather();

    // Update every 30 minutes
    setInterval(loadWeather, 1800000);
}
