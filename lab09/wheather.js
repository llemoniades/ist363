async function fetchWeather() 
{
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.04&longitude=-76.14&current=temperature_2m,precipitation,cloud_cover&temperature_unit=fahrenheit&precipitation_unit=inch');
    const data = await response.json();

    const temp = data.current.temperature_2m;
    const precipitation = data.current.precipitation;
    const cloudCover = data.current.cloud_cover;
    let cloudEmoji;
    if (cloudCover > 50) {
        cloudEmoji = '☁️'; 
    } else {
        cloudEmoji = '☀️'; 
    }

    document.getElementById('weather-data').innerHTML = `
        Precipitation: ${precipitation}"<br>
        Temperature: ${temp}°F
        ${cloudEmoji}
    `;
}

document.addEventListener('DOMContentLoaded', fetchWeather);
