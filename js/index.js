// Credits to louispretends for these snippets. I really liked it on his site.

// Time
const timeElement = document.getElementById("local-time");

if (timeElement) {
    const timezone = Intl.DateTimeFormat([], { timeZoneName: "short" })
        .formatToParts(new Date())
        .find((p) => p.type === "timeZoneName").value;

    function updateTime() {
        timeElement.textContent =
            new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }) +
            " " +
            timezone;
    }

    updateTime();
    setInterval(updateTime, 1000);
}

// Weather

// Wind speed descriptions (km/h) named based on Beaufort Wind Scale.
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

// Weather groups name and group based on WMO 4677 codes.
const weatherGroups = [
    {
        range: [0, 1],
        desc: "Clear Sky",
        iconDay: "Clear_Day.png",
        iconNight: "Clear_Night.png",
    },

    {
        range: [2, 2],
        desc: "Cloudy",
        iconDay: "Cloudy.png",
        iconNight: "Cloudy.png",
    },

    {
        range: [3, 5],
        desc: "Overcast",
        iconDay: "Overcast.png",
        iconNight: "Overcast.png",
    },

    {
        range: [40, 49],
        desc: "Fog",
        iconDay: "Fog.png",
        iconNight: "Fog.png",
    },

    // Drizzle group (WMO 50–59)
    {
        range: [50, 59],
        desc: "Drizzle",
        iconDay: "Drizzle.png",
        iconNight: "Drizzle.png",
    },

    // Rain group (WMO 60–69)
    {
        range: [60, 69],
        desc: "Rain",
        iconDay: "Rain.png",
        iconNight: "Rain.png",
    },

    // Snowfall group (WMO 70–79)
    // snow in singapore haha imagine :,)
    {
        range: [70, 79],
        desc: "Snow",
        iconDay: "Snow.png",
        iconNight: "Snow.png",
    },

    // Rain showers (WMO 80–84)
    {
        range: [80, 84],
        desc: "Rain Showers",
        iconDay: "RainShowers.png",
        iconNight: "RainShowers.png",
    },

    // Thunderstorm (WMO 95–99)
    {
        range: [95, 99],
        desc: "Thunderstorm",
        iconDay: "Storm.png",
        iconNight: "Storm.png",
    },
];

function getWeatherInfo(code, isDay) {
    for (const group of weatherGroups) {
        // If excluded number, skip.
        if (group.exclude && group.exclude.includes(code)) {
            continue;
        }

        // If included, set.
        if (group.include && group.include.includes(code)) {
            return {
                desc: group.desc,
                icon: isDay ? group.iconDay : group.iconNight,
            };
        }

        // Check range.
        if (group.range && code >= group.range[0] && code <= group.range[1]) {
            return {
                desc: group.desc,
                icon: isDay ? group.iconDay : group.iconNight,
            };
        }
    }

    return {
        desc: "Unknown",
        icon: "NoData.png",
    };
}

// DOM elements
const weatherTemp = document.getElementById("weather-temp");
const weatherDesc = document.getElementById("weather-desc");
const weatherWind = document.getElementById("weather-wind");
const weatherIcon = document.getElementById("weather-icon");

// Main weather loader
if (weatherTemp && weatherDesc && weatherWind && weatherIcon) {
    function loadWeather() {
        fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=1.3551&longitude=103.9901&current=temperature_2m,is_day,weather_code,wind_speed_10m&timezone=Asia%2FSingapore&forecast_days=1",
        )
            .then((res) => res.json())

            .then((data) => {
                const temp = data.current.temperature_2m;
                const code = data.current.weather_code;
                const wind = data.current.wind_speed_10m;
                const isDay = data.current.is_day === 1;

                const weather = getWeatherInfo(code, isDay);

                weatherTemp.textContent = temp + "°C";

                weatherDesc.textContent = weather.desc;

                weatherWind.textContent = getWindDescription(wind) + " (" + wind + " km/h)";

                weatherIcon.src = "../images/weather/" + weather.icon;
            })

            .catch(() => {
                weatherTemp.textContent = "Unavailable";
                weatherDesc.textContent = "Unavailable";
                weatherWind.textContent = "Unavailable";
                weatherIcon.src = "../images/weather/NoData.png";
            });
    }

    // Initial load
    loadWeather();

    // Refresh every 30 minutes
    setInterval(loadWeather, 1800000);
}

// Date Functions
let currTime = new Date();
const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "Sepember", "October", "November", "December"];

function SetDate() {
    let currYear = currTime.getFullYear();
    let currMonth = currTime.getMonth();
    let currdow = currTime.getDay();
    if (currdow == 0) {
        currdow = 7;
    }
    let html = "<h2>" + Months[currMonth] + '</h2><table id="date-table"><tr>';

    // Find DoW of the First Day of the Month
    let firstday = new Date(currYear, currMonth, 1).getDay();
    if (firstday == 0) {
        firstday = 7;
    }

    // Find Number of days in the month
    let daysInMonth = new Date(currYear, currMonth + 1, 0).getDate();

    html += '<tr style="color: var(--lt_violet)"><td>M</td><td>T</td><td>W</td><td>T</td><td>F</td><td>S</td><td>S</td></tr>';

    // Create all of the blank cells for the first week.
    for (i = 1; i < firstday; i++) {
        html += "<td></td>";
    }
    // Make a loop that creates all of the rows and columns and adds them to the html
    for (d = 1; d <= daysInMonth; d++) {
        if (d == currTime.getDate()) {
            html += '<td id="today">' + d + "</td>";
        } else {
            html += "<td>" + d + "</td>";
        }
        if ((d + firstday - 1) % 7 == 0) {
            html += "</tr><tr>";
        }
    }
    document.getElementById("date-header").innerHTML = html;
}

SetDate();
