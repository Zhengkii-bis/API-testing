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
            if(!data.result || data.result.length == 0){
                console.log("City not found");
                return;
            }
            const location = data.result[0];
            const longtitude = location.longtitude;
            const latitude = location.latitude;

            console.log("Longtitude: " + longtitude);
            console.log("Latitude: " + latitude);

        })
        .catch(error => {
            console.error("ERROR:", error);
        });
}