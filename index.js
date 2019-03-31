"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cheerio = require("cheerio");
const request = require("request");
const rp = require("request-promise");
const url = require('url');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const textbooklistings = require('./models').textbooklistings;
const listing = require('./models').listing
const functions_1 = require("./helpers/functions");
const Info_1 = require("./classes/Info");
const app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/', async (req, res) => {
    // TESTING A SINGLE CALL
    const info = await processData('https://www.ebay.com/itm/132891364981');
       
    res.send(info);
});
app.get('/run', async (req, res) => {
    const search_url = new URL("https://www.ebay.com/sch/i.html");
    search_url.searchParams.append('_udlo', '50'); //floor price
    search_url.searchParams.append('_sop', '10'); //newly listed
    search_url.searchParams.append('_nkw', 'textbook'); //search term
    search_url.searchParams.append('_pgn', '1'); //page
    const html = await rp(search_url.href);
    const $ = cheerio.load(html);
    const promiseArray = [];
    const dbFindByPkArray = []
    $('a.s-item__link')
        .each((i, element) => {
        const smallUrl = functions_1.concise(element.attribs.href);
        const urlArr = smallUrl.split('/');
        const itemID = urlArr[urlArr.length - 1];
        //check if item already exists in DB
        dbFindByPkArray.push(textbooklistings.findByPk(itemID).then(listing => {
          return {url: smallUrl, payload: listing}
            
        }))      
    });
    
    const db = await Promise.all(dbFindByPkArray)
    db.forEach(dbOb =>{       
        if (dbOb.payload == null){
            
            promiseArray.push(processData(dbOb.url))
            //console.log(dbOb)
        }           
    })

    const arrayOfInfoObjects = await Promise.all(promiseArray);
    arrayOfInfoObjects.forEach(item => {
        
        textbooklistings.create(
         {
            listingID: item.itemID
         
        }   
        )
    });
    res.send(arrayOfInfoObjects); //arrayOfInfoObjects)
});

app.get('/get/:id', (req, res) => {
    console.log(req.params.id);
    textbooklistings.findByPk(req.params.id.toString()).then(item => {
        console.log(item.dataValues);
        res.send(item.dataValues);
    });
    //Puss.create({id,title,end,price,isbn}).then(puss=>console.log('done')).catch(err=>console.log(err))
    //listing.create({listingID,price}).then(listing=> console.log(listing)).catch(err=> console.log(err))
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started on port ${PORT}`));

async function processData(url) {
    
    const urlArr = url.split('/');
    const itemID = urlArr[urlArr.length - 1];
    const html = await rp.get(url);
    const $ = cheerio.load(html);
    const isbn = $('[itemprop=productID]').text();
    const title = $('h1.it-ttl').find($('span'))[0].next.data;
    const price = $('span#prcIsum').attr('content');
    const auc = $('#bidBtn_btn').length > 0;
    const bin = $('#binBtn_btn').length > 0;
    const offer = $('#boBtn_btn').length > 0;
    const info = new Info_1.Info(itemID, isbn, title, +price, auc, bin, offer);
    return info.data;
}
