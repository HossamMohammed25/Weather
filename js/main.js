"use strict";
let search = document.getElementById("search");
let submit = document.getElementById("submit");
let toggleModeButton = document.getElementById("toggleMode");
let locationBtn = document.getElementById("locationBtn")

document.addEventListener("DOMContentLoaded", function () {
    let navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
            navbar.classList.replace('py-5', 'py-3');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.replace('py-3', 'py-5');

        }
    });
});

submit.addEventListener('click', function () {
    let location = search.value;
    if (location) {
        gatData(location);
        clearInput()
    }
});
search.addEventListener('input', function () {
    let location = search.value;
    if (location) {
        gatData(location);
    }
});

document.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
        let location = search.value;
        gatData(location);
        clearInput()
    }
});


toggleModeButton.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    let icon = toggleModeButton.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

locationBtn.addEventListener("click", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            gatData(`${lat},${lon}`);
        }

        )
    }
})
function clearInput(){
    search.value = "";
}

async function gatData(location = 'cairo') {
    try {
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=5837e9fcaaf448a7a43200837241706&days=8&q=${location}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        display(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function addOneHour(timeStr) {
    let [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    let date = new Date();
    date.setHours(hours, minutes);
    date.setHours(date.getHours() + 1);
    let newHours = date.getHours();
    let newMinutes = date.getMinutes().toString().padStart(2, '0');
    period = newHours >= 12 ? 'PM' : 'AM';
    newHours = newHours % 12 || 12;
    return `${newHours}:${newMinutes} ${period}`;
}

function display(data) {
    let box = ``;
    for (let i = 0; i < data.forecast.forecastday.length; i++) {
        let forecastDay = data.forecast.forecastday[i];
        let sunrise = addOneHour(forecastDay.astro.sunrise);
        let sunset = addOneHour(forecastDay.astro.sunset);
        if (i == 0) {
            box += `
                <div class="col-md-4">
                    <div class="today forecast shadow-lg">
                        <div class="forecast-header d-flex justify-content-between pb-0">
                            <p>${new Date(forecastDay.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                            <p>${new Date(forecastDay.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</p>
                        </div>
                        <div class="forecast-content" id="current">
                            <div class="location "><i class="fa-solid fa-city text-info me-2"  title="City"></i> ${data.location.name}  </div>
                            <div class="degree">
                                <div class="num text-danger">${data.current.temp_c}<sup>o</sup>C</div>
                                <div class="d-flex justify-content-between text-muted ">
                                <div title="Min temperature" class="temp">${forecastDay.day.maxtemp_c}<sup> o</sup>C <i class="fa-solid fa-temperature-high text-danger"></i></div>
                                <div title="Max temperature" class="temp">${forecastDay.day.mintemp_c}<sup> o</sup>C  <i class="fa-solid fa-temperature-low text-primary"></i></div>
                                </div>
                                

                                </div>
                                <div class="forecast-icon d-flex justify-content-between align-items-center ">
                                    
                                  <img src="https:${data.current.condition.icon}" alt="" width="65">
                                  <div class="custom">${data.current.condition.text}</div>
                                  </div>
                                  <div class="d-flex justify-content-around align-items-center ">
                                  <div class="sunrise">
                                  
                                  <i class="fa-solid fa-sun text-warning py-3"></i> <p class="text-warning d-inline-block">Sunrise  </p>
                                 <p> ${sunrise} </p>
                                  </div>
                                  <div class="sunset">
                                 <i class="fa-regular fa-moon text-success me-2 py-3"></i><p class="text-success d-inline-block"> Sunset</p>
                                 <p> ${sunset} </p>

                                  </div>
                                  </div>
                                  
                                  <div class="d-flex justify-content-evenly align-items-center pt-4 bordert">

                                  <span><i class="fa-solid fa-umbrella fs-5 me-2 temp" title="Rain"></i>${forecastDay.day.daily_chance_of_rain}%</span>
                                  <span><i class="fa-solid fa-wind fs-5 me-2 temp" title="Wind"></i>${data.current.wind_kph} km/h</span>
                                  <span><i class="fa-solid fa-droplet fs-5 me-2 temp" title="Humidity"></i>${data.current.humidity}</span>
                                  
                                  </div>
                                  </div>
                    </div>
                </div>
            `;

        } else if(i==1 || i==2) {
            box += `
             <div class="col-md-4">
          <div class=" forecast shadow-lg">
            <div class="forecast-header d-flex justify-content-between pb-0">
              <p>${new Date(forecastDay.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
              <p>${new Date(forecastDay.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</p>
            </div>
            <div class="forecast-icon text-center d-block">
              <img  src="https:${forecastDay.day.condition.icon}" alt="" width="85">
              </div>
              <div class="degree">
                <div class="text-center">
                  <div class="text-danger py-2 fs-3 fw-bold" title="Max temperature">${forecastDay.day.maxtemp_c}<sup> o</sup>C  <i class="fa-solid fa-temperature-high text-danger"></i></div>
                  <div class=" fs-4 fw-bold temp" title="Min temperature">${forecastDay.day.mintemp_c}<sup> o</sup>C  <i class="fa-solid fa-temperature-low text-primary"></i></div>
                </div>

                <div class="custom text-center">${forecastDay.day.condition.text}</div>
              <div class="d-flex justify-content-around align-items-center  ">
                <div class="sunrise">
                  <i class="fa-solid fa-sun text-warning me-2"></i><p class="text-warning d-inline-block">Sunrise  </p> 
                                 <p> ${sunrise} </p>
                </div>
                <div class="sunset">
                  <i class="fa-regular fa-moon text-success me-2"></i> <p class="text-success d-inline-block">Sunset  </p>
                                 <p> ${sunset} </p>
                </div>
              </div>
             <div class="">

                                 <div class="d-flex justify-content-evenly align-items-center pt-4">

                                  <span><i class="fa-solid fa-umbrella fs-5 me-2 temp" title="Rain"></i>${forecastDay.day.daily_chance_of_rain}%</span>
                                  <span><i class="fa-solid fa-wind fs-5 me-2 temp" title="Max Wind"></i>${forecastDay.day.maxwind_kph} km/h</span>
                                  <span><i class="fa-solid fa-droplet fs-5 me-2 temp" title="Avg Humidity"></i>${forecastDay.day.avghumidity}</span>
                                  
                                </div>
  
            </div>
            </div>
          </div>
        </div>
        `;
        } else{
            box += `
        <div class="col-md-2">
    <div class="forecast h-auto shadow-lg">
      <div class="forecast-header-mini text-center">
        <p class="mb-0">${new Date(forecastDay.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
      </div>
      <div class="forecast-icon text-center d-block">
        <img src="https:${forecastDay.day.condition.icon}" alt="" width="60">
      </div>
      <div class="degree">
        <div class="text-center">
          <div class="text-danger fs-5 fw-semibold" title="Max temperature">${forecastDay.day.maxtemp_c}<sup> o</sup>C
            <i class="fa-solid fa-temperature-high text-danger"></i>
          </div>
          <div class=" fs-6 fw-semibold temp" title="Min temperature">${forecastDay.day.mintemp_c}<sup> o</sup>C <i
              class="fa-solid fa-temperature-low text-primary"></i></div>
        </div>
        <div class="custom text-center pb-3">${forecastDay.day.condition.text}</div>
      </div>
    </div>
  </div>
       `;
        }
    }
    document.getElementById('demo').innerHTML = box;
}

gatData();

