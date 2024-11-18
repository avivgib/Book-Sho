'use strict'

const LAYOUT_KEY = 'layuot'
var gLayout = loadFromStorage(LAYOUT_KEY) || 'table'

const gQueryOptions = {
    filterBy: { txt: '', rating: {value: 0, dir: 'min'} },
    sortBy: {sortType: '', dir: 'ascending'},
    page: { idx: 0, size: 5 },
}

// Initialization and Render
function onInit() {
    renderBooks()
}

function renderBooks() {
    const books = getBooks(gQueryOptions)
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
                <th><span style="color: gold; font-size: 200%;">${getStarsRating(book.rating)}</span></th>
                    <th class="actions">
                    <button class="show-details-btn" onclick="handleOpenModal(event, '${book.id}')">Details</button> 
                    <button class="update-btn" onclick="onUpdateBook(event, '${book.id}')">Update</button> 
                    <button class="remove-btn" onclick="onRemoveBook(event, '${book.id}')">Remove</button> 
                </th>
        </tr>`
    )

    document.querySelector('.cards-container').innerHTML = ''
    hideElement('.cards-container')
    showElement('.table-container')
    elBooks.innerHTML = strHTMLs.join('')
}

function onStarClick(rating) {
    const stars = document.querySelectorAll('.stars-filter .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
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
                    <span style="color: gold; font-size: 200%;">${getStarsRating(book.rating)}</span>
                </h6>
                <button class="show-details-btn" onclick="handleOpenModal(event, '${book.id}')">Details</button>
                <button class="update-btn" onclick="onUpdateBook(event, '${book.id}')">Update</button>
            </div>
            `)

    hideElement('.table-container')
    showElement('.cards-container')
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
    document.querySelector('.title').value = ''
    document.querySelector('.price').value = ''
    document.querySelector('.author').value = ''
    document.querySelector('.pages').value = ''
    document.querySelector('.publisher').value = ''
    document.querySelector('.publication-date').value = ''
    document.querySelector('.rating').value = 0
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

    const title = document.querySelector('.title').value
    let price = document.querySelector('.price').value
    const author = document.querySelector('.author').value
    const printLength = document.querySelector('.pages').value
    const publisher = document.querySelector('.publisher').value
    const publicationDate = document.querySelector('.publication-date').value
    const rating = document.querySelector('.rating').value

    if (bookId && action === 'update') {
        updateBook(bookId, title, price, author, printLength, publisher, publicationDate, rating)
    } else {
        addBook(title, price, author, printLength, publisher, publicationDate, rating)
    }

    //DOM
    renderBooks()
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
    if (elInput.name ==='by-title') {
        gQueryOptions.filterBy.txt = elInput.value
    } else {
        const starsSelected = document.querySelectorAll('.star.selected').length
        gQueryOptions.filterBy.rating.value = starsSelected

        const dirRating = document.querySelector('.filter-stars-button span').innerHTML
        gQueryOptions.filterBy.rating.dir = dirRating
    }

    //DOM
    renderBooks()
}

function onClearFilter(ev) {
    ev.stopPropagation()

    // Clear string filter
    document.querySelector('.input-filter').value = ''

    // Clear stars rating
    clearRatingFilter()
    clearDataFilters()
    gBooks = loadFromStorage(STORAGE_KEY)

    // setFilterBy('')
    renderBooks()
}

function clearRatingFilter() {
    const stars = document.querySelectorAll('.stars-filter .star')
    stars.forEach(star => {
        const starValue = parseInt(star.getAttribute('data-value'))
        star.classList.remove('selected')
    })
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
    return '★'.repeat(rating).concat('☆'.repeat(5 - rating)) 
}

function onClickStarsFilter(minRating, ev, starElement) {
    gQueryOptions.filterBy.rating.value = 6 - minRating
    const stars = document.querySelectorAll('.stars-filter .star')

    stars.forEach(star => {
        const starValue = parseInt(star.getAttribute('data-value'))

        if (starValue < minRating) {
            star.classList.remove('selected')
        } else {
            star.classList.add('selected')
        }
    })

    onSetFilterBy(ev ,starElement)
}

function onToggleFilterDirection() {
    const elMinMaxStars = document.querySelector('.filter-stars-button span')
    elMinMaxStars.innerHTML = elMinMaxStars.innerHTML === 'min' ? 'max' : 'min'
    toggleFilterDirection()
    renderBooks()
} 

function onToggleSortDirection() {
    const elSortDirection = document.querySelector('.sorting-direction-button span')

    if (elSortDirection.classList.contains('descending-arrow')) {
        elSortDirection.classList.remove('descending-arrow')
        elSortDirection.classList.add('ascending-arrow')
    } else {
        elSortDirection.classList.remove('ascending-arrow')
        elSortDirection.classList.add('descending-arrow')
    }

    toggleSortDirection()

    //elSortDirection.innerHTML = elSortDirection.innerHTML === '&#x2B9F;' ? '&#x2B9D;' : '&#x2B9F;'
    renderBooks()
}

function onChangeSort(sortOption) {
    changeSort(sortOption)
    renderBooks()
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
                    <article>Rating: <span style="color: gold; font-size: 150%;">${getStarsRating(book.rating)}</span></article>
                </div>`
}

function renderBookForm(book = null) {
    if (!book) {
        resetBookForm()
        return
    }

    document.querySelector('.add-book-form-title').innerHTML = 'Edit Book'
    document.querySelector('.title').value = book.title
    document.querySelector('.price').value = book.price
    document.querySelector('.author').value = book.author
    document.querySelector('.pages').value = book.printLength
    document.querySelector('.publisher').value = book.publisher
    document.querySelector('.publication-date').value = book.publicationDate
    document.querySelector('.rating').value = book.rating
}

function resetBookForm() {
    document.querySelector('.add-book-form-title').innerHTML = 'Add New Book'
    document.querySelector('.title').value = ''
    document.querySelector('.price').value = ''
    document.querySelector('.author').value = ''
    document.querySelector('.pages').value = ''
    document.querySelector('.publisher').value = ''
    document.querySelector('.publication-date').value = ''
    document.querySelector('.rating').value = ''
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

function showElement(element) {
    const elToShow = document.querySelector(element)
    elToShow.classList.remove('hide')
}

function hideElement(element) {
    const elToHide = document.querySelector(element)
    elToHide.classList.add('hide')
}

