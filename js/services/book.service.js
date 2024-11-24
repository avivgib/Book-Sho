'use strict'

const STORAGE_KEY = 'books_db'

// Global Variables
var gFilterBy = ''
var gBooks = []
_createBooks()

//Main Functions
function getBooks(options = {}) {
    const {filterBy, sortBy, page} = options

    var books = _sortBooks(sortBy)
    books = _filterBooks(filterBy)

    const startIdx = page.idx * page.size
    const endIdx = startIdx + page.size
    return books.slice(startIdx, endIdx)
}

function addBook(title, price, author, printLength, publisher, publicationDate, rating) {
    const newBook = _createBook(title, price, author, printLength, publisher, publicationDate, rating)
    gBooks.push(newBook)
    _saveBooks()
    showSuccessMsg('added')
}

function updateBook(bookId, title, price, author, printLength, publisher, publicationDate, rating) {
    const book = findBook(bookId)
    if (!book) return

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

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    if (bookIdx === -1) return
    
    gBooks.splice(bookIdx, 1)
    _saveBooks()
    showSuccessMsg('removed')
}

function getPageCount(options) {
    const {filterBy, page} = options

    const booksSum = _filterBooks(filterBy).length
    return Math.ceil(booksSum / page.size)
}



function _sortBooks(sortBy) {
    if (!sortBy) return gBooks

    const {sortType, dir} = sortBy
    const multiplier = dir === 'descending' ? -1 : 1

    if (sortType === 'by-title') gBooks = gBooks.toSorted((a, b) => a.title.localeCompare(b.title) * multiplier)
    else if (sortType === 'by-price') gBooks = gBooks.toSorted((a, b) => (a.price - b.price) * multiplier)
    else if (sortType === 'by-rating') gBooks = gBooks.toSorted((a, b) => (a.rating - b.rating) * multiplier)

    return gBooks
}

function _filterBooks(filterBy) {
    if (!filterBy) return gBooks
    
    const {txt, rating} = filterBy
    var books = gBooks

    // Filter by 
    if (txt) books = books.filter((book) => book.title.toLowerCase().includes(txt.toLowerCase()))

    // Filter by rating    
    if (rating.value) {
        books = books.filter(book =>
            rating.dir === 'max'
                ? book.rating <= rating.value
                : book.rating >= rating.value)
    }
    return books
}

// Book Creation and Storage
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
        price: parseFloat(price).toFixed(2),
        author: author || '',
        printLength: printLength || '',
        publisher: publisher || '',
        publicationDate: publicationDate || '',
        rating: rating || 0,
        imgUrl: imgUrl || '../img/no-image-available.jpg'
    }
}

function _saveBooks() {
    saveToStorage(STORAGE_KEY, gBooks)
}

// Utility Functions
function setFilterByRating(filterBy) {
    gQueryOptions.filterBy = filterBy
}

function getBookStatistics() {
    return gBooks.reduce((acc, book) => {
        if (book.price > 120) acc.expensive++
        else if (book.price < 80) acc.cheap++
        else acc.average++
        return acc
    }, { cheap: 0, average: 0, expensive: 0 })
}

function clearDataFilters() {
    gQueryOptions.filterBy.txt = ''
    gQueryOptions.filterBy.rating.value = 0
    gQueryOptions.filterBy.rating.dir = 'min'
}

function changeSort(sortBy) {
    gQueryOptions.sortBy.sortType = sortBy
}

function toggleSortDirection() {
    if (gQueryOptions.sortBy.dir === 'ascending') {
        gQueryOptions.sortBy.dir = 'descending'
        return
    }
    gQueryOptions.sortBy.dir = 'ascending'
}

function toggleFilterDirection() {
    if (gQueryOptions.filterBy.rating.dir === 'min') {
        gQueryOptions.filterBy.rating.dir = 'max'
        return
    }
    gQueryOptions.filterBy.rating.dir = 'min'
}
