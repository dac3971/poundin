"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Info {
    constructor(itemID) {
        
        this._url = `https://www.ebay.com/itm/${itemID}`;
        this._itemID = itemID;
        this._isbn = null;
        this._title = null;
        this._price = null;
        this.bids = null;

        this.listingOptions = {
            _buyItNow : null,
            _bid : null,
            _bestOffer : null
        }
        
    }
    get data() {
        return {
            itemID: this._itemID,
            title: this._title,
            isbn: this._isbn,
            price: this._price,
            url: this._url,
            listingOptions: this.listingOptions
        };
    }
}
exports.Info = Info;
