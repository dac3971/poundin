"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function concise(url) {
    const shortened = url.split('?')[0];
    const shortArr = shortened.split('/');
    const id = shortArr[shortArr.length - 1];
    return `https://www.ebay.com/itm/${id}`;
}
exports.concise = concise;
