fetch("https://api.openweathermap.org/data/2.5/weather?q=Boston&appid=78a0a45b801ca58af49f2eee9dac4832").then(function(response) {
       return  response.json()
}).then(function(data) {
            console.log(data);
        });