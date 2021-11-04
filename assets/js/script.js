var myCitiesArray = [];
var favDataArray = [];

//function to fetch city data
let searchCity = function() {
    let cityName = document.getElementById('cityInput').value.trim();
    let currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=78a0a45b801ca58af49f2eee9dac4832";
    //save for history/my cities section

    fetch(currentWeatherUrl).then(function(response) {
        //successful request
        if (response.ok) {
            response.json().then(function(data) {
                displayCurrentWeather(data);
                fiveDayFetcher(data);
                citySaver(cityName);
                cityLoader();
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
//function to display weather in current weather box
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
//function to collect data for 5 day forecast and UV index
let fiveDayFetcher = function(data) {
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let fiveDayApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly,alerts&appid=78a0a45b801ca58af49f2eee9dac4832";

    fetch(fiveDayApiUrl).then(function(response) {
        response.json().then(function(newData) {
            fiveDayDisplay(newData);
        })
    })
};

//function to display UVI and 5 day info
let fiveDayDisplay = function(newData) {
    //display current UVI
    let currentUV = document.getElementById("current-uv");
    currentUV.textContent = "UV Index: " + newData.current.uvi;
    //set uvi colors
    if (newData.current.uvi <= 2) {
        currentUV.classList.add("uvi-low");
    }
    else if (newData.current.uvi>2 && newData.current.uvi<=5) {
        currentUV.classList.add("uvi-moderate");
    }
    else if (newData.current.uvi>5) {
        currentUV.classList.add("uvi-high");
    };

    //create arrays for 5 day data
    for (let i = 1; i < 6; i++) {
        var fiveDayData = [
            {date: moment().add(i,'day').format("MM/DD/YYYY")},
            {icon: newData.daily[i].weather[0].icon},
            {temp: newData.daily[i].temp.day + "°F and " + newData.daily[i].weather[0].main},
            {wind: newData.daily[i].wind_speed + "MPH"},
            {humidity: newData.daily[i].humidity + "%"},
            {uv: newData.daily[i].uvi}
        ]
        let fiveDayDate = document.getElementById("date"+i);
        fiveDayDate.textContent = fiveDayData[0].date;

        let fiveDayIcon = document.getElementById("icon"+i);
        fiveDayIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + fiveDayData[1].icon + "@2x.png");

        let fiveDayTemp = document.getElementById("temp"+i);
        fiveDayTemp.textContent = "Temp: " + fiveDayData[2].temp;

        let fiveDayWind = document.getElementById("wind"+i);
        fiveDayWind.textContent = "Wind: " + fiveDayData[3].wind;

        let fiveDayHumidity = document.getElementById("humidity"+i);
        fiveDayHumidity.textContent = 'Humidity: ' + fiveDayData[4].humidity;

        let fiveDayUv = document.getElementById("uv"+i);
        fiveDayUv.textContent = 'UV Index: ' + fiveDayData[5].uv;
        //set uvi colors
        if (fiveDayData[5].uv <= 2) {
            fiveDayUv.classList.add("uvi-low");
        }
        else if (fiveDayData[5].uv>2 && fiveDayData[5].uv<=5) {
            fiveDayUv.classList.add("uvi-moderate");
        }
        else if (fiveDayData[5].uv>5) {
            fiveDayUv.classList.add("uvi-high");
        };

    }
};

let citySaver = function(cityName) {
    if (myCitiesArray.includes(cityName) === false) {
        myCitiesArray.push(cityName);
        localStorage.setItem("myCities", JSON.stringify(myCitiesArray))
    }
};

let cityLoader = function() {
    myCitiesArray = JSON.parse(localStorage.getItem("myCities"));
    if (!myCitiesArray) {
        myCitiesArray = [];
    }
    else {
        let historyEl = document.getElementById("button-holder");
        historyEl.innerHTML = "";
        for (let i = 0; i < myCitiesArray.length; i++) {
            let historyButtonEl = document.createElement("button");
            historyButtonEl.textContent = myCitiesArray[i];
            historyButtonEl.setAttribute("id","history"+i);
            document.getElementById('button-holder').appendChild(historyButtonEl);

            fetch("https://api.openweathermap.org/data/2.5/weather?q=" + myCitiesArray[i] + "&units=imperial&appid=78a0a45b801ca58af49f2eee9dac4832").then(function(response) {
                if (response.ok) {
                    response.json().then(function(favoriteData) {
                        document.getElementById("history"+i).addEventListener("click", function(){
                            displayCurrentWeather(favoriteData);
                            fiveDayFetcher(favoriteData);
                        });
                    });
                }
            })
            .catch(function(error) {
                alert("We were unable to load your previous searches - please try again later :(");
            })
            

        };
    };
    
};

document.getElementById('searchForm').addEventListener("submit", function(event){
    event.preventDefault();
    searchCity();
});

document.getElementById('searchBtn').addEventListener("click", searchCity);

cityLoader();