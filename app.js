const express = require("express")
const cheerio = require("cheerio")
const request = require("request")
const sequelize = require('sequelize')
const url = require('url')
const Op = sequelize.Op;
const listing = require('./models').listing


search_url = new URL("https://www.ebay.com/sch/i.html")
search_url.searchParams.append('_udlo','50') //floor price
search_url.searchParams.append('_sop','10') //newly listed
search_url.searchParams.append('_nkw','textbook') //search term
search_url.searchParams.append('_pgn','1') //page





// db.authenticate().then(()=> console.log("Database connected..."))
// .catch(err => console.log("error:"+err))

const app = express()

app.get('/run', (req,res) => {

    var options = {
        
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
        } }
        request(search_url.href ,options, (error, response, html)=>{
            if(!error && response.statusCode == 200){
                const $ = cheerio.load(html)
                const item_urls = {}
       
                $('a.s-item__link')
                .each((i,element)=>{
                let href = element.attribs.href
                const shortened = href.split('?')[0]
                // TODO: get response to each individual link here
                item_urls[i] = shortened
                console.log(shortened)
                })
                // TODO: make an object with the ISBN prop and throw the rows into the database
                res.send(item_urls)
            }
            
        })
    
})
app.get('/', (req,res) =>{


})

app.get('/get/:id', (req,res)=> {

    console.log(req.params.id)
    listing.findByPk(req.params.id.toString()).then(item=>{
        console.log(item.dataValues)
        res.send(item.dataValues)
    })
    //Puss.create({id,title,end,price,isbn}).then(puss=>console.log('done')).catch(err=>console.log(err))
    //listing.create({listingID,price}).then(listing=> console.log(listing)).catch(err=> console.log(err))

   
    

    
    
    
    
})
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`server started on port ${PORT}`))