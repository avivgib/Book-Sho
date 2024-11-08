'use strict'

const STORAGE_KEY = 'books'
var gFilterBy = ''

var gBooks = []
_createBooks()

function getBooks() {
    var books = gBooks

    if (gFilterBy) {
        books = books.filter((book) =>
            book.title.toLowerCase().startsWith(gFilterBy.toLowerCase())
        )
    }
    return books
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    if (bookIdx !== -1) gBooks.splice(bookIdx, 1)

    _saveBooks()
}

function updateBook(bookId, newPrice) {
    const book = findBook(bookId)
    book.price = newPrice

    _saveBooks()
}

function addBook(title, price) {
    const newBook = _createBook(title, price)
    gBooks.unshift(newBook)

    _saveBooks()
}


function _createBooks() {
    gBooks = loadFromStorage(STORAGE_KEY)
    if (gBooks && gBooks.length > 0) return

    gBooks = [
        _createBook('Harry Potter and the Cursed Child', 88, 'harry-potter-and-the-cursed-child.jpg', 'J.K. Rowling', 398, 'Pottermore Publishing', 'July 25, 2017'),
        _createBook('The Son of Neptune', 60, 'the-son-of-neptune.jpg', 'Rick Riordan', 546, 'Disney Hyperion', 'October 4, 2011'),
        _createBook('No Strangers Here', 64, 'no-strangers-here.jpg', 'Carlene O\'Connor', 400, 'Kensington', 'August 29, 2023'),
        _createBook('The Five', 75, 'the-five.jpg', 'Hallie Rubenhold', 368, 'Mariner Books', 'March 3, 2020')
    ]

    _saveBooks()
}

function _createBook(title, price, imgUrl, author, printLength, publisher, publicationDate) {
    return {
        id: makeId(),
        title,
        price,
        imgUrl,
        author,
        printLength,
        publisher,
        publicationDate
    }
}

function _saveBooks() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function setFilterBy(filterBy) {
    gFilterBy = filterBy
}

