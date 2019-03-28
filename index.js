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
const Profile_1 = require("./classes/Profile");
const app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/', async (req, res) => {
    // TESTING A SINGLE CALL
    const info = await processData('https://www.ebay.com/itm/163474335398');
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
    $('a.s-item__link')
        .each((i, element) => {
        const smallUrl = functions_1.concise(element.attribs.href);
        const urlArr = smallUrl.split('/');
        const itemID = urlArr[urlArr.length - 1];
        //check if itemID is in itemID table
        //if yes, return
        //if no, push it
        promiseArray.push(processData(smallUrl));
    });
    const arrayOfInfoObjects = await Promise.all(promiseArray);
    arrayOfInfoObjects.forEach(item => {
        //check the profiles table to see if item.isbn is there
        //if its not in there, we have to visit the "isbn page" at this point to process the source of truth data
        //we also may want to call to amazon to see what it sells for there? or ebay? or both?
        //we also may need to call to see outstanding supply/demand numbers
        //once you have a complete profile object you'll write to profiles table
        let match;
        //check if item.edition and maybe item.author matches the edition from "isbn page" and set match to true/false
        //finally write the item to the itemID table (with a column for match)
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
    res.send(''); //arrayOfInfoObjects)
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started on port ${PORT}`));
async function processData(url) {
    const urlArr = url.split('/');
    const itemID = urlArr[urlArr.length - 1];
    const html = await rp.get(url);
    const $ = cheerio.load(html);
    const isbn = $('[itemprop=productID]').text();
    const title = $('h1.it-ttl').find($('span'))[0].next.data;
    const edition = $('td').filter(function () {
        return $(this).text().trim() === 'Edition Number:';
    }).next('td').find('span').text();
    const author = $('td').filter(function () {
        return $(this).text().trim() === 'Author';
    }).next('td').text().trim();
    //($('td.attrLabels').next().children()[0].children[0].data)
    const price = $('span#prcIsum').attr('content');
    const endTimestamp = $('.timeMs').attribs ? $('.timeMs').attribs.timems : 0;
    const auc = $('#bidBtn_btn').length > 0;
    const bin = $('#binBtn_btn').length > 0;
    const offer = $('#boBtn_btn').length > 0;
    const info = new Info_1.Info(itemID, isbn, title, edition, author, +price, +endTimestamp, auc, bin, offer);
    return info.data;
}
async function processProfile(url) {
    const urlArr = url.split('/');
    const isbn = urlArr[urlArr.length - 1];
    // const html = await rp.get(url)
    // const $ = cheerio.load(html)
    // const isbn = $('[itemprop=productID]').text()
    // const title = $('h1.it-ttl').find($('span'))[0].next.data
    // const edition = $('td').filter(function() {
    //     return $(this).text().trim() === 'Edition Number:';
    //   }).next('td').find('span').text()
    // const author = $('td').filter(function() {
    //     return $(this).text().trim() === 'Author';
    //   }).next('td').text().trim()
    // //($('td.attrLabels').next().children()[0].children[0].data)
    // const price = $('span#prcIsum').attr('content')
    // const endTimestamp = $('.timeMs').attribs ? $('.timeMs').attribs.timems : 0
    // const auc = $('#bidBtn_btn').length > 0
    // const bin = $('#binBtn_btn').length > 0
    // const offer = $('#boBtn_btn').length > 0
    const profile = new Profile_1.Profile(isbn);
    return profile.data;
}
