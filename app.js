const express = require("express")
const cheerio = require("cheerio")
const request = require("request")
const db = require("./config/database")
const Puss = require("./models/Puss")


//construct the search URL found here: http://www.helios825.org/url-parameters.php
const base = "https://www.ebay.com/sch/i.html?"
const keywords = "_nkw=textbook"
const category = "&_sacat=0"
//const pageNumber = "&_pgn=1"
//const itemsPerPage = "&_ipg=200"
//const alsoSearchDesc = "&LH_TitleDesc=0"
const priceFloor = "&_udlo=70"
//const otherCat = "&_osacat=0"
//const otherKeyword = "&_odkw=book"
const completed = "&LH_Complete=1&rt=nc"
const sold = "&LH_Sold=1"
const completeURL = base.concat(keywords,category,priceFloor,completed,sold)

request(completeURL, (error, response, html)=>{
    if(!error && response.statusCode == 200){
        const $ = cheerio.load(html)
        console.log($('.POSITIVE').text())
    }
})

db.authenticate().then(()=> console.log("Database connected..."))
.catch(err => console.log("error:"+err))
const app = express()

app.get('/', (req,res)=> {
    const data = {
        id: "788990",
        title: "coin 1",
        end: "tuesday",
        price: 1300,
        isbn: "IBNK"
    }
    let { id,title,end,price,isbn } = data

    // Puss.create({id,title,end,price,isbn}).then(puss=>console.log('done')).catch(err=>console.log(err))

    res.send('INDEX')
})
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`server started on port ${PORT}`))