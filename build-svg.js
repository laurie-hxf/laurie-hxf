require('dotenv').config();
const WEATHER_API_KEY = process.env.gaode_api;

let fs = require('fs')
let got = require('got')
let formatDistance = require('date-fns/formatDistance')

let WEATHER_DOMAIN = 'https://restapi.amap.com'

// 高德天气 API 天气描述对应的 emoji
const weatherEmojis = {
  '晴': '☀️',
  '少云': '🌤',
  '晴间多云': '🌤',
  '多云': '⛅',
  '阴': '☁️',
  '有风': '💨',
  '平静': '🌤',
  '微风': '🌤',
  '和风': '🌤',
  '清风': '💨',
  '强风/劲风': '💨',
  '疾风': '💨',
  '大风': '💨',
  '烈风': '💨',
  '风暴': '🌪',
  '狂爆风': '🌪',
  '飓风': '🌪',
  '热带风暴': '🌪',
  '霾': '🌫',
  '中度霾': '🌫',
  '重度霾': '🌫',
  '严重霾': '🌫',
  '阵雨': '🌦',
  '雷阵雨': '⛈',
  '雷阵雨并伴有冰雹': '⛈',
  '小雨': '🌧',
  '中雨': '🌧',
  '大雨': '🌧',
  '暴雨': '🌧',
  '大暴雨': '🌧',
  '特大暴雨': '🌧',
  '强阵雨': '🌧',
  '强雷阵雨': '⛈',
  '极端降雨': '🌧',
  '毛毛雨/细雨': '🌦',
  '雨': '🌧',
  '小雨-中雨': '🌧',
  '中雨-大雨': '🌧',
  '大雨-暴雨': '🌧',
  '暴雨-大暴雨': '🌧',
  '大暴雨-特大暴雨': '🌧',
  '雨雪天气': '🌨',
  '雨夹雪': '🌨',
  '阵雨夹雪': '🌨',
  '冻雨': '🌨',
  '雪': '❄️',
  '阵雪': '❄️',
  '小雪': '❄️',
  '中雪': '❄️',
  '大雪': '❄️',
  '暴雪': '❄️',
  '小雪-中雪': '❄️',
  '中雪-大雪': '❄️',
  '大雪-暴雪': '❄️',
  '浮尘': '🌫',
  '扬沙': '🌫',
  '沙尘暴': '🌫',
  '强沙尘暴': '🌫',
  '龙卷风': '🌪',
  '雾': '🌫',
  '浓雾': '🌫',
  '强浓雾': '🌫',
  '轻雾': '🌫',
  '大雾': '🌫',
  '特强浓雾': '🌫',
  '热': '🥵',
  '冷': '🥶',
  '未知': '🌡',
}

// Cheap, janky way to have variable bubble width
dayBubbleWidths = {
  Monday: 235,
  Tuesday: 235,
  Wednesday: 260,
  Thursday: 245,
  Friday: 220,
  Saturday: 245,
  Sunday: 230,
}

// Time working at PlanetScale
const today = new Date()
const todayDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
  today
)

const psTime = formatDistance(new Date(2020, 12, 14), today, {
  addSuffix: false,
})

// Today's weather - 使用高德天气 API
// 城市代码 440305 = 深圳南山区
const cityCode = '440305'
let url = `v3/weather/weatherInfo?key=${WEATHER_API_KEY}&city=${cityCode}&extensions=base&output=JSON`

got(url, { prefixUrl: WEATHER_DOMAIN })
  .then((response) => {
    console.log(response.body)
    let json = JSON.parse(response.body)

    if (json.status !== '1' || !json.lives || json.lives.length === 0) {
      console.log('天气 API 请求失败')
      return
    }

    const live = json.lives[0]
    const degC = parseInt(live.temperature)
    const degF = Math.round(degC * 9 / 5 + 32)
    const weather = live.weather
    const emoji = weatherEmojis[weather] || '🌡'

    fs.readFile('template.svg', 'utf-8', (error, data) => {
      if (error) {
        return
      }

      data = data.replace('{degF}', degF)
      data = data.replace('{degC}', degC)
      data = data.replace('{weatherEmoji}', emoji)
      data = data.replace('{psTime}', psTime)
      data = data.replace('{todayDay}', todayDay)
      data = data.replace('{dayBubbleWidth}', dayBubbleWidths[todayDay])

      data = fs.writeFile('chat.svg', data, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    })
  })
  .catch((err) => {
    // TODO: something better
    console.log(err)
  })
