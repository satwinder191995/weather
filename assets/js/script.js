var button = document.querySelector(".button");
// var key = "985902aba2eb134a3aa463f3543e40f5";
var key = "de41c9b56aaee5df58270392a4a59061";
var searchedCity =[];

//Appending forecast in front page
var dailyForecast = function(data,i){
    console.log(i);
    var days = "days"+i;
    var date = moment.unix(data.daily[i].dt).format("DD/MM/YYYY");
    console.log(date);
    $(".dayForecast").append("<div class='"+days+" col-lg-2 bg-primary text-white m-3 pl-2 remove'></div>");
    $(".days"+i).append("<p>"+date+"</p>");
    var icon = "http://openweathermap.org/img/wn/"+data.daily[i].weather[0].icon+".png";
    console.log(icon);
    $(".days"+i).append("<img src='"+icon+"' alt='"+data.daily[i].weather[0].description+"'></img>");
    $(".days"+i).append("<p>Temp:  "+data.daily[i].temp.max+"<span>  &#8457;</span></p>");
    $(".days"+i).append("<p>Wind:  "+data.daily[i].wind_speed+"  MPH</p>");
    
    $(".days"+i).append("<p>Humidity:  "+data.daily[i].humidity+"  %</p>");

}

// fetch api used for 5 days
var weather = function(lat,lon,name){
    var url = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&exclude={part}&appid="+key;
    fetch(url).then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data)
        $(".image")
        .attr("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png")
        .attr("alt", data.current.weather[0].description);
        $(".temp").text("Temp:  "+data.current.temp);
        $(".wind").text("Wind:  "+data.current.wind_speed+"  MPH");
        $(".humidity").text("Humidity:  "+data.current.humidity+"  %");
         $(".uv").text(data.current.uvi);

         if (data.current.uvi <= 2) {
            $(".uv").addClass("bg-success text-white");
        } else if (data.current.uvi <= 5) {
            $(".uv").addClass("bg-warning text-dark");
        } else {
            $(".uv").addClass("bg-danger text-white");
        }
        var i = 0;
        var storedValue = {
            "city":name
        }
        var load = loadvalues();
        if(load != null){
        console.log(load);

        console.log("length"+load.length);
        var matched = false;
        console.log("loacal storage:"+load[i].city);
        console.log("value:"+storedValue.city);
        for(i=0; i < load.length; i++) {
            if(load[i].city === storedValue.city){
                
                console.log("matched")
                matched = true;
            }else{
                console.log("unmatched")
                
    }
}
        }
     if(matched == false){   
        load.push(storedValue); 
        console.log("sunny");
        // load.push(storedValue);
        localStorage.setItem("cities", JSON.stringify(load));   
     }
        console.log("array"+ load);
                 for(var i=0;i<load.length;i++){
         $(".searched").append("<button class=' removeButton w-75 mt-2 text-center' id='"+load[i].city+"'>"+load[i].city+"</button>")
         }
        for(var i=0;i<5;i++){
        dailyForecast(data,i);
        }
});
}

// fetch api used to get longitude and latitude
var gLocation = function(city){
    console.log("city is"+city)
    $(".remove").remove();
    var url = "https://api.openweathermap.org/geo/1.0/direct?q="+city+"&appid="+key;
    fetch(url).then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data)
    var name = data[0].name;
    var today = moment().format("DD/MM/YYYY");
     $(".cityName").text(name+"  ("+today+"  )");
   
     var lat = data[0].lat;
     var lon = data[0].lon;
     console.log(lat,lon,name);
     weather(lat,lon,name);
});
}
var first = localStorage.getItem("cities"); 
if (first  == null){
gLocation("brampton");
var initial = [{
    "city":"Brampton"
}];
localStorage.setItem("cities", JSON.stringify(initial)); 
}else{
    gLocation("brampton");
}



// to get values from the local storage
var loadvalues = function(){
    var getCities =localStorage.getItem("cities");
     console.log("cities are:"+ getCities)
     if (getCities === null || getCities === ""){
         console.log("null");


     }else{
         console.log("not null");
         searchedCity=JSON.parse(getCities);
         console.log("cities"+searchedCity[0].city);
         console.log("get cities"+ searchedCity.length);
     }
     return searchedCity;
     

 }

$(".button").click(function(e){
    e.preventDefault();
    var city = $(".city").val();
    $(".removeButton").remove();
    gLocation(city);

})

$(".searched").on("click", function(event) {
    var action = event.target.id;
    $(".removeButton").remove();
    gLocation(action);
})