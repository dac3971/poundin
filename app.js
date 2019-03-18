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