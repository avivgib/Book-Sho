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
                    <button class="update">Update</button> 
                    <button class="delete">Delete</button> 
                </th>
            </tr>`
    )

    elBooks.innerHTML = strHTMLs.join('')
}