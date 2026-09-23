function getBookById(books, bookId) {
  const book = books.find((book) => book.id === bookId)

  if (!book) {
    throw new Error('Libro no encontrado')
  }

  return book
}

export { getBookById }