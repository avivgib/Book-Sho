'use strict'

function onInit() {
    renderBooks()
}

function renderBooks() {
    const elBooks = document.querySelector('.books-container tbody')

    const strHTMLs = gBooks.map(book =>
        `<tr>
                <th>${book.title}</th>
                <th>${book.price} ILS</th>
                <th class="actions">
                    <button class="read" onclick="handleOpenModal(event, '${book.id}')">Read</button> 
                    <button class="update" onclick="onUpdateBook(event, '${book.id}')">Update</button> 
                    <button class="delete" onclick="onRemoveBook(event, '${book.id}')">Delete</button> 
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

    // Model
    updateBook(bookId)

    //DOM
    renderBooks()
}

function onRemoveBook(ev, bookId) {
    ev.stopPropagation()

    // Model
    removeBook(bookId)

    //DOM
    renderBooks()
}

function onAddBook() {
    // Model
    addBook()

    //DOM
    renderBooks()
}