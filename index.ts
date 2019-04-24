const express = require("express")
const cheerio = require("cheerio")
const rp = require("request-promise")
const models = require('./models')
const Item = require('./models').Item
const Profile = require('./models').Profile
const Sequelize = require('sequelize')
const { gt } = Sequelize.Op;
import { concise } from './helpers/functions'


const app = express()
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })


app.get('/items/:limit', async (req,res) =>{
    const arrOfItemModels = await Item.findAll({
        where: { spread: { [gt]: -100 } },
        limit: req.params.limit
    })
    const arrOfItemObjects = arrOfItemModels.map(model=>model.toJSON())
    res.header("Content-Type",'application/json')
    res.send(arrOfItemObjects)
})

app.get('/isbn/:isbn', async (req, res) =>{
    const isbnObj = await fetchISBNdata(req.params.isbn)
    res.header("Content-Type",'application/json')
    res.send(JSON.stringify(isbnObj,null,4))
})

app.get('/profile/:isbn', async (req, res) =>{
    const profModel = await Profile.findByPk(req.params.isbn)
    res.header("Content-Type",'application/json')
    res.send(profModel ? profModel.toJSON() : {})
})

app.get('/run', async (req,res) => {
    let htmlResponse = '<ul>'
    res.set('Content-Type', 'text/html')
    const checkByPkArray = []
    const search_url = createEbayURL('textbook',0)
    search_url.searchParams.append('_udlo','50') //floor price
    search_url.searchParams.append('_sop','10') //newly listed
    search_url.searchParams.append('_pgn','1') //page
    search_url.searchParams.append('_ipg','25') //items per page

    const html = await rp(search_url.href)

    const $ = cheerio.load(html)

    $('a.s-item__link')
    .each((i,element)=>{
        const smallUrl = concise(element.attribs.href)
        const urlArr = smallUrl.split('/')
        const itemID = urlArr[urlArr.length-1]
// console.log(itemID)
        checkByPkArray.push(
            Item.findByPk(itemID).then(itemModel => {
                if(itemModel) return
                return smallUrl
            }).catch(e=>console.log(e.toString()))
        )
    })

    const results = await Promise.all(checkByPkArray)

    const urlsToProcess = results.filter(el => el != null) //remove nulls
    let itemsWritten = 0, profilesWritten = 0

    urlsToProcess.forEach( async (url) =>{
        const itemModel = await processData(url)
        // console.log(infoObj)
        const isbn = itemModel.getDataValue('isbn')
        //check if its in profiles yet
        if(isbn){
            const profModel = await Profile.findByPk(isbn)
            const finalProfModel = !profModel ? await processProfile(isbn) : profModel
            if(!profModel) await finalProfModel.save().then(pModel=>{
                profilesWritten++
            }).catch(e=>console.log(e.toString()))
                
            //TODO: see if we can inner join so we don't need a spread column
            itemModel.setDataValue('spread', finalProfModel.getDataValue('avgPrice')-itemModel.getDataValue('price'))
            const writtenItemModel = await itemModel.save()
            itemsWritten++
            htmlResponse += `<li>Wrote: ${writtenItemModel.getDataValue('listingID')}</li>`
            if(itemsWritten === urlsToProcess.length){
                res.write(`${htmlResponse}<li>${itemsWritten} items written</li></ul>`)
                res.end()
            }
        }
    })
})


app.get('/get/:id', (req,res)=> {

    console.log(req.params.id)

})


const PORT = process.env.PORT || 5000

models.sequelize.sync().then(() =>{
    app.listen(PORT, console.log(`server started on port ${PORT}`))
})

async function processData(url){
    const urlArr = url.split('/')
    const listingID = urlArr[urlArr.length-1]
    const html = await rp.get(url).catch(e=>console.log(e.toString()))
    const $ = cheerio.load(html)
    const isbn = $('[itemprop=productID]').text()
    const title = $('h1.it-ttl').find($('span'))[0].next.data
    const edition = $('td').filter(function() {
        return $(this).text().trim() === 'Edition Number:';
    }).next('td').find('span').text()
    const author = $('td').filter(function() {
        return $(this).text().trim() === 'Author';
      }).next('td').text().trim()
    // ($('td.attrLabels').next().children()[0].children[0].data)
    const seller = $('.mbg-nw').text()
    const sellerCt = parseInt($('.mbg-l').text().match(/\d+/)[0])
    const price = $('span#prcIsum').attr('content')
    const endTimestamp = $('.timeMs').attribs ? $('.timeMs').attribs.timems : 0
    const auc = $('#bidBtn_btn').length > 0
    const bin = $('#binBtn_btn').length > 0
    const offer = $('#boBtn_btn').length > 0
    const itemModel = Item.build({
        listingID: listingID,
        isbn: isbn,
        title: title,
        edition: edition,
        author: author,
        price: +price,
        endTimestamp: +endTimestamp,
        auction: auc,
        bin: bin,
        bestOffer: offer,
        seller: seller,
        sellerCount: +sellerCt
    })
    return itemModel
}

async function processProfile(isbn){
    const priceArr = []
    const ebayURL = createEbayURL(isbn,1)
    // const camelURL = createCamelURL(isbn)

    const resultsHTML = await Promise.all([fetchISBNdata(isbn), rp.get(ebayURL.href)])//rp.get(camelURL)])//add the isbn page promise
    const isbnObj = resultsHTML[0]
    const $ = cheerio.load(resultsHTML[1])
    const demand = set_demand($)
    $('span.s-item__price').find('span.POSITIVE').not('span.ITALIC').each(function(i,elem){
        const price = parseFloat($(this).text().replace("$",''))
        priceArr.push(price)
    })
    // const avgEbayPrice = priceArr.length>0 ? (priceArr.reduce((previous, current) => previous + current) / priceArr.length).toFixed(2) : 0
    let minPrice = Math.min(...priceArr)
    let maxPrice = Math.max(...priceArr)
    // const camelPrice = cheerio.load(resultsHTML[2])('div.pricetype_label').filter(function() {
    //     return $(this).text().trim() === '3rd Party Used';
    //   }).parent().next().next().next('td').find('span.black').text().trim()
    //   || 0
    // if(camelPrice>0) priceArr.push(camelPrice)
    const avgPrice = priceArr.length>0 ? (priceArr.reduce((previous, current) => previous + current) / priceArr.length).toFixed(2) : 0
    // const profile = new Profile(isbn,title,edition,author,+avgEbayPrice,imgURL,priceArr.length,4)
    const prof = Profile.build({
        isbn: isbn,
        title: isbnObj.title,
        edition: isbnObj.edition,
        author: isbnObj.author,
        avgPrice: avgPrice,
        imgURL: isbnObj.imgURL,
        supply: priceArr.length,
        demand: demand.demand,
        maxBid: demand.maxBid,
        avgBid: demand.avgBid,
        maxPrice: maxPrice,
        minPrice: minPrice
    })
    
    return prof
}

function createEbayURL (searchTerms,over) {
    const url = new URL("https://www.ebay.com/sch/i.html")
    url.searchParams.append('_nkw',searchTerms) //search terms
    url.searchParams.append('LH_Complete',over.toString()) //complete
    url.searchParams.append('LH_Sold',over.toString()) //sold
    url.searchParams.append('LH_PrefLoc','1') //prefLoc
    // url.searchParams.append('_ipg','25') //items per page
    // const base = "https://www.ebay.com/sch/i.html?"
    // const keywords = `_nkw=${searchTerms}`
    // const category = "&_sacat=0"
    //const pageNumber = "&_pgn=1"
    //const itemsPerPage = "&_ipg=200"
    //const alsoSearchDesc = "&LH_TitleDesc=0"
    // const priceFloor = "&_udlo=70"
    //const otherCat = "&_osacat=0"
    //const otherKeyword = "&_odkw=book"
    // const completed = "&LH_Complete=1&rt=nc"
    // const sold = "&LH_Sold=1"
    // const usaOnly = "&LH_PrefLoc=1"
    // const completeURL = base.concat(keywords,category,completed,sold,usaOnly)
    return url
}

function createCamelURL (isbn){
    return `https://camelcamelcamel.com/product/${isbn}`
}

async function fetchISBNdata (isbn){
    const html = await rp(`https://isbndb.com/book/${isbn}`)
    const $ = cheerio.load(html)
    const table = $('.table.table-hover.table-responsive ').find('th')
    const title = table.filter(function(){
        return $(this).text().toLowerCase() == 'full title'
    }).next('td').text()
    const edition = table.filter(function(){
        return $(this).text().toLowerCase() == 'edition'
    }).next('td').text()
    const publishDate = table.filter(function(){
        return $(this).text().toLowerCase() == 'publish date'
    }).next('td').text()
    const authorList = []
    table.filter(function(){
        return $(this).text().toLowerCase() == 'authors'
    }).next('td').find('a').each(function (i,elem){
        authorList.push($(this).text())
    })
    const imgURL = $('.artwork').children()[0].attribs.data
    const isbnObj = {
        author: authorList.join(';'),
        title: title,
        edition: edition,
        publishDate: publishDate,
        imgURL: imgURL
    }
    return isbnObj
}

function set_demand($){
    
    let bids = []
    $('.s-item').each(function (i, element) {
        let bidcount = $(this).find('.s-item__bids.s-item__bidCount')[0] ? $(this).find('.s-item__bids.s-item__bidCount').text().match(/[0-9]+/g).join('') : null 
        if(bidcount)
            bids.push(parseInt(bidcount))  
    })

    let avg = bids.length > 0 ? bids.reduce((previous, current) => previous + current) / bids.length : null;
    //profile.maxBid  = bids.length > 0 ? Math.max(...bids) : null;
    const demand = {
        demand: $('.s-item').length,
        maxBid: bids.length > 0 ? Math.max(...bids) : null,
        avgBid: avg > 0 ? avg : null
    }
    return demand
}