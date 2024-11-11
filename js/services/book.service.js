'use strict'

const STORAGE_KEY = 'books_db'
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
    showSuccessMsg('removed')
}

function updateBook(bookId, newPrice) {
    const book = findBook(bookId)
    book.price = padPrice(newPrice)

    _saveBooks()
    showSuccessMsg('updated')

}

function addBook(title, price, author, printLength, publisher, publicationDate) {
    const newBook = _createBook(title, price, author, printLength, publisher, publicationDate)
    gBooks.push(newBook)

    _saveBooks()
    showSuccessMsg('added')
}


function _createBooks() {
    gBooks = loadFromStorage(STORAGE_KEY)
    if (gBooks && gBooks.length > 0) return

    gBooks = [
        _createBook('Harry Potter and the Cursed Child', 140.5, 'J.K. Rowling', 398, 'Pottermore Publishing', '2017-07-25', 'harry-potter-and-the-cursed-child.jpg'),
        _createBook('The Son of Neptune', 60.4, 'Rick Riordan', 546, 'Disney Hyperion', '2011-10-04', 'the-son-of-neptune.jpg'),
        _createBook('No Strangers Here', 64.90, 'Carlene O\'Connor', 400, 'Kensington', '2023-08-29', 'no-strangers-here.jpg'),
        _createBook('The Five', 101.9, 'Hallie Rubenhold', 368, 'Mariner Books', '2020-03-03', 'the-five.jpg',)
    ]

    _saveBooks()
}

function _createBook(title, price, author, printLength, publisher, publicationDate, imgUrl) {
    return {
        id: makeId(),
        title,
        price: padPrice(price),
        author: author || '',
        printLength: printLength ? `${printLength} pages` : '',
        publisher: publisher || '',
        publicationDate: publicationDate || '',
        imgUrl: imgUrl || ''
    }
}

function padPrice(price) {
    const numericPrice = parseFloat(price)
    if (isNaN(numericPrice)) return price
    return numericPrice.toFixed(2)
}

function _saveBooks() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function setFilterBy(filterBy) {
    gFilterBy = filterBy
}

function getBookStatistics() {
    return gBooks.reduce((acc, book) => {
        if (book.price > 120) acc.expensive++
        else if (book.price < 80) acc.cheap++
        else acc.average++
        return acc
    }, { cheap: 0, average: 0, expensive: 0 })
}