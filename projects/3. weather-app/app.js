async function fetchWeather() {

    // Step a. Create global variables and start inner functions
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";

    const apiKey = "API KEY HERE!"; // insert your API key here 

    if(searchInput == "") {
        weatherDataSection.innerHTML = `
        <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        `;
        return;
    }

    // Step b. Get lat and lon coordinates via Geocoding API
    async function getLonAndLat() {
        const countryCode = 27;
        geocodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`
        
        // fetching lat and lon corrdinates from the API (using fetch() method)
        const response = await fetch(geocodeURL);
        if(!response.ok) {
          console.log("Bad response! ", response.status);
          return;
        }

        const data = await response.json();
        if(data.length == 0) {
            console.log("Something went wrong here.");
            weatherDataSection.innerHTML = `
            <div>
            <h2>Invalid Input: "${searchInput}"</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
            </div>
            `;
            return;
        } else {
            return data[0];
        }
        
    }
      
    async function getWeatherData(lon, lat) {

        // Step c. Get weather information via Current Weather API
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
        
        // Step d. Display the weather data
        const response = await fetch(weatherURL);
        if(!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }

        const data = await response.json();
        weatherDataSection.style.display = "flex";
        weatherDataSection.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
        <div>
            <h2>${data.name}</h2>
            <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
            <p><strong>Description:</strong> ${data.weather[0].description}</p>
        </div>
        `
        
    }

    document.getElementbyId("search").value = "";
    const geocodeData = await getLonAndLat();
    getWeatherData(geocodeData.lon, geocodeData.lat);
}

