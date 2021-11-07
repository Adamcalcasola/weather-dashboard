// Define Global Variables
var url1 = "https://api.openweathermap.org/data/2.5/weather?q=";
var url2 = "https://api.openweathermap.org/data/2.5/onecall?lat=";
var exclude = "&exclude=minutely,hourly,alerts&units=imperial";
var apikey = "&cnt=5&appid=36d0f33999f6c3dd12f810521b14e6a4";

var saveList = [];
var counter = 0;
var cities = document.querySelector("#cities");
var searchButton = document.getElementById("search");

// Function to save searched city to local storage and create button on screen to display again
function searchSave(city) {
    var savedCity = document.createElement("button");
    savedCity.setAttribute("id", city);
    savedCity.className = "search button";
    savedCity.textContent = city;
    savedCity.addEventListener("click", function() {
        displayCity(this.id);
    }) ;
    cities.appendChild(savedCity);
    saveList.push(city);
    localStorage.setItem("saveList", JSON.stringify(saveList));
    counter++;
}
// Loads previous searches from local storage and displays them as buttons
function loadSaved() {
    saveList = JSON.parse(localStorage.getItem("saveList")) || [];
    for(i=0;i<saveList.length;i++) {
        var savedCity = document.createElement("button");
        savedCity.setAttribute("id", saveList[i]);
        savedCity.className = "search button";
        savedCity.textContent = saveList[i];
        savedCity.addEventListener("click", function() {
            displayCity(this.id);
        }) ;
        cities.appendChild(savedCity);
    }
}
// Function to display current city searched 5 day forcast
function displayForecast(data) {
    var forecastEl = document.getElementById("forecast");
    forecastEl.innerHTML = "<h3>5-Day Forecast:</h3>";
    var rowEl = document.createElement("div");

    rowEl.classList = "row";

    forecastEl.appendChild(rowEl);

    for (i=0;i<5;i++) {
        var cardEl = document.createElement("div");
        var dateEl = document.createElement("div");
        var iconEl = document.createElement("img");
        var tempEl = document.createElement("div");
        var windEl = document.createElement("div");
        var humidityEl = document.createElement("div");

        cardEl.classList = "col-2 card";
        dateEl.classList = "key";
        tempEl.classList = "key";
        windEl.classList = "key";
        humidityEl.classList = "key";

        var iconImg = 'http://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '@2x.png';
        iconEl.setAttribute("src", iconImg);
    
        dateEl.textContent = moment().add(i+1, 'days').format(' MM/DD/YY');
        tempEl.textContent = "Temp: " + data.daily[i].temp.day + " F";
        windEl.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
        humidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";

        cardEl.appendChild(dateEl);
        cardEl.appendChild(iconEl);
        cardEl.appendChild(tempEl);
        cardEl.appendChild(windEl);
        cardEl.appendChild(humidityEl);
        rowEl.appendChild(cardEl);
    }
}
// Function to display searched city's weather stats
function displayCity(citySearch) {
    if (!citySearch) {
        return false;
    }
    fetch(url1 + citySearch + apikey)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        var currentCity = data.name;
        var latitude = data.coord.lat;
        var longitude = data.coord.lon;
        fetch(url2 + latitude + "&lon=" + longitude + exclude + apikey)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            var iconMain = document.createElement("img");
            var iconSrc = 'http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png';
            iconMain.setAttribute("src", iconSrc);
            
            var temperature = data.current.temp;
            var windSpeed = data.current.wind_speed;
            var humidity = data.current.humidity;
            var uvIndex = data.current.uvi;

            document.getElementById("city").textContent = currentCity + moment().format(' (MM/DD/YY)') + " ";
            document.getElementById("city").appendChild(iconMain);
            document.getElementById("temperature").textContent = "Temp: " + temperature + " F";
            document.getElementById("wind").textContent = "Wind: " + windSpeed + " MPH";
            document.getElementById("humidity").textContent = "Humidity: " + humidity + "%";
            document.getElementById("uvindex").textContent = "UV Index: ";// + uvIndex;

            var uvBox = document.createElement("div");
            uvBox.setAttribute("id", "uv-box");
            uvBox.textContent = uvIndex;
            document.getElementById("uvindex").appendChild(uvBox);

            // changes color of UV Index Box based on Value
            if (uvIndex < 3) {
                document.getElementById("uv-box").style.backgroundColor = "green";
            } else if (uvIndex < 6) {
                document.getElementById("uv-box").style.backgroundColor = "yellow";
            } else if (uvIndex < 8) {
                document.getElementById("uv-box").style.backgroundColor = "orange";
            } else if (uvIndex < 11) {
                document.getElementById("uv-box").style.backgroundColor = "red";
            } else {
                document.getElementById("uv-box").style.backgroundColor = "violet";
            }
            displayForecast(data);
        })
    });    
    document.getElementById("city-search").value = "";
}

// Loads previous city searches from local storage
loadSaved();

// Event listner to call functions to display city and save city when search button is clicked
searchButton.addEventListener("click", function() {
    var citySearch = document.getElementById("city-search").value;
    displayCity(citySearch);
    searchSave(citySearch);
});