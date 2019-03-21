export class Info {
    private _itemID: string
    private _url: string
    private _isbn: string
    private _title: string
    private _price: number
    constructor(itemID: string,isbn?: string,title?: string,price?: number){
        this._itemID = itemID
        this._isbn = isbn
        this._title = title
        this._price = price
        this._url = `https://www.ebay.com/itm/${itemID}`
    }
    get data(): object {
        return {
            itemID: this._itemID,
            title: this._title,
            isbn: this._isbn,
            price: this._price,
            url: this._url
        }
    }
}