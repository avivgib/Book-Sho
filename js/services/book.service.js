'use strict'

const STORAGE_KEY = 'books_db'
var gFilterBy = ''
var gBooks = []
_createBooks()


//Main Functions
function getBooks(options = {}) {
    const filterBy = options.filterBy
    const sortBy = options.sortBy
    const page = options.page

    var books = _filterBooks(filterBy)

    return books
}

function _filterBooks(filterBy) {
    var books = gBooks
    
    // Filter by 
    if (filterBy.txt) books = books.filter((book) => book.title.toLowerCase().includes(filterBy.txt.toLowerCase()))
    
    // Filter by rating    
    if (filterBy.rating.value) {
        books = books.filter(book => 
            filterBy.rating.dir === 'max' 
            ? book.rating <= filterBy.rating.value
            : book.rating >= filterBy.rating.value)
    }
    return books
}

function addBook(title, price, author, printLength, publisher, publicationDate, rating) {
    const newBook = _createBook(title, price, author, printLength, publisher, publicationDate, rating)
    gBooks.push(newBook)

    _saveBooks()
    showSuccessMsg('added')
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    if (bookIdx !== -1) gBooks.splice(bookIdx, 1)

    _saveBooks()
    showSuccessMsg('removed')
}

function updateBook(bookId, title, price, author, printLength, publisher, publicationDate, rating) {
    const book = findBook(bookId)
    book.title = title
    book.price = price
    book.author = author
    book.printLength = printLength
    book.publisher = publisher
    book.publicationDate = publicationDate
    book.rating = rating

    _saveBooks()
    showSuccessMsg('updated')
}

// // Book Creation and Storage
function _createBooks() {
    gBooks = loadFromStorage(STORAGE_KEY)
    if (gBooks && gBooks.length > 0) return

    gBooks = [
        _createBook('Harry Potter and the Cursed Child', 140.5, 'J.K. Rowling', 398, 'Pottermore Publishing', '2017-07-25', 5, 'harry-potter-and-the-cursed-child.jpg'),
        _createBook('The Son of Neptune', 60.4, 'Rick Riordan', 546, 'Disney Hyperion', '2011-10-04', 5, 'the-son-of-neptune.jpg'),
        _createBook('No Strangers Here', 64.90, 'Carlene O\'Connor', 400, 'Kensington', '2023-08-29', 4, 'no-strangers-here.jpg'),
        _createBook('The Five', 90.77, 'Hallie Rubenhold', 368, 'Mariner Books', '2020-03-03', 3, 'the-five.jpg',),
        _createBook('Queen of Shadows', 135.9, 'Sarah J. Maas', 662, 'Bloomsbury Publishing', '2015-09-01', 4, 'queen-of-shadows.jpg',),
        _createBook('The Last Song', 101.9, 'Nicholas Sparks', 401, 'Grand Central Publishing', '2009-08-20', 2, 'the-last-song.jpg',),

        _createBook('Harry Potter and the Cursed Child', 140.5, 'J.K. Rowling', 398, 'Pottermore Publishing', '2017-07-25', 5, 'harry-potter-and-the-cursed-child.jpg'),
        _createBook('The Son of Neptune', 60.4, 'Rick Riordan', 546, 'Disney Hyperion', '2011-10-04', 5, 'the-son-of-neptune.jpg'),
        _createBook('No Strangers Here', 64.90, 'Carlene O\'Connor', 400, 'Kensington', '2023-08-29', 4, 'no-strangers-here.jpg'),
        _createBook('The Five', 90.77, 'Hallie Rubenhold', 368, 'Mariner Books', '2020-03-03', 3, 'the-five.jpg',),
        _createBook('Queen of Shadows', 135.9, 'Sarah J. Maas', 662, 'Bloomsbury Publishing', '2015-09-01', 4, 'queen-of-shadows.jpg',),
        _createBook('The Last Song', 101.9, 'Nicholas Sparks', 401, 'Grand Central Publishing', '2009-08-20', 2, 'the-last-song.jpg',)
    ]

    _saveBooks()
}

function _createBook(title, price, author, printLength, publisher, publicationDate, rating, imgUrl) {
    return {
        id: makeId(),
        title,
        price: padPrice(price),
        author: author || '',
        printLength: printLength || '',
        publisher: publisher || '',
        publicationDate: publicationDate || '',
        rating: rating || '',
        imgUrl: imgUrl || ''
    }
}

function _saveBooks() {
    saveToStorage(STORAGE_KEY, gBooks)
}

// Utility Functions
function padPrice(price) {
    const numericPrice = parseFloat(price)
    if (isNaN(numericPrice)) return price
    return numericPrice.toFixed(2)
}

// function setFilterBy(filterBy) {
//     gQueryOptions.filterBy = filterBy
// }

function getBookStatistics() {
    return gBooks.reduce((acc, book) => {
        if (book.price > 120) acc.expensive++
        else if (book.price < 80) acc.cheap++
        else acc.average++
        return acc
    }, { cheap: 0, average: 0, expensive: 0 })
}

// Sorting Functions
function sortByTitle(order) {
    const multiplier = order === 'descending' ? -1 : 1
    gBooks = gBooks.toSorted((a, b) => a.title.localeCompare(b.title) * multiplier)
}

function sortByPrice(order) {
    const multiplier = order === 'descending' ? -1 : 1
    gBooks = gBooks.toSorted((a, b) => (a.price - b.price) * multiplier)
}

function sortByRating(order) {
    const multiplier = order === 'descending' ? -1 : 1
    gBooks = gBooks.toSorted((a, b) => (a.rating - b.rating) * multiplier)
}

// Filtering Functions
function toggleFilterDirection() {
    if(gQueryOptions.filterBy.rating.dir === 'min') {
        gQueryOptions.filterBy.rating.dir = 'max'
        return
    }
    gQueryOptions.filterBy.rating.dir = 'min'
}