'use strict'

const LAYOUT_KEY = 'layuot_db'
var gLayout = loadFromStorage(LAYOUT_KEY) || 'table'

function onInit() {
    renderBooks()
}

function renderBooks() {
    const books = getBooks()
    renderBooksTable(books)
}

function renderBooksTable(books) {
    const elBooks = document.querySelector('.books-container tbody')
    
    const strHTMLs = books.map(book =>
        `<tr>
                <th>${book.title}</th>
                <th>$${book.price}</th>
                <th class="actions">
                    <button class="read-btn" onclick="handleOpenModal(event, '${book.id}')">Read</button> 
                    <button class="update-btn" onclick="onUpdateBook(event, '${book.id}')">Update</button> 
                    <button class="delete-btn" onclick="onRemoveBook(event, '${book.id}')">Delete</button> 
                </th>
            </tr>`
    )
    
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
                    <article>Price: ${book.price} ILS</article>
                    <article>Author: ${book.author}</article>
                    <article>Print Length: ${book.printLength} pages</article>
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
}

function onSetFilterBy(ev, elInput) {
    ev.stopPropagation()

    // Model
    var filterBy = elInput.value
    setFilterBy(filterBy) 

    //DOM
    renderBooks()
}

function onClearFilter(ev) {
    ev.stopPropagation()
    
    document.querySelector('.input-filter').value = ''
    gBooks = loadFromStorage(STORAGE_KEY)
    
    //DOM
    renderBooks()
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