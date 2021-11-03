let searchCity = function() {
    let cityName = document.getElementById('cityInput').value.trim();
    let currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=78a0a45b801ca58af49f2eee9dac4832";

    fetch(currentWeatherUrl).then(function(response) {
        //successful request
        if (response.ok) {
            response.json().then(function(data) {
                displayCurrentWeather(data);
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
    let cityDate = document.getElementById("city-date");
    cityDate.textContent = data.name + "  " + moment().format("MM/DD/YYYY");
}