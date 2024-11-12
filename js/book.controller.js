'use strict'

const LAYOUT_KEY = 'layuot'
var gLayout = loadFromStorage(LAYOUT_KEY) || 'table'

// Initialization and Render
function onInit() {
    renderBooks()
}

function renderBooks() {
    const books = getBooks()
    if (gLayout === 'table') renderBooksTable(books)
    else renderBooksCards(books)
    renderStatistics()
}

function renderBooksTable(books) {
    const elBooks = document.querySelector('.books-container tbody')
    if (!elBooks) return

    if (!books.length) {
        elBooks.innerHTML = `
            <tr>
                <th colspan="4" class="on-books-message">No matching books were found...</th>
            </tr>`
        return
    }

    const strHTMLs = books.map(book =>
        `<tr>
                <th>${book.title}</th>
                <th>$${book.price}</th>
                <th>${getStarsRating(book.rating)}</th>
                    <th class="actions">
                    <button class="show-details-btn" onclick="handleOpenModal(event, '${book.id}')">Details</button> 
                    <button class="update-btn" onclick="onUpdateBook(event, '${book.id}')">Update</button> 
                <button class="delete-btn" onclick="onRemoveBook(event, '${book.id}')">Delete</button> 
                </th>
        </tr>`
    )

    document.querySelector('.cards-container').innerHTML = ''
    hideElemet('.cards-container')
    showElemet('.table-container')
    elBooks.innerHTML = strHTMLs.join('')
}

function renderBooksCards(books) {
    const elBooks = document.querySelector('.cards-container')
    if (!elBooks) return

    if (!books.length) {
        elBooks.innerHTML = `<div class="book-card">No matching books were found...</div>`
        return
    }

    const strHTMLs = books.map(book =>
        `<div class="book-preview">
                <button class="close-btn" onclick="onRemoveBook(event, '${book.id}')">x</button>
                <h5>${book.title}</h5>
                <h6> 
                    <div>Price: <span> $${book.price}</span> </div>
                    <span>${getStarsRating(book.rating)}</span>
                </h6>
                <button class="show-details-btn" onclick="handleOpenModal(event, '${book.id}')">Details</button>
                <button class="update-btn" onclick="onUpdateBook(event, '${book.id}')">Update</button>
                <img src="img/${book.imgUrl}">
            </div>
            `)

    hideElemet('.table-container')
    showElemet('.cards-container')
    elBooks.innerHTML = strHTMLs.join('')
}

function renderStatistics() {
    const bookStatistics = getBookStatistics()
    const elCheapCount = document.querySelector('.cheap-count')
    const elAverageCount = document.querySelector('.average-count')
    const elExpensiveCount = document.querySelector('.expensive-count')

    const cheapText = formatCountText(bookStatistics.cheap, 'cheap')
    const averageText = formatCountText(bookStatistics.average, 'average')
    const expensiveText = formatCountText(bookStatistics.expensive, 'expensive')

    elCheapCount.innerHTML = cheapText
    elAverageCount.innerHTML = averageText
    elExpensiveCount.innerHTML = expensiveText
}

function formatCountText(count, type) {
    if (count === 0) return `No ${type} books`
    else if (count === 1) {
        if (type === 'average') return `1 ${type}-priced book`
        else return `1 ${type} book`
    }
    else return `${count} ${type} books`
}

// Book Actions
function onAddBook(ev) {
    handleOpenForm(ev)
}

function onRemoveBook(ev, bookId) {
    ev.stopPropagation()
    const isApprovedRemoving = confirm('Are you sure you want to remove this book?')
    if (!isApprovedRemoving) {
        showErrorMsg('remove')
        return
    }

    // Model
    removeBook(bookId)

    //DOM
    renderBooks()
    renderStatistics()
}

function onUpdateBook(ev, bookId) {
    ev.stopPropagation()
    const newPrice = +prompt('Enter a new price', bookId.price)
    if (!newPrice) {
        showErrorMsg('update')
        return
    }

    // Model
    updateBook(bookId, newPrice)

    //DOM
    renderBooks()
    renderStatistics()
}

function handleOpenModal(ev, bookId) {
    ev.stopPropagation()

    // DOM
    const elBackDrop = document.querySelector('.backdrop')
    elBackDrop.style.opacity = '1'
    elBackDrop.style.pointerEvents = 'auto'

    const elDetails = document.querySelector('.details-container')
    const book = findBook(bookId)
    const strHTML = renderBookDetailsModal(book)
    elDetails.innerHTML = strHTML
}

function handleCloseModal(ev) {
    ev.stopPropagation()

    const targetClass = ev.target.classList
    if (targetClass.contains('backdrop') || targetClass.contains('close-btn')) {
        const elBackDrop = document.querySelector('.backdrop')
        elBackDrop.style.opacity = '0'
        elBackDrop.style.pointerEvents = 'none'
    }
}

function handleOpenForm(ev) {
    ev.stopPropagation()

    document.querySelector('.add-book-container').classList.remove("hide")
    // DOM
    const elBackDrop = document.querySelector('.add-class-backdrop')
    elBackDrop.style.opacity = '1'
    elBackDrop.style.pointerEvents = 'auto'

    const elForm = document.querySelector('.form')
    const strHTML = renderAddBookForm()
    elForm.innerHTML = strHTML
}

function handleCloseForm(ev) {
    ev.stopPropagation()

    const targetClass = ev.target.classList
    if (targetClass.contains('add-class-backdrop') || targetClass.contains('close-btn')) {
        const elBackDrop = document.querySelector('.add-class-backdrop')
        elBackDrop.style.opacity = '0'
        elBackDrop.style.pointerEvents = 'none'
        document.querySelector('.add-book-container').classList.add('hide')
    }
}

function handleSubmit(ev) {
    ev.stopPropagation()
    ev.preventDefault()

    const title = document.getElementById('title').value
    let price = document.getElementById('price').value
    const author = document.getElementById('author').value
    const printLength = document.getElementById('pages').value
    const publisher = document.getElementById('publisher').value
    const publicationDate = document.getElementById('publication-date').value
    const rating = document.getElementById('rating').value

    addBook(title, price, author, printLength, publisher, publicationDate, rating)

    //DOM
    renderBooks()
    renderStatistics()
    document.querySelector('.add-book-container').classList.add('hide')
}

// Book Layout and Display
function onChangeLayout(layout) {
    gLayout = layout
    saveToStorage(LAYOUT_KEY, gLayout)
    renderBooks()
}

function onSetFilterBy(ev, elInput) {
    ev.stopPropagation()

    // Model
    var filterBy = elInput.value
    setFilterBy(filterBy)

    //DOM
    renderBooks()
    renderStatistics()
}

function onClearFilter(ev) {
    ev.stopPropagation()

    document.querySelector('.input-filter').value = ''
    gBooks = loadFromStorage(STORAGE_KEY)

    //DOM
    setFilterBy('')
    renderBooks()
    renderStatistics()
}

// Sort Functions
function onSortByTitle(order) {
    document.querySelector('.descending-title-sort').classList.toggle('hide')
    document.querySelector('.ascending-title-sort').classList.toggle('hide')

    sortByTitle(order)
    renderBooks()
}

function onSortByPrice(order) {
    document.querySelector('.descending-price-sort').classList.toggle('hide')
    document.querySelector('.ascending-price-sort').classList.toggle('hide')

    sortByPrice(order)
    renderBooks()
}

function onSortByRating(order) {
    document.querySelector('.descending-rating-sort').classList.toggle('hide')
    document.querySelector('.ascending-rating-sort').classList.toggle('hide')

    sortByRating(order)
    renderBooks()
}

// Helper Functions 
function getStarsRating(rating) {
    return '⭐'.repeat(rating)
}

function renderBookDetailsModal(book) {
    return `<pre>
                <img class="book-cover" src="img/${book.imgUrl}" alt="${book.title} cover">
                <div class="book-info">
                    <article>Title: ${book.title}</article>
                    <article>Price: $${book.price}</article>
                    <article>Author: ${book.author}</article>
                    <article>Print Length: ${book.printLength}</article>
                    <article>Publisher: ${book.publisher}</article>
                    <article>publication Date: ${book.publicationDate}</article>
                    <article>Rating: ${getStarsRating(book.rating)}</article>
                </div>
            </pre>`
}

function renderAddBookForm() {
    return `<form onsubmit="handleSubmit(event)" class="add-book-form">
                <label for="add-book-form-title" class="add-book-form-title">Add New Book</label>

                <label for="title">Title:</label>
                <input type="text" id="title" name="title" required>

                <label for="price">Price:</label>
                <input type="number" id="price" name="price" min="1" max="1000" step=".01" required>
                
                <label for="author">Author:</label>
                <input type="text" id="author" name="author">
                
                <label for="pages">Print Length(pages):</label>
                <input type="number" id="pages" name="pages" min="1" max="1000">
                
                <label for="publisher">Publisher:</label>
                <input type="text" id="publisher" name="publisher">
                
                <label for="publication-date">Publication Date:</label>
                <input type="date" id="publication-date" name="publication-date">
                
                <label for="rating">Rating:</label>
                <input type="number" id="rating" name="rating" min="1" max="5" value="0">
                
                <input type="submit" id="submit" value="Submit">
            </form>`
}

function showSuccessMsg(action) {
    const elUserMsg = document.querySelector('.user-msg')
    elUserMsg.classList.add('success')
    elUserMsg.innerHTML = `Successfully ${action} the book.`
    elUserMsg.classList.remove('hide')

    setTimeout(() => {
        elUserMsg.classList.add('hide')
        elUserMsg.classList.remove('success')
    }, 3000);
}

function showErrorMsg(action) {
    const elUserMsg = document.querySelector('.user-msg')
    elUserMsg.classList.add('error')
    elUserMsg.innerHTML = `Failed to ${action} the book.`
    elUserMsg.classList.remove('hide')

    setTimeout(() => {
        elUserMsg.classList.add('hide')
        elUserMsg.classList.remove('error')
    }, 3000);
}

function showElemet(element) {
    const elToShow = document.querySelector(element)
    elToShow.classList.remove('hide')
}

function hideElemet(element) {
    const elToHide = document.querySelector(element)
    elToHide.classList.add('hide')
}

