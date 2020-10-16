const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express()
const port = process.env.PORT || 3000

const geoCode = require('./utils/geocode')
const weatherCode = require('./utils/weathercode')

// define paths for express config-----------------------------------------------------------------
// 메소드명처럼 인자로 받은 경로들을 하나로 합쳐서 문자열 형태로 path를 리턴한다.
// dirname 현재 파일이 위치하는 디렉토리를 의미: src
const publicDirectoryPath = path.join(__dirname, '../public')

const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
// define paths for express config-----------------------------------------------------------------

// setup handlebars engine and view location ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// template engine to render dynamic web pages using express
// express 에 어떤 template engine 을 설치했는지 알려주는 것: 'hbs'가 설치되었다고 알려주고 있다.
// key: view engine, value: hbs
app.set('view engine', 'hbs')

// hbs file 의 기본 디렉토리는 views 이다. 그래서 views 폴더하에서 찾는다.
// 하지만 다음과 같은 방법으로 디폴트 디렉토리가 아닌 디렉토리로 custimizing 할 수 있다.
app.set('views', viewsPath)

hbs.registerPartials(partialsPath)
// setup handlebars engine and view location ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// setup static directory to serve-----------------------------------------------------------------
// express 에서 정적 파일 제공 : 코드에 직접적인 변화를 주지 않는 이상은 웹상에서 변화하지 않음. 
// app.use(express.static(file)) 를 여러 번 이용할 수 있다.
app.use(express.static(publicDirectoryPath))
// setup static directory to serve-----------------------------------------------------------------


// app.get("/help", (req, res) => {
//     res.send([{                 // 브라우저에서 자동으로 json 파일로 변환된다.
//         name: 'Ann'
//     }, {
//         name: 'Lee'
//     }])
// })

// app.get('', (req, res) => {}) : setup route 
// express 에서는 현재 위치하에서 views folder 를 찾는다. 그래서 src directory 하에서 실행을 하면 오류가 발생한다.
// 즉, web-server 디렉토리하에서 nodemon src/app.js 식으로 명령어를 입력해야 한다.
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'park'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'park'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text',
        title: 'Help',
        name: 'park'
    })
})

// backend 와 frontend 를 연결 --------------------------------------------------------------------
// req.query. 이하는 주소창의 ? 이후로 나오는 인자들이다. 예를 들면, 날씨 api 에서..
// api.openweathermap.org/data/2.5/weather?lat=35&lon=139 에서 위도와 경도를 나타내는 lat, lon 을 말한다.
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    const address = req.query.address
    geoCode(address, (error, {lat, lon, location} = {}) => {  //address 입력되지 않을 상황 대비: default 값설정-> {}
        if(error) {
            return res.send({
                error
            })
        }
        weatherCode(lat, lon, (error, weatherData, icon) => {
            if(error) {
                return res.send({
                    error
                })
            }
            res.send({
                icon,
                forecast: weatherData,
                location,               // 위의 if 문의 error 와 마찬가지로 중복해서 쓸 필요 없다.
                address
            })
        })
    })
    
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})
// backend 와 frontend 를 연결 --------------------------------------------------------------------


// setup 404 page-----------------------------------------------------------------------------------------
app.get('/help/*', (req, res) => {
    res.render('404page', {
        title: '404',
        name: 'park',
        errorMessage: 'Help article not found.'
    })
})

// 원리는 다음과 같다. 코드는 위에서 아래로 순서대로 실행된다.
// '/' 이하의 주소를 설정한 것은 설정된 페이지가 나타낸다.
// * 은 전부를 의미한다. 즉, 설정된 주소가 이외의 모든 주소형식은 다음이 적용되는 것이다.
app.get('*', (req, res) => {
    res.render('404page', {
        title: '404',
        name: 'park',
        errorMessage: 'Page not found.'
    })
})
// setup 404 page-----------------------------------------------------------------------------------------


app.listen(port, () => {
    console.log('server is up on port ' + port);
})