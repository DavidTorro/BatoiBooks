export function getBookById(books, bookId) {
  // find devuelve el primer elemento que cumpla la condición
  const book = books.find((book) => book.id === bookId)

  if (!book) {
    throw new Error('Libro no encontrado')
  }

  return book
}

export function getBookIndexById(books, bookId) {
  // findIndex devuelve el índice del primer elemento que cumpla la condición
  const bookIndex = books.findIndex((book) => book.id === bookId)

  if (bookIndex === -1) {
    throw new Error('Libro no encontrado')
  }

  return bookIndex
}

export function bookExists(books, userId, moduleCode) {
  // some devuelve true si al menos un elemento cumple la condición
  return books.some(
    (book) => book.userId === userId && book.moduleCode === moduleCode
  )
}

export function booksFromUser(books, userId) {
  // filter devuelve un nuevo array con los elementos que cumplen la condición
  return books.filter((book) => book.userId === userId)
}

export function booksFromModule(books, moduleCode) {
  // filter devuelve un nuevo array con los elementos que cumplen la condición
  return books.filter((book) => book.moduleCode === moduleCode)
}

export function booksCheeperThan(books, price) {
  // filter devuelve los libros cuyo precio cumple la condición
  return books.filter((book) => book.price <= price)
}