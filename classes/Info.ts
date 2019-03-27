export class Info {
    // private _itemID: string
    // private _url: string
    // private _isbn: string
    // private _title: string
    // private _price: number
    // private _listingOptions: object
    // constructor(itemID: string,isbn?: string,title?: string,price?: number,listingOptions?: object){
    //     this._itemID = itemID
    //     this._isbn = isbn
    //     this._title = title
    //     this._price = price
    //     this._url = `https://www.ebay.com/itm/${itemID}`
    //     this._listingOptions = listingOptions
    // }
    constructor(
        private itemID:  string,
        private isbn?: string,
        private title?: string,
        private price?: number,
        // private listingOptions?: object,
        private auction?: boolean,
        private buyItNow?: boolean,
        private bestOffer?: boolean
    ){
    }
    get data(): object {
        return {
            itemID: this.itemID,
            title: this.title,
            isbn: this.isbn,
            price: this.price,
            url: `https://www.ebay.com/itm/${this.itemID}`,
            // listingOptions: this.listingOptions
            auction: this.auction,
            buyItNow: this.buyItNow,
            bestOffer: this.bestOffer
        }
    }
}
