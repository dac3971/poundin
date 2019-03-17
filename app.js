const express = require("express")
const cheerio = require("cheerio")
const request = require("request")
const db = require("./config/database")
const Puss = require("./models/Puss")
const url = require('url')

search_url = new URL("https://www.ebay.com/sch/i.html")
search_url.searchParams.append('_udlo','50') //floor price
search_url.searchParams.append('_sop','10') //newly listed
search_url.searchParams.append('_nkw','textbook') //search term
search_url.searchParams.append('_pgn','1') //page
console.log(search_url)


// request(completeURL, (error, response, html)=>{
//     if(!error && response.statusCode == 200){
//         const $ = cheerio.load(html)
//         console.log($('.POSITIVE').text())
//     }
// })

// db.authenticate().then(()=> console.log("Database connected..."))
// .catch(err => console.log("error:"+err))

const app = express()

app.get('/', (req,res)=> {
    const data = {
        id: "774",
        title: "coin 1",
        end: "tuesday",
        price: 1300,
        isbn: "IBNK"
    }
    let { id,title,end,price,isbn } = data

    Puss.create({id,title,end,price,isbn}).then(puss=>console.log('done')).catch(err=>console.log(err))
    
    res.send(search_url)
})
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`server started on port ${PORT}`))