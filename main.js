const form = document.getElementById('searchForm');
const input = document.getElementById('cityInput');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weather = document.getElementById('weather');

const API_KEY = '2e786f962c7048f085bf1a2afca5e5f4';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = input.value.trim();

    if (!city) return;

    loading.classList.remove('hidden');
    error.classList.add('hidden');
    weather.classList.add('hidden');

    try {
        await fetchWeather(city);
        await fetchForecast(city); 
    } catch (err) {
        error.textContent = err.message;
        error.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
        input.value = '';
    }
});


async function fetchWeather(city) {
  
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    weather.classList.add('hidden');

    try {
       
        const url = `${API_URL}?q=${city}&units=metric&appid=${API_KEY}`;

       
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                response.status === 404
                    ? 'City not found'
                    : `Error: ${response.status}`
            );
        }

        const data = await response.json();

        displayWeather(data);

    } catch (err) {
      
        error.textContent = err.message;
        error.classList.remove('hidden');

    } finally {
       
        loading.classList.add('hidden');
    }
}

function displayWeather(data) {
    document.getElementById('cityName').textContent = 
        `${data.name}, ${data.sys.country}`;

    document.getElementById('temp').textContent = 
        `${Math.round(data.main.temp)}°C`;

    document.getElementById('description').textContent = 
        data.weather[0].description.charAt(0).toUpperCase() + 
        data.weather[0].description.slice(1);

    document.getElementById('details').textContent = 
        `Feels like ${Math.round(data.main.feels_like)}°C • ` + 
        `Humidity ${data.main.humidity}% • ` + 
        `Wind ${Math.round(data.wind.speed)} m/s`;

    weather.classList.remove('hidden');
}

const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';


async function fetchForecast(city) {
    try {
        const url = `${FORECAST_URL}?q=${city}&units=metric&appid=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                response.status === 404
                    ? 'Forecast not found'
                    : `Error: ${response.status}`
            );
        }

        const data = await response.json();
        displayForecast(data);

    } catch (err) {
        error.textContent = err.message;
        error.classList.remove('hidden');
    }
}


function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; // Clear previous forecast
    document.getElementById('forecast').classList.remove('hidden');

    const dailyForecasts = data.list.filter((item, index) => index % 8 === 0);

    dailyForecasts.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString(undefined, { weekday: 'short' });
        const temp = Math.round(item.main.temp);
        const desc = item.weather[0].description;

        const forecastEl = document.createElement('div');
        forecastEl.classList.add('forecast-day');
        forecastEl.textContent = `${day}: ${temp}°C, ${desc}`;
        forecastContainer.appendChild(forecastEl);
    });
}
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    const dailyForecasts = data.list.filter((item, index) => index % 8 === 0);

    dailyForecasts.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString(undefined, { weekday: 'short' });
        const temp = Math.round(item.main.temp);
        const desc = item.weather[0].description;

        const forecastEl = document.createElement('div');
        forecastEl.classList.add('forecast-day');

        forecastEl.innerHTML = `
            <strong>${day}</strong>
            <div class="temp">${temp}°C</div>
            <div class="desc">${desc}</div>
        `;

        forecastContainer.appendChild(forecastEl);
    });

    forecastContainer.classList.remove('hidden');
}
