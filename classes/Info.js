"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Info {
    constructor(itemID, isbn, title, price) {
        this._itemID = itemID;
        this._isbn = isbn;
        this._title = title;
        this._price = price;
        this._url = `https://www.ebay.com/itm/${itemID}`;
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
exports.Info = Info;
