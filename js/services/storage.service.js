'use strict'

function saveToStorage(key, value) {
    const booksJson = JSON.stringify(value)
    localStorage.setItem(key, booksJson)
    
}

function loadFromStorage(key) {
    const booksJson = localStorage.getItem(key)
    return JSON.parse(booksJson)
}