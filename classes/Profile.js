"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Profile {
    constructor(isbn, title, edition, author, avgPrice, imgURL, supply, demand) {
        this.isbn = isbn;
        this.title = title;
        this.edition = edition;
        this.author = author;
        this.avgPrice = avgPrice;
        this.imgURL = imgURL;
        this.supply = supply;
        this.demand = demand;
    }
    get data() {
        return {
            isbn: this.isbn,
            title: this.title,
            edition: this.edition,
            author: this.author,
            avgPrice: this.avgPrice,
            imgURL: this.imgURL,
            supply: this.supply,
            demand: this.demand
        };
    }
}
exports.Profile = Profile;
