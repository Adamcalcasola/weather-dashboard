var url1 = "https://api.openweathermap.org/data/2.5/weather?q="; //{city name}
var url2 = "https://api.openweathermap.org/data/2.5/onecall?lat=";
var exclude = "&exclude=minutely,hourly,alerts&units=imperial";
var apikey = "&cnt=5&appid=36d0f33999f6c3dd12f810521b14e6a4";



var cities = document.querySelector("#cities");
var searchButton = document.getElementById("search");

function displayForecast() {
    var forecastEl = document.getElementById("forecast");
    var rowEl = document.createElement("div");
    rowEl.classList = "row";
    forecastEl.appendChild(rowEl);

    for (i=0;i<5;i++) {

        var cardEl = document.createElement("div");
        var dateEl = document.createElement("div");
        var iconEl = document.createElement("div");
        var tempEl = document.createElement("div");
        var windEl = document.createElement("div");
        var humidityEl = document.createElement("div");
        
        cardEl.classList = "col-2 card";
        dateEl.classList = "key";
        iconEl.classList = "key";
        tempEl.classList = "key";
        windEl.classList = "key";
        humidityEl.classList = "key";

        dateEl.textContent = "Date: ";
        iconEl.textContent = "Icon: ";
        tempEl.textContent = "Temp: ";
        windEl.textContent = "Wind: ";
        humidityEl.textContent = "Humidity: ";

        rowEl.appendChild(cardEl);
        cardEl.appendChild(dateEl);
        cardEl.appendChild(iconEl);
        cardEl.appendChild(tempEl);
        cardEl.appendChild(windEl);
        cardEl.appendChild(humidityEl);
    }

}

function displayCity() {
    var citySearch = document.getElementById("city-search").value;
    document.getElementById("city").innerText = citySearch + moment().format(' (MM/DD/YY)');
    console.log(citySearch);

    fetch(url1 + citySearch + apikey)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
            console.log(data);
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;
            fetch(url2 + latitude + "&lon=" + longitude + exclude + apikey)
            .then(function(response) {
                return response.json();
            }).then(function(data) {
                console.log(data);
                var temperature = data.current.temp;
                var windSpeed = data.current.wind_speed;
                var humidity = data.current.humidity;
                var uvIndex = data.current.uvi;
                document.getElementById("temperature").textContent = "Temp: " + temperature + " F";
                document.getElementById("wind").textContent = "Wind: " + windSpeed + " MPH";
                document.getElementById("humidity").textContent = "Humidity: " + humidity + "%";
                document.getElementById("uvindex").textContent = "UV Index: " + uvIndex;
            })


        displayForecast();

    });

    
    var savedCity = document.createElement("button");
    savedCity.setAttribute("id", citySearch);
    savedCity.className = "search";
    savedCity.textContent = citySearch;
    cities.appendChild(savedCity);
    document.getElementById("city-search").value = "";
}

searchButton.addEventListener("click", displayCity);