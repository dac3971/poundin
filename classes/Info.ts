export class Info {
    constructor(
        private itemID:  string,
        private isbn?: string,
        private title?: string,
        private edition?: string,
        private author?: string,
        private price?: number,
        private endTimestamp?: number,
        private auction?: boolean,
        private buyItNow?: boolean,
        private bestOffer?: boolean
    ){
    }
    get data(): object {
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
        }
    }
}
