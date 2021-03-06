// front-end javascript.

// index.hbs 에서 브라우져에서 표현될 변수들을 불러온다.
const weatherForm = document.querySelector('form')
const searchElement = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const icon = document.querySelector('#icon')

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault()              // default 는 event 발생 시 마다 페이지가 새로고침 되도록 하는데, 이를 방지함.
    
    const location = searchElement.value 

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''
    
    // 이 코드가 구현되는 url=localhost:3000 즉, home 이다.
    // home 에서 home 이하의 url 을 불러다가 사용하는 것이다.
    fetch('/weather?address=' + location).then((response) => {
    response.json().then((data) => {
        if(data.error) {
            messageOne.textContent = data.error         
        } else {

            const imgIcon = data.icon
            const imgUrl = 'http://openweathermap.org/img/wn/' + imgIcon + '@2x.png'

            // html 이미지에 id 부여하고 src 를 javascript 에서 부여할 수 있다.
            icon.src = imgUrl
            messageOne.textContent = data.forecast
            messageTwo.textContent = data.location
        }
    })
})
    
})

