const router = require('express').Router();
const request = require('request')
const cheerio = require('cheerio')
const moment = require('moment')

router.get('/:time', async (req,res) => {
  const now = moment(new Date(req.params.time)).format("YYYY.MM.DD")
  let data = [];
  let url = "http://stu.dge.go.kr/sts_sci_md01_001.do?schulCode=D100000282&schulCrseScCode=4&schMmealScCode=&schYmd="+now
  const dates = [];
  let meals = [];

  // moment.lang('ko', {
  //   weekdays: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
  //   weekdaysShort: ["일","월","화","수","목","금","토"],
  // });

  const selectData = new Promise((resolve,reject) => {
      request(url,async (error,response,html) => {
        if(error) reject(error)

        let $ = cheerio.load(html)

        $('table > thead > tr > th').slice(1).each(await function(){
          let date_temp = $(this);
          dates.push(date_temp.text())
        })

        $('table > tbody > tr:nth-child(2) > td').each(await function(){
          let meal_temp = $(this);
          meals.push(meal_temp.text());
        })

        resolve();
      });
    })

  await selectData

  const insertData = new Promise((resolve,reject) => {

    if(meals.length === 0){
      return res.send({
              "result" : 0,
              "error" : "급식이 없는 날이에요 ㅜㅜ"
            })
    }

    for (var i = 0; i < dates.length; i++) {
      data.push({date : dates[i], meal : meals[i]});
    }
    resolve()
  })

  await insertData

  res.send({
    "result" : 1,
    "data" : data
  })

})

router.get('/', async (req,res) => {
  let dates = [];
  let meals = [];
  let url = "http://stu.dge.go.kr/sts_sci_md01_001.do?schulCode=D100000282&schulCrseScCode=4&schMmealScCode="

  //시간 생성

  let now = new Date("2017-07-14");
  let breakfast = new Date("2017-07-14")
  let lunch = new Date("2017-07-14")
  let dinner = new Date("2017-07-14")

  const setTime = new Promise((resolve,reject) => {
    now.setHours(12,50,0,0);
    breakfast.setHours(7,30,0,0);
    lunch.setHours(12,40,0,0);
    dinner.setHours(18,30,0,0);
    resolve()
  })

  await setTime

  // let breakfast = now;
  // let lunch = now;
  // let dinner = now;

  // console.log("bye!");
  // console.log("이상하네 : "+now);
  // console.log(now.getTime()+" || "+breakfast.setHours(7,30,0,0));
  // console.log("brakfjl===="+breakfast.getTime());
  // console.log("now ============== "+now.getTime());
  // console.log("now : "+now+"break : "+breakfast);
  const mealCode = (now.getTime() < breakfast.getTime()) ? 1 : (now.getTime() < lunch.getTime()) ? 2 : (now.getTime() < dinner.getTime()) ? 3 : 1;
  if (now > dinner) {
    now.setDate((now.getDate()+1))
  }
  let today = moment(now).format('YYYY.MM.DD')

  url += mealCode + "&schYmd="+today

  const selectData = new Promise((resolve,reject) => {
    request(url,async (error,response,html) => {
      if(error) reject(error)

      let $ = cheerio.load(html)

      $('table > thead > tr > th').slice(1).each(await function(){
        let date_temp = $(this);
        dates.push(date_temp.text())
      })

      $('table > tbody > tr:nth-child(2) > td').each(await function(){
        let meal_temp = $(this);
        meals.push(meal_temp.text());
      })

      resolve();
    });
  })

  await selectData

  const insertData = new Promise((resolve,reject) => {

    if(meals.length === 0){
      return res.send({
              "result" : 0,
              "error" : "급식이 없는 날이에요 ㅜㅜ"
            })
    }

    for (var i = 0; i < dates.length; i++) {

      //요일 자르기 ex) 2017.06.08(일) => 2017.06.08

      if((dates[i].substr(0,(dates[i].length-3))) === today){
        return res.send({
            "result" : 1,
            "data" : {
              "mealCode" : mealCode,
              "date" : dates[i],
              "meal" : meals[i]
            }
        })
      }
    }
    return res.send({
            "result" : 0,
            "error" : "급식이 없는 날이에요 ㅜㅜ"
    })
    resolve()
  })

  await insertData

})

module.exports = router
