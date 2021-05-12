const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname+"/index.html");
});

app.post("/", function(req, res) {
  var city = req.body.City;
  var unit =req.body.Options;
  var tempunit;
  if(unit=="kelvin"){
    tempunit="standard";
  }
  else if (unit=="celsius") {
    tempunit="metric";
  }
  else if(unit=="fahrenheit"){
    tempunit="imperial";
  }
  console.log(city+"  "+unit+"  "+tempunit);

  var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=5bf67ec62d8324ee30cd57cfd38d05ea&units=" + tempunit + "#";

  https.get(url, function(response) {
    var status = response.statusCode;
    if (status === 200) {

      response.on("data", function(data) {
        var D = JSON.parse(data);
        const T = D.main.temp;
        const Des = D.weather[0].description;
        const Pic = D.weather[0].icon;
        const icon = "http://openweathermap.org/img/wn/" + Pic + "@4x.png";
        console.log(T);
        console.log(Des);

        res.write("<p> The weather is currently " + Des + "</p>");
        res.write("<h1>The temperature in "+city+" is " + T + " degree "+unit+".</h1>");
        res.write("<img src=" + icon + ">");
        res.send();
      });
    } else {
      res.write("<h1>City Not Found<h1>")
    }
  });
})

app.listen(3000, function() {
  console.log("Listening at port 3000");
});
