'use strict'

const gBooks = [
    { id: 'b104', title: 'Harry Potter and the Cursed Child', price: 88, imgUrl: 'harry-potter-and-the-cursed-child.jpg', author: 'J.K. Rowling' },
    { id: 'b103', title: 'The Son of Neptune', price: 60, imgUrl: 'the-son-of-neptune.jpg', author: 'Rick Riordan' },
    { id: 'b102', title: 'No Strangers Here', price: 64, imgUrl: 'no-strangers-here.jpg', author: 'Carlene O\'Connor' },
    { id: 'b101', title: 'The Five', price: 75, imgUrl: 'the-five.jpg', author: 'Hallie Rubenhold' }
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

function addBook() {
    const bookTitle = prompt('Title new book?')
    const bookPrice = +prompt('Price new book?')
    if (!bookTitle || !bookPrice) return

    const maxId = gBooks.reduce((max, book) => {
        const idNum = parseInt(book.id.slice(1))
        return idNum > max ? idNum : max
    }, 100)

    const newBook = {
        id: `b${maxId + 1}`,
        title: bookTitle,
        price: bookPrice
    }
    
    gBooks.unshift(newBook)
}