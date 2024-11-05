'use strict'

function onInit() {
    renderBooks()
}

function renderBooks() {
    const elBooks = document.querySelector('.books-container tbody')

    const strHTMLs = gBooks.map(book =>
        `<tr>
                <th>${book.title}</th>
                <th>${book.price}</th>
                <th><img src="img/${book.imgUrl}" alt="${book.title} cover"></th>
                <th class="actions">
                    <button class="read">Read</button> 
                    <button class="update" onclick="onUpdateBook(event, '${book.id}')">Update</button> 
                    <button class="delete" onclick="onRemoveBook(event, '${book.id}')">Delete</button> 
                </th>
            </tr>`
    )

    elBooks.innerHTML = strHTMLs.join('')
}

function onRemoveBook(ev, bookId) {
    ev.stopPropagation()

    // Model
    removeBook(bookId)
    
    //DOM
    renderBooks()
}

function onRemoveBook(ev, bookId) {
    ev.stopPropagation()

    // Model
    updateBook(bookId)
    
    //DOM
    renderBooks()
}

function onUpdateBook(ev, bookId) {
    ev.stopPropagation()

    // Model
    updateBook(bookId)
    
    //DOM
    renderBooks()
}
