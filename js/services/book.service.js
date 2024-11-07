'use strict'

const STORAGE_KEY = 'books'
const gBooks = [
    { 
        id: makeId(), 
        title: 'Harry Potter and the Cursed Child', 
        price: 88, 
        imgUrl: 'harry-potter-and-the-cursed-child.jpg', 
        author: 'J.K. Rowling',
        printLength: 398,
        publisher: 'Pottermore Publishing',
        publicationDate: 'July 25, 2017'
    },
    { 
        id: makeId(), 
        title: 'The Son of Neptune', 
        price: 60, 
        imgUrl: 'the-son-of-neptune.jpg', 
        author: 'Rick Riordan',
        printLength: 546,
        publisher: 'Disney Hyperion',
        publicationDate: 'October 4, 2011'
    },
    { 
        id: makeId(), 
        title: 'No Strangers Here', 
        price: 64, 
        imgUrl: 'no-strangers-here.jpg', 
        author: 'Carlene O\'Connor',
        printLength: 400,
        publisher: 'Kensington',
        publicationDate: 'August 29, 2023'
    },
    { 
        id: makeId(), 
        title: 'The Five', 
        price: 75, 
        imgUrl: 'the-five.jpg', 
        author: 'Hallie Rubenhold',
        printLength: 368,
        publisher: 'Mariner Books',
        publicationDate: 'March 3, 2020'
    }
]

function getBooks() {
    return gBooks
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIdx, 1)
}

function updateBook(bookId) {
    const book = findBook(bookId)
    const newPrice = +prompt('Book new price?', book.price)
    book.price = newPrice
}

function addBook() {
    const bookTitle = prompt('Title new book?')
    const bookPrice = +prompt('Price new book?')
    if (!bookTitle || !bookPrice) return

    const newBook = _createBook(bookTitle, bookPrice)
    gBooks.unshift(newBook)
}

function _createBook(bookTitle, bookPrice) {
    return {
        id: makeId(),
        title: bookTitle,
        price: bookPrice
    }
}