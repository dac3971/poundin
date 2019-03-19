const express = require("express");
const cheerio = require("cheerio");
const request = require("request");
const rp = require("request-promise");
const url = require('url');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const listing = require('./models').listing;
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
        promiseArray.push(getPromise(concise(href)));
    });
    const arrayOfInfoObjects = await Promise.all(promiseArray);
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
    const info = await getPromise('https://www.ebay.com/itm/183737719795');
    res.send(info);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started on port ${PORT}`));
async function getPromise(url) {
    const urlArr = url.split('/');
    const itemID = urlArr[urlArr.length - 1];
    const html = await rp.get(url);
    const $ = cheerio.load(html);
    const isbn = $('[itemprop=productID]').text();
    const title = $('h1.it-ttl').text();
    const price = $('span#prcIsum').attr('content');
    const info = new Info(itemID, isbn, title, +price);
    return info.data;
}
function concise(url) {
    const shortened = url.split('?')[0];
    const shortArr = shortened.split('/');
    const id = shortArr[shortArr.length - 1];
    return `https://www.ebay.com/itm/${id}`;
}
class Info {
    constructor(itemID, isbn, title, price) {
        this._itemID = itemID;
        this._isbn = isbn;
        this._title = title;
        this._price = price;
        this._url = `https://www.ebay.com/itm/${itemID}`;
    }
    get itemID() {
        return this._itemID;
    }
    get isbn() {
        return this._isbn;
    }
    get title() {
        return this._title;
    }
    get price() {
        return this._price;
    }
    get url() {
        return this._url;
    }
    get data() {
        return {
            itemID: this._itemID,
            title: this._title,
            isbn: this._isbn,
            price: this._price,
            url: this._url
        };
    }
}
