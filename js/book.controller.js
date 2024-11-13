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
                <img src="img/${book.imgUrl}">
                <h6> 
                    <div>Price: <span> $${book.price}</span> </div>
                    <span>${getStarsRating(book.rating)}</span>
                </h6>
                <button class="show-details-btn" onclick="handleOpenModal(event, '${book.id}')">Details</button>
                <button class="update-btn" onclick="onUpdateBook(event, '${book.id}')">Update</button>
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
    handleOpenForm(ev, 'add')
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
    const book = findBook(bookId)
    handleOpenForm(ev, 'update', book)
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
    cleanFormFields()
}

function cleanFormFields() {
    document.querySelector('.add-book-form-title').innerHTML = 'Edit Book'
    document.getElementById('title').value = ''
    document.getElementById('price').value = ''
    document.getElementById('author').value = ''
    document.getElementById('pages').value = ''
    document.getElementById('publisher').value = ''
    document.getElementById('publication-date').value = ''
    document.getElementById('rating').value = 0
}

function handleOpenForm(ev, action, bookToEdit = null) {
    ev.stopPropagation()

    document.querySelector('.add-book-container').classList.remove("hide")
    const elBackDrop = document.querySelector('.add-class-backdrop')
    elBackDrop.style.opacity = '1'
    elBackDrop.style.pointerEvents = 'auto'

    const elForm = document.querySelector('.form')
    elForm.dataset.action = action
    elForm.dataset.bookId = bookToEdit ? bookToEdit.id : null

    action === 'add' ? renderBookForm() : renderBookForm(bookToEdit)
    // const strHTML = action === 'add' ? renderAddBookForm() : renderUpdateBookForm(bookToEdit)
    // elForm.innerHTML = strHTML
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

    const form = ev.target.closest('.form')
    const action = form.dataset.action
    const bookId = form.dataset.bookId

    const title = document.getElementById('title').value
    let price = document.getElementById('price').value
    const author = document.getElementById('author').value
    const printLength = document.getElementById('pages').value
    const publisher = document.getElementById('publisher').value
    const publicationDate = document.getElementById('publication-date').value
    const rating = document.getElementById('rating').value

    if (bookId && action === 'update') {
        updateBook(bookId, title, price, author, printLength, publisher, publicationDate, rating)
    } else {
        addBook(title, price, author, printLength, publisher, publicationDate, rating)
    }

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
    return `
                <img class="book-cover" src="img/${book.imgUrl}" alt="${book.title} cover">
                <div class="book-info">
                    <article><h3>${book.title}</h3></article>
                    <article>Price: $${book.price}</article>
                    <article>Author: ${book.author}</article>
                    <article>Print Length: ${book.printLength} pages</article>
                    <article>Publisher: ${book.publisher}</article>
                    <article>publication Date: ${book.publicationDate}</article>
                    <article>Rating: ${getStarsRating(book.rating)}</article>
                </div>`
}

// function onOpenModal(bookId) {

//     if (bookId) {
//         title => book.title
//         price => book.price
//     }
//     // show modal
// }
function renderBookForm(book = null) {
    if (!book) {
        resetBookForm()
        return
    }

    document.querySelector('.add-book-form-title').innerHTML = 'Edit Book'
    document.getElementById('title').value = book.title
    document.getElementById('price').value = book.price
    document.getElementById('author').value = book.author
    document.getElementById('pages').value = book.printLength
    document.getElementById('publisher').value = book.publisher
    document.getElementById('publication-date').value = book.publicationDate
    document.getElementById('rating').value = book.rating
}

function resetBookForm() {
    document.querySelector('.add-book-form-title').innerHTML = 'Add New Book'
    document.getElementById('title').value = ''
    document.getElementById('price').value = ''
    document.getElementById('author').value = ''
    document.getElementById('pages').value = ''
    document.getElementById('publisher').value = ''
    document.getElementById('publication-date').value = ''
    document.getElementById('rating').value = ''
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

