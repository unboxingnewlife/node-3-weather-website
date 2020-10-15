const request = require('request')

const geoCode = (address, callback) => {
    // encodeURIComponent: 모든 문자를 인코딩하는 함수다.
    // 인코딩이란 데이터를 다른 형식으로 변환한다는 의미이다. 즉, 여기서의 함수는 uri 형식에 쓰일 수 있도록 변환한다는 의미이다.
    // 예를 들면 ? 는 그냥 쓰면, 시스템에서 충돌이 발생하는데, 변환하면 %3F 가 되어 이용된다.
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoiZWNvbm90YWt1IiwiYSI6ImNrZnh0ZTQwbzF3cXkycnRzNThhcHF0MngifQ.VqM7Td7riS2zuLnybISsIg&limit=1'

            // 원래는 url: url 인데 변수명과 할당 이름이 같아서 : url 은 생략 가능.
            // reponse -> {body}
    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to location service', undefined)
        } else if (body.features.length === 0) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, {
                lat : body.features[0].center[1],
                lon : body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geoCode
    
