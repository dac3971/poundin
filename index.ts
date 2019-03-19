const express = require("express")
const cheerio = require("cheerio")
const request = require("request")
const rp = require("request-promise")
const url = require('url')
const sequelize = require('sequelize')
const Op = sequelize.Op;
const listing = require('./models').listing


const app = express()

app.get('/run', async (req,res) => {

    const search_url = new URL("https://www.ebay.com/sch/i.html")
    search_url.searchParams.append('_udlo','50') //floor price
    search_url.searchParams.append('_sop','10') //newly listed
    search_url.searchParams.append('_nkw','textbook') //search term
    search_url.searchParams.append('_pgn','1') //page

    // var options = {    
    //     headers: {
    //       'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
    //     }
    // }

    const html = await rp(search_url.href)

    const $ = cheerio.load(html)
    const promiseArray = []

    $('a.s-item__link')
    .each((i,element)=>{
        let href = element.attribs.href
        promiseArray.push(getPromise(concise(href)))
    })

    const arrayOfInfoObjects = await Promise.all(promiseArray)

    console.log(arrayOfInfoObjects)
    res.send(arrayOfInfoObjects)
    
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


app.get('/', async (req,res) =>{
    // TESTING A SINGLE CALL
    const info = await getPromise('https://www.ebay.com/itm/183737719795')
    console.log(info)
    res.send(info.isbn)
})


const PORT = process.env.PORT || 5000


app.listen(PORT, console.log(`server started on port ${PORT}`))

async function getPromise(url){
    const urlArr = url.split('/')
    const itemID = urlArr[urlArr.length-1]

    const html = await rp.get(url)
    const $ = cheerio.load(html)
    const isbn = $('[itemprop=productID]').text()
    const title = $('h1.it-ttl').text()
    const price = $('span#prcIsum').attr('content')
    const info = new Info(itemID, isbn, title, +price)
    return info
}

function concise(url){
    const shortened = url.split('?')[0]
    const shortArr = shortened.split('/')
    const id = shortArr[shortArr.length-1]
    return `https://www.ebay.com/itm/${id}`
}

class Info {
    private _itemID: string
    private _isbn: string
    private _title: string
    private _price: number
    constructor(itemID: string,isbn?: string,title?: string,price?: number){
        this._itemID = itemID
        this._isbn = isbn
        this._title = title
        this._price = price
    }

    get itemID(): string {
        return this._itemID
    }
    get isbn(): string {
        return this._isbn
    }
    get title(): string {
        return this._title
    }
    get price(): number {
        return this._price
    }
}