const router = require('express').Router();
const request = require('request')
const cheerio = require('cheerio')
const moment = require('moment')

router.get('/:time', async (req,res) => {
  const now = moment(new Date(req.params.time)).format("YYYY.MM.DD")
  let data = [];
  let url = "http://stu.dge.go.kr/sts_sci_md01_001.do?schulCode=D100000282&schulCrseScCode=4&schMmealScCode=&schYmd="+now
  let dates = [];
  let meals = [];

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

router.get('/',async (req,res) => {
  let data = [];
  let url = "http://stu.dge.go.kr/sts_sci_md01_001.do?schulCode=D100000282&schulCrseScCode=4&schMmealScCode=&schYmd=2017.12.21"
  let dates = [];
  let meals = [];
  const now = moment().format("YYYY.MM.DD")
  const time = moment().format("HH:mm")

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

module.exports = router
