const request = require('request')

const weatherCode = (lat, lon, callback) => {
    const url = 'https://api.openweathermap.org/data/2.5/weather?appid=c8ed59c08070b92caf7bbfcdaa12347d&units=metric&lat=' + lat + '&lon=' + lon

    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to weather service', undefined)
        } else if (body.cod === '400') {              // 강의와는 다른 api 를 사용하고 있어서 코드가 다름.
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, `Now ${body.weather[0].description}, and degree is ${body.main.temp}`);
        }
    })
}

module.exports = weatherCode



//{description: body.weather[0].description,  degree: body.main.temp}
   