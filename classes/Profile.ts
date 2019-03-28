export class Profile {
    constructor(
        private isbn: string,
        private title?: string,
        private edition?: string,
        private author?: string,
        private avgPrice?: number,
        private imgURL?: string,
        private supply?: number,
        private demand?: number
    ){
    }
    get data(): object {
        return {
            isbn: this.isbn,
            title: this.title,
            edition: this.edition,
            author: this.author,
            avgPrice: this.avgPrice,
            imgURL: this.imgURL,
            supply: this.supply,
            demand: this.demand
        }
    }
}
