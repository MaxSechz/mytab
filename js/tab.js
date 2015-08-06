$(document).ready(function(){

  var getCity = function(){
    return "NYC";
  };

  //

  var dateStamp = function(){
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
                'Thursday', 'Friday', 'Saturday'];

    var months = ['January', 'February', 'March', 'April',
                  'May', 'June', 'July', 'August', 'September',
                  'October', 'November', 'December'];

    var stamp;
    var t = new Date();

    stamp = days[t.getDay()].substring(0,3) + ", ";
    stamp += months[t.getMonth()].substring(0,3) + " ";
    stamp += t.getDate();

    return stamp;
  }();

  var timeStamp = function(){
    var t = new Date();
    var hours = t.getHours();

    return dateStamp + ", " + hours;
  }();

  //

  var Clock = function(){

    var $el = $("#clock");

    function updateClock(){
      var currentTime = new Date();
      var currentHours = currentTime.getHours();
      var currentMinutes = currentTime.getMinutes();
      currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;

      $el.html(currentHours + ":" + currentMinutes);
    }

    updateClock();
    var intervalID = window.setInterval(updateClock, 10000);

  };

  //

  var Weather = function(){
    var weatherId = (getCity() == "SF") ? 5391959 : 5128581;
    var url = "http://api.openweathermap.org/data/2.5/weather?id=" + weatherId + "&units=metric";
    var weather = JSON.parse(localStorage["weather"] || "{}");

    function cToF(c){
      return parseInt((c * 9 / 5) + 32);
    }

    function displayWeather(obj){
      var c = parseInt(obj.main.temp);

      var html = ["<em class='weather-left'>",
          getCity(),
          " / ",
          obj.weather[0].main,
          "<span> &mdash; ",
          obj.weather[0].description,
          "</span></em>",
          "<em class='weather-right'><span>",
          cToF(c),
          "&deg; F / </span>",
          c,
          "&deg; C",
          "</em>"
      ].join('');

      $("header").prepend(html);

    }

    if(weather && weather.timeStamp == timeStamp){
      displayWeather(weather);
    } else {

      $.getJSON(url, function(data){

        weather = data;
        weather.timeStamp = timeStamp;
        localStorage["weather"] = JSON.stringify(weather);

        displayWeather(weather);
      });
    }
  };
  var currentSearch;
  var setupSearches = function () {
      var searches = {
          "#ruby-search": "http://ruby-doc.com/search.html?q=",
          "#javascript-search": "https://developer.mozilla.org/en-US/search?topic=js&q=",
          "#markup-search": "https://developer.mozilla.org/en-US/search?topic=api&topic=css&topic=html&q=",
          "#ruby-eco-search": "https://rubygems.org/search?utf8=%E2%9C%93&query=",
          "#javascript-eco-search": "https://www.npmjs.com/search?q="
      };
      Object.keys(searches).forEach(function (id, index, searchesIds) {
          $(id).on('click', function () {
              $('#search').focus();
              currentSearch = searches[id];
          });
      });
  };

  var setupSearch = function () {
      setupSearches();
      $('#search').on('keydown', function (e) {
           if (e.keyCode === 13) {
               window.location = currentSearch + $(e.currentTarget).val();
           }
       });
  };

  var setupLocalHost = function () {
      var localInput = $('#local-input');

      $('#local-link').click(function (e) {
          e.preventDefault();
          window.open('http://localhost:' + localInput.val());
      });
  };

  setupLocalHost();
  setupSearch();
  Clock();
  Weather();
});
