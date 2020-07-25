const mysql = require('mysql')
const cheerio = require('cheerio')
const axios = require('axios')

const express = require('express')
let router = express.Router()

let DATABASE = 'test'

router.get('/upload/:url', (req, res) => {
    const url = req.params.url
    const backURL = req.header('Referer') || '/'

    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'ivananna',
        database: DATABASE
    })

    con.connect()
    let sql_insert = `INSERT INTO pics_data VALUES ("${res[i].id}", "${res[i].title}", "${url}");`

    con.query(sql_insert, (err, res) => {
        if (err) {
//            console.log('insertion error')
        } else {
//            console.log('insertion completed')
        }
    })

    res.status(200).redirect(backURL)

    con.commit()
    con.end();
})

//  Comming
//  Upvote/Downvote system
//  Upload option

module.exports = router;