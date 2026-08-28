// initialization of general variables
const input = document.getElementById("cityInput");
const button = document.getElementById("searchbutton");
const searchbox = document.querySelector(".search");
const backbutton = document.getElementById("backbutton");
const wet = document.getElementById("weather");
const hero = document.querySelector(".hero")
let showResult = false;

//buttons response
button.addEventListener("click", searchWeather);
backbutton.addEventListener("click", resetSearch);
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (showResult) {
            pressAnimate(backbutton);
            resetSearch();
        } else {
            pressAnimate(button);
            searchWeather();
        }
    }
});

//searching of weather (API calling and returning)
function searchWeather() {
    const city = input.value;

    console.log("City:", city);
    //api url
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

    console.log("Requesting:", url);
    //api fethcing
    fetch(url)
        .then(response => response.json())
        .then(data => {
            showResult = true;
            console.log("API RESPONSE:", data);
            if(!data.results || data.results.length === 0){
                console.log("City not found");
                return;
            }
            const location = data.results[0];
            const longitude = location.longitude;
            const latitude = location.latitude;
            
            
            // the api calling
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,precipitation,is_day&hourly=precipitation_probability`;
            return fetch(weatherUrl)
                .then(response => response.json())
                .then(weatherData =>{
                    console.log("Weather Response = " + weatherData)
                    //initialization og resut variables
                    const temp = weatherData.current.temperature_2m;
                    const hum = weatherData.current.relative_humidity_2m;
                    const code = weatherData.current.weather_code;
                    const precip = weatherData.current.precipitation;
                    const day = weatherData.current.is_day;
                    const rainchance = weatherData.hourly.precipitation_probability[0];
                    const condition = getConditionText(code);
                    const condi = document.getElementById("condition");
                    const coordinate = document.getElementById("coordinates");
                    const cityResult = document.getElementById("city");
                    const tempResult = document.getElementById("temperature");
                    const humResult = document.getElementById("humidity");
                    const precipResult = document.getElementById("precipitation");
                    const dayResult = document.getElementById("is_day");
                    const rainResult = document.getElementById("rainchance");
                    //printing of result variables
                    playAnimation(wet);
                    cityResult.textContent = `${city}, ${location.country}`;
                    coordinate.textContent = `Longitude: ${longitude}, Latitude: ${latitude}`;
                    tempResult.textContent = `Temperature: ${temp}`;
                    humResult.textContent = `Humidity: ${hum}%`;
                    condi.textContent = `Weather Condition: ${condition}`;
                    dayResult.textContent = `${day === 1 ? "☀️ Daytime" : "🌙 Nighttime"}`;
                    precipResult.textContent = precip > 0 
                        ? `🌧️ Currently raining: ${precip}mm` 
                      : `☀️ No rain right now`;
                        
                    rainResult.textContent = `Chance of Rain: ${rainchance}%`;
                    searchbox.classList.add("hidden");
                    backbutton.style.display = "inline-block";
                    hero.classList.add("hidden");
                    
                })



        })
        .catch(error => {
            console.error("ERROR:", error);
        });
}
// condition results
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
// deletion of result for another session/search
function resetSearch() {
    // show the search bar again, hide results + back button
    searchbox.classList.remove("hidden");
    hero.classList.remove("hidden")
    backbutton.style.display = "none";
    showResult = false;
    document.getElementById("city").textContent = "";
    document.getElementById("temperature").textContent = "";
    document.getElementById("condition").textContent = "";
    document.getElementById("coordinates").textContent = "";
    document.getElementById("precipitation").textContent = "";
    document.getElementById("humidity").textContent = "";
    document.getElementById("is_day").textContent = "";
    document.getElementById("rainchance").textContent = "";
    

    input.value = "";
}
//animations
function playAnimation(el){
    el.classList.remove("animate");
    void el.offsetWidth;    
    el.classList.add("animate");
}

function pressAnimate(el){
    el.classList.add("pressed");
    setTimeout(() =>{
        el.classList.remove("pressed");
    }, 200)
}