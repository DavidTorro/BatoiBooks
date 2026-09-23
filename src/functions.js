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