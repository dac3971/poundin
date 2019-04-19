"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Info {
    constructor(listingID, isbn, title, edition, author, price, endTimestamp, auction, buyItNow, bestOffer, seller, sellerCt) {
        this.listingID = listingID;
        this.isbn = isbn;
        this.title = title;
        this.edition = edition;
        this.author = author;
        this.price = price;
        this.endTimestamp = endTimestamp;
        this.auction = auction;
        this.buyItNow = buyItNow;
        this.bestOffer = bestOffer;
        this.seller = seller;
        this.sellerCt = sellerCt;
    }
    get data() {
        return {
            listingID: this.listingID,
            isbn: this.isbn,
            title: this.title,
            edition: this.edition,
            author: this.author,
            price: this.price,
            url: `https://www.ebay.com/itm/${this.listingID}`,
            endTimestamp: this.endTimestamp,
            auction: this.auction,
            buyItNow: this.buyItNow,
            bestOffer: this.bestOffer,
            seller: this.seller,
            sellerCt: this.sellerCt
        };
    }
}
exports.Info = Info;
