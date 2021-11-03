let searchCity = function() {
    let cityName = document.getElementById('cityInput').value.trim();
    let currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=78a0a45b801ca58af49f2eee9dac4832";

    fetch(currentWeatherUrl).then(function(response) {
        //successful request
        if (response.ok) {
            response.json().then(function(data) {
                displayCurrentWeather(data);
                console.log(data)
            })
        }

        else {
            alert("Oops! We couldn't find that city. Try checking your spelling!");
        }
    })
    .catch(function(error) {
        alert("Connection error - please try again later :(");
    })
};

let displayCurrentWeather = function(data) {
    //set header with city and date
    let cityDate = document.getElementById("city-date");
    cityDate.textContent = data.name + "  " + moment().format("MM/DD/YYYY");

    //display icon
    let icon = document.getElementById("current-icon");
    icon.setAttribute("src","http://openweathermap.org/img/wn/"+ data.weather[0].icon + "@2x.png");

    //display temp
    let currentTemp = document.getElementById("current-temp");
    currentTemp.textContent = "Temp: " + data.main.temp + "°F and " + data.weather[0].main;

    //display wind
    let currentWind = document.getElementById("current-wind");
    currentWind.textContent = "Wind: " + data.wind.speed + "MPH";

    //display humidity
    let currentHumidity = document.getElementById("current-humidity");
    currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";
    //uv data cannot be obtained from this call; uv data will be added in other display function
}