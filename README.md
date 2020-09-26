# Aurora Northern Lights Project

### Installation
`npm i` for dependencies
<br> Create a typescript file here `src/environments/keep.ts` and then :
- export a const named `OPENWHEATHER_API_KEY`

You will need an OpenWeatherMap free account.

Start project with `npm run start:browser-cordova` and test on your browser.
Uncomment in `tab1/tab1.page.ts` the following : this.getForecast() , then comment the lines below to avoid reverseGeoloc errors due to cordova.


`Update:native` & `prepare:native` for building /www and /android folders, then use `ide:open` to open Android Studio and build project to your phone.

### About 
Aurora Northern Lights Forecast 
<br>
Mobile App (IONIC Angular).
This project will be deployed on Android mobile devices in a first time. 
<br>
1st Release date : mi-december 2019.


### Credits 
- OpenWeatherMap API for the weather : https://openweathermap.org/api/one-call-api#data 
- Aurora Live API for the auroras' informations : http://auroraslive.io/#/
- Thanks to JHEY for his talent, found on Codepen : https://codepen.io/jh3y/pen/JKddVx
- Various websites for informations & stories about Aurora
- Me, @Ichoui, for sure ☺
