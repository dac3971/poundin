export class Info {
    constructor(
        private listingID:  string,
        private isbn?: string,
        private title?: string,
        private edition?: string,
        private author?: string,
        private price?: number,
        private endTimestamp?: number,
        private auction?: boolean,
        private buyItNow?: boolean,
        private bestOffer?: boolean,
        private seller?: string,
        private sellerCt?: number
    ){
    }
    get data(): object {
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
        }
    }
}
