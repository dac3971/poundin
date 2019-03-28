"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Info {
    constructor(itemID, isbn, title, edition, author, price, endTimestamp, auction, buyItNow, bestOffer) {
        this.itemID = itemID;
        this.isbn = isbn;
        this.title = title;
        this.edition = edition;
        this.author = author;
        this.price = price;
        this.endTimestamp = endTimestamp;
        this.auction = auction;
        this.buyItNow = buyItNow;
        this.bestOffer = bestOffer;
    }
    get data() {
        return {
            itemID: this.itemID,
            isbn: this.isbn,
            title: this.title,
            edition: this.edition,
            author: this.author,
            price: this.price,
            url: `https://www.ebay.com/itm/${this.itemID}`,
            endTimestamp: this.endTimestamp,
            auction: this.auction,
            buyItNow: this.buyItNow,
            bestOffer: this.bestOffer
        };
    }
}
exports.Info = Info;
