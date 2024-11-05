'use strict'

const gBooks = [
    { id: 'b101', title: 'Harry Potter and the Cursed Child', price: 88, imgUrl: 'harry-potter-and-the-cursed-child.jpg', author: 'J.K. Rowling' },
    { id: 'b102', title: 'The Son of Neptune', price: 60, imgUrl: 'the-son-of-neptune.jpg', author: 'Rick Riordan' },
    { id: 'b103', title: 'No Strangers Here', price: 64, imgUrl: 'no-strangers-here.jpg', author: 'Carlene O\'Connor' },
    { id: 'b104', title: 'The Five', price: 75, imgUrl: 'the-five.jpg', author: 'Hallie Rubenhold' }
]

function getBooks() {
    return gBooks
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIdx, 1)
}

function updateBook(bookId) {
    const book = gBooks.find(book => book.id === bookId)
    const newPrice = +prompt('Book new price?', book.price)
    book.price = newPrice
}
