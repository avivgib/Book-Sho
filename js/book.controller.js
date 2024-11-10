'use strict'

const LAYOUT_KEY = 'layuot'
var gLayout = loadFromStorage(LAYOUT_KEY) || 'table'

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
                <th colspan="3" class="on-books-message">No matching books were found...</th>
            </tr>`
        return
    }

    const strHTMLs = books.map(book =>
        `<tr>
                <th>${book.title}</th>
                <th>$${book.price}</th>
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
                <h6>Price: <span>$${book.price}</span> </h6>
                <button class="show-details-btn" onclick="handleOpenModal(event, '${book.id}')">Details</button>
                <button class="update-btn" onclick="onUpdateBook(event, '${book.id}')">Update</button>
                <img src="img/${book.imgUrl}">
            </div>
            `)

    hideElemet('.table-container')
    showElemet('.cards-container')
    elBooks.innerHTML = strHTMLs.join('')
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
                </div>
            </pre>`
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

function renderStatistics() {
    const bookStatistics = getBookStatistics()

    document.querySelector('.cheap-count span').innerHTML = bookStatistics.cheap
    document.querySelector('.average-count span').innerHTML = bookStatistics.average
    document.querySelector('.expensive-count span').innerHTML = bookStatistics.expensive
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

function onAddBook() {
    const bookTitle = prompt('Book title')
    const bookPrice = +prompt('Book price')
    if (!bookTitle || !bookPrice) {
        showErrorMsg('add')
        return
    }

    // Model
    addBook(bookTitle, bookPrice)

    //DOM
    renderBooks()
    renderStatistics()
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

function showSuccessMsg(txt) {
    const elUserMsg = document.querySelector('.user-msg')
    elUserMsg.classList.add('success')
    elUserMsg.innerHTML = `Successfully ${txt} book.`
    elUserMsg.classList.remove('hide')

    setTimeout(() => {
        elUserMsg.classList.add('hide')
        elUserMsg.classList.remove('success')
    }, 3000);
}

function showErrorMsg(txt) {
    const elUserMsg = document.querySelector('.user-msg')
    elUserMsg.classList.add('error')
    elUserMsg.innerHTML = `Failed to ${txt} book.`
    elUserMsg.classList.remove('hide')

    setTimeout(() => {
        elUserMsg.classList.add('hide')
        elUserMsg.classList.remove('error')
    }, 3000);
}

function onChangeLayout(layout) {
    gLayout = layout
    saveToStorage(LAYOUT_KEY, gLayout)
    renderBooks()
}

function showElemet(element) {
    const elToShow = document.querySelector(element)
    elToShow.classList.remove('hide')
}

function hideElemet(element) {
    const elToHide = document.querySelector(element)
    elToHide.classList.add('hide')
} 