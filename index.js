"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cheerio = require("cheerio");
const request = require("request");
const rp = require("request-promise");
const url = require('url');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const models = require('./models');
const item = require('./models').item;
const profile = require('./models').profile;
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
    // const info = await processData('https://www.ebay.com/itm/163474335398')
    const info = await processProfile('0683083678');
    res.send(info);
});
app.get('/run', async (req, res) => {
    let htmlResponse = '<ul>';
    const checkByPkArray = [];
    const search_url = new URL("https://www.ebay.com/sch/i.html");
    search_url.searchParams.append('_udlo', '50'); //floor price
    search_url.searchParams.append('_sop', '10'); //newly listed
    search_url.searchParams.append('_nkw', 'textbook'); //search term
    search_url.searchParams.append('_pgn', '1'); //page
    const html = await rp(search_url.href);
    const $ = cheerio.load(html);
    $('a.s-item__link')
        .each((i, element) => {
        const smallUrl = functions_1.concise(element.attribs.href);
        const urlArr = smallUrl.split('/');
        const itemID = urlArr[urlArr.length - 1];
        checkByPkArray.push(item.findByPk(itemID).then(i => {
            if (i)
                return;
            return smallUrl;
        }).catch(e => console.log(e.toString())));
    });
    const results = await Promise.all(checkByPkArray);
    const urlsToProcess = results.filter(el => el != null); //remove nulls
    let itemsWritten = 0;
    urlsToProcess.forEach(async (url) => {
        const infoObj = await processData(url);
        // console.log(infoObj)
        item.create(infoObj).then(i => {
            itemsWritten++;
            htmlResponse += `<li>Wrote: ${JSON.stringify(infoObj)}</li>`;
            res.write(`${htmlResponse}<li>${itemsWritten} items written</li></ul>`);
            if (itemsWritten === urlsToProcess.length)
                res.end();
        });
    });
});
app.get('/get/:id', (req, res) => {
    console.log(req.params.id);
    // listing.findByPk(req.params.id.toString()).then(item=>{
    //     console.log(item.dataValues)
    //     res.send(item.dataValues)
    // })
    //Puss.create({id,title,end,price,isbn}).then(puss=>console.log('done')).catch(err=>console.log(err))
    //listing.create({listingID,price}).then(listing=> console.log(listing)).catch(err=> console.log(err))
});
const PORT = process.env.PORT || 5000;
models.sequelize.sync().then(() => {
    app.listen(PORT, console.log(`server started on port ${PORT}`));
});
async function processData(url) {
    const urlArr = url.split('/');
    const listingID = urlArr[urlArr.length - 1];
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
    // ($('td.attrLabels').next().children()[0].children[0].data)
    const seller = $('.mbg-nw').text();
    const sellerCt = parseInt($('.mbg-l').text().match(/\d+/)[0]);
    const price = $('span#prcIsum').attr('content');
    const endTimestamp = $('.timeMs').attribs ? $('.timeMs').attribs.timems : 0;
    const auc = $('#bidBtn_btn').length > 0;
    const bin = $('#binBtn_btn').length > 0;
    const offer = $('#boBtn_btn').length > 0;
    const info = new Info_1.Info(listingID, isbn, title, edition, author, +price, +endTimestamp, auc, bin, offer, seller, +sellerCt);
    return info.data;
}
async function processProfile(isbn) {
    const priceArr = [];
    const ebayURL = createEbayURL(isbn);
    const camelURL = createCamelURL(isbn);
    const isbnURL = '';
    const resultsHTML = await Promise.all([rp.get(ebayURL), rp.get(camelURL)]); //add the isbn page promise
    const $ = cheerio.load(resultsHTML[0]);
    $('span.s-item__price').find('span.POSITIVE').not('span.ITALIC').each(function (i, elem) {
        const price = parseFloat($(this).text().replace("$", ''));
        priceArr.push(price);
    });
    const avgEbayPrice = (priceArr.reduce((previous, current) => previous + current) / priceArr.length).toFixed(2);
    let minPrice = Math.min(...priceArr);
    let maxPrice = Math.max(...priceArr);
    const camelPrice = cheerio.load(resultsHTML[1])('div.pricetype_label').filter(function () {
        return $(this).text().trim() === '3rd Party Used';
    }).parent().next().next().next('td').find('span.black').text().trim();
    console.log("Min: $" + minPrice);
    console.log("Max: $" + maxPrice);
    console.log("avg Ebay: $" + avgEbayPrice);
    console.log("camel: " + camelPrice);
    const title = '';
    const edition = '';
    const author = '';
    const imgURL = '';
    const profile = new Profile_1.Profile(isbn, title, edition, author, +avgEbayPrice, imgURL, priceArr.length, 4);
    return profile.data;
}
function createEbayURL(searchTerms) {
    const base = "https://www.ebay.com/sch/i.html?";
    const keywords = `_nkw=${searchTerms}`;
    const category = "&_sacat=0";
    //const pageNumber = "&_pgn=1"
    //const itemsPerPage = "&_ipg=200"
    //const alsoSearchDesc = "&LH_TitleDesc=0"
    // const priceFloor = "&_udlo=70"
    //const otherCat = "&_osacat=0"
    //const otherKeyword = "&_odkw=book"
    const completed = "&LH_Complete=1&rt=nc";
    const sold = "&LH_Sold=1";
    const usaOnly = "&LH_PrefLoc=1";
    const completeURL = base.concat(keywords, category, completed, sold, usaOnly);
    return completeURL;
}
function createCamelURL(isbn) {
    return `https://camelcamelcamel.com/product/${isbn}`;
}
