"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cheerio = require("cheerio");
const request = require("request");
const rp = require("request-promise");
const url = require('url');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const listing = require('./models').listing;
const functions_1 = require("./helpers/functions");
const Info_1 = require("./classes/Info");
const app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
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
    $('a.s-item__link')
        .each((i, element) => {
        const href = element.attribs.href;
        promiseArray.push(getPromise(functions_1.concise(href)));
    });
    const arrayOfInfoObjects = await Promise.all(promiseArray);
    arrayOfInfoObjects.forEach(item => {
        listing.findOrCreate({
            where: {
                listingID: item.itemID
            },
            defaults: {
                listingID: item.itemID,
                title: item.title
            }
        }).spread((listingItem, created) => {
        });
    });
    res.send(arrayOfInfoObjects);
});
app.get('/get/:id', (req, res) => {
    console.log(req.params.id);
    listing.findByPk(req.params.id.toString()).then(item => {
        console.log(item.dataValues);
        res.send(item.dataValues);
    });
    //Puss.create({id,title,end,price,isbn}).then(puss=>console.log('done')).catch(err=>console.log(err))
    //listing.create({listingID,price}).then(listing=> console.log(listing)).catch(err=> console.log(err))
});
app.get('/', async (req, res) => {
    // TESTING A SINGLE CALL
    const info = await getPromise('https://www.ebay.com/itm/132891364981');
    res.send(info);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started on port ${PORT}`));
async function getPromise(url) {
    
    const urlArr = url.split('/');
    const itemID = urlArr[urlArr.length - 1];
    
    const info = new Info_1.Info(itemID);
    
    const html = await rp.get(url);
    const $ = cheerio.load(html);

    
    info.itemID = itemID
    info._isbn = $('[itemprop=productID]').text();
    info._title = $('h1.it-ttl').find($('span'))[0].next.data;
    info._price = $('span#prcIsum').attr('content');
    
    //buy options
    
    info.listingOptions._bestOffer = $('#boBtn_btn').length > 0 ? true : null
    info.listingOptions._buyItNow = $('#binBtn_btn').length > 0 ? true : null   
    info.listingOptions._bid =   $('#bidBtn_btn').length > 0 ? true : null


    
    console.log(info.data)
    
    return info.data;
}
