const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require('ejs');
require('dotenv').config()

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.render("index");
});

app.post("/", function(req, res) {
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function(response) {
        console.log(response.statusCode);

        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            const result = {
                city: query,
                temperature: temp,
                description: weatherDescription,
                icon: imageURL
            };
            res.render("weather", { result: result });
        });
    });
});

app.listen(3000, function() {
    console.log("server is running on port 3000");
});