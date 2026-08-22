const input = document.getElementById("cityInput");
const button = document.getElementById("searchbutton");

button.addEventListener("click", searchWeather);

function searchWeather() {
    const city = input.value;

    console.log("City:", city);

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

    console.log("Requesting:", url);

    fetch(url)
        .then(response => response.json())
        .then(data => {

            console.log("API RESPONSE:", data);
            if(!data.results || data.results.length === 0){
                console.log("City not found");
                return;
            }
            const location = data.results[0];
            const longitude = location.longitude;
            const latitude = location.latitude;
            
            
    
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;
            return fetch(weatherUrl)
                .then(response => response.json())
                .then(weatherData =>{
                    console.log("Weather Response = " + weatherData)

                    const temp = weatherData.current.temperature_2m;
                    const code = weatherData.current.weather_code;
                    const condition = getConditionText(code);
                    const condi = document.getElementById("condition");
                    const coordinate = document.getElementById("coordinates");
                    const cityResult = document.getElementById("city");
                    const tempResult = document.getElementById("temperature");

                    cityResult.textContent = `${city}`;
                    coordinate.textContent = `Longitude: ${longitude}, Latitude: ${latitude}`;
                    tempResult.textContent = `Temperature: ${temp}`;
                    condi.textContent = `Weather Condition: ${condition}`;
                })



        })
        .catch(error => {
            console.error("ERROR:", error);
        });
}

function getConditionText(code) {
    const codes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        80: "Rain showers",
        95: "Thunderstorm"
    };
    return codes[code] || "Unknown conditions";
}