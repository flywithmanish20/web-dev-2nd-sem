// 🔑 Put your OpenWeather API Key here
const API_KEY = "YOUR_API_KEY";

// Load history from localStorage
let history = JSON.parse(localStorage.getItem("history")) || [];

// Run when page loads
window.onload = () => {
    displayHistory();
};

// ================= WEATHER BY CITY =================
async function getWeather(cityName) {
    try {
        let cityInput = document.getElementById("city");
        let city = cityName || cityInput.value.trim();

        if (!city) {
            alert("Please enter a city name");
            return;
        }

        // Fetch current weather
        let res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        let data = await res.json();

        if (data.cod !== 200) {
            document.getElementById("weather").innerHTML = `<p>❌ City not found</p>`;
            return;
        }

        displayWeather(data);
        getForecast(city);
        saveHistory(city);

    } catch (error) {
        console.error(error);
        alert("Something went wrong!");
    }
}

// ================= DISPLAY CURRENT WEATHER =================
function displayWeather(data) {
    let weatherDiv = document.getElementById("weather");

    weatherDiv.innerHTML = `
        <h2>${data.name}</h2>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
        <p>${data.weather[0].main}</p>
        <h3>${data.main.temp} °C</h3>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s</p>
    `;
}

// ================= 5 DAY FORECAST =================
async function getForecast(city) {
    try {
        let res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );

        let data = await res.json();

        let forecastDiv = document.getElementById("forecast");
        forecastDiv.innerHTML = "";

        // Filter one per day (12:00)
        let daily = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

        daily.forEach(day => {
            forecastDiv.innerHTML += `
                <div class="day">
                    <p>${day.dt_txt.split(" ")[0]}</p>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                    <p>${day.main.temp}°C</p>
                </div>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}

// ================= LOCATION WEATHER =================
function getLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(async position => {
        try {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            let res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );

            let data = await res.json();

            displayWeather(data);
            getForecast(data.name);

        } catch (error) {
            console.error(error);
        }
    }, () => {
        alert("Location permission denied");
    });
}

// ================= HISTORY =================
function saveHistory(city) {
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem("history", JSON.stringify(history));
        displayHistory();
    }
}

function displayHistory() {
    let div = document.getElementById("history");
    if (!div) return;

    div.innerHTML = "";

    history.forEach(c => {
        let span = document.createElement("span");
        span.innerText = c;
        span.onclick = () => getWeather(c);
        div.appendChild(span);
    });
}

// ================= DARK MODE =================
function toggleDark() {
    document.body.classList.toggle("dark");
}