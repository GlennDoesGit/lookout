// Because relative and absolute paths are annoying and weird.
const BASE_PATH = new URL('../', document.currentScript.src).pathname;

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

// Get elements and fetch weather
const weatherTemp = document.getElementById("weather-temp");
const weatherDesc = document.getElementById("weather-desc");
const weatherWind = document.getElementById("weather-wind");
const weatherIcon = document.getElementById("weather-icon");

if (weatherTemp && weatherDesc && weatherWind && weatherIcon) {

    function getWeatherSprite(code) {

        const hour = new Date().getHours();
        const isDay = hour >= 6 && hour < 18;

        // Clear
        if (code === 0) {
            return isDay ? "Clear_Day.png" : "Clear_Night.png";
        }

        // Mostly clear
        if (code === 1) {
            return isDay ? "MostlyClear_Day.png" : "MostlyClear_Night.png";
        }

        // Cloudy
        if (code === 2) return "Cloudy.png";

        // Overcast
        if (code === 3) return "Overcast.png";

        // Fog
        if (code === 45 || code === 48) return "Fog.png";

        // Drizzle
        if ([51, 53, 55].includes(code)) return "Drizzle.png";

        // Rain
        if ([61, 63, 80, 81].includes(code)) return "Rain.png";

        // Heavy rain
        if ([65, 82].includes(code)) return "Heavy_Rain.png";

        // Storm
        if (code === 95) return "Storm.png";

        return "NoData.png";
    }

    function loadWeather() {

        fetch("https://api.open-meteo.com/v1/forecast?latitude=1.3551&longitude=103.9901&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia%2FSingapore")
            .then(res => res.json())
            .then(data => {

                const temp = data.current.temperature_2m;
                const code = data.current.weather_code;
                const wind = data.current.wind_speed_10m;

                weatherTemp.textContent = temp + "°C";
                weatherDesc.textContent = weatherCodes[code] || "Unknown";
                weatherWind.textContent =
                    getWindDescription(wind) + " (" + wind + " km/h)";

                const sprite = getWeatherSprite(code);
                weatherIcon.src = BASE_PATH + "images/weather/" + sprite;
            })
            .catch(() => {
                weatherTemp.textContent = "Unavailable";
                weatherDesc.textContent = "Unavailable";
                weatherWind.textContent = "Unavailable";
                weatherIcon.src = BASE_PATH + "images/weather/NoData.png"
            });

    }

    loadWeather();

    // Update every 30 minutes
    setInterval(loadWeather, 1800000);
}
