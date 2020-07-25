const mysql = require('mysql')
const cheerio = require('cheerio')
const axios = require('axios')

const express = require('express')
let router = express.Router()

const DATABASE = 'test'

router.get('/', (req, respond) => {
    let find = req.query.search
    let API_URL = ''
    if (find) {
        API_URL = `https://api.giphy.com/v1/gifs/search?api_key=KrV9iTv2yrddrh2UTjhjZ4QXr8NQQle8&q=${find}&limit=100`
    } if (!find) {
        API_URL = 'https://api.giphy.com/v1/gifs/trending?api_key=KrV9iTv2yrddrh2UTjhjZ4QXr8NQQle8'
    }
    axios.get(API_URL).then((res) => {

        let con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'ivananna',
            database: DATABASE
        })

        res = res.data.data
        for (let i=0; i<res.length; i++) {
            let url = `https://media0.giphy.com/media/${res[i].id}/giphy.gif`
            let sql_insert = `INSERT INTO pics_data VALUES ("${res[i].id}", "${res[i].title}", "${url}");`

            con.query(sql_insert, (err) => {
                if (err) {
//                    console.log('insertion error')
                }
                else {
//                    console.log('insertion completed')
                }
            })
        }

        if (!find) {
            let arrayOfData = []
            con.query('SELECT * FROM pics_data;', (err, res) => {
                if (err) {
    //                console.log('selection error')
                }
                else {
                    for (let i=100; i>0; i--) {
                        arrayOfData.push({
                            id: res[i].pic_id,
                            title: res[i].pic_title,
                            url: res[i].pic_url
                        })
                    }
                }
                respond.render('index.hbs', {arrayOfData})
            })
        } if (find) {
            let arrayOfData = []
            for (let i=0; i<res.length; i++) {
                let url = `https://media0.giphy.com/media/${res[i].id}/giphy.gif`
                arrayOfData.push({
                    id: res[i].id,
                    title: res[i].title,
                    url: url
                })
            }
            respond.render('index.hbs', {arrayOfData})
        }

        con.commit()
        con.end()
    }).catch((e) => console.log(e))
})

router.get('/gif/:id', (req, respond) => {
    const id = req.params.id
    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'ivananna',
        database: DATABASE
    })

    let arrayOfData = []
    con.query(`SELECT * FROM pics_data WHERE pic_id LIKE "${id}"`, (err, res) => {
        if (err) {
                console.log('selection error')
        }
        else {
            for (let i=0; i<res.length; i++) {
                arrayOfData.push({
                    id: res[i].pic_id,
                    title: res[i].pic_title,
                    url: res[i].pic_url
                })
            }
        }
        respond.render('gif.hbs', {url_pic: arrayOfData[0].url, id_pic: arrayOfData[0].id, title_pic: arrayOfData[0].title})
    })
})

module.exports = router;