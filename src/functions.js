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

export function booksWithStatus(books, status) {
  // filter devuelve los libros cuyo estado cumple la condición
  return books.filter((book) => book.status === status)
}

export function averagePriceOfBooks(books) {
  // reduce suma los precios de todos los libros
  const totalPrice = books.reduce((total, book) => total + book.price, 0)
  const averagePrice = totalPrice / books.length

  return `${averagePrice.toFixed(2)} €`
}

export function booksOfTypeNotes(books) {
  // filter devuelve los libros cuyo publisher es Apunts
  return books.filter((book) => book.publisher === 'Apunts')
}

export function booksNotSold(books) {
  // filter devuelve los libros que todavía no tienen fecha de venta
  return books.filter((book) => book.soldDate === '')
}

export function incrementPriceOfbooks(books, percentage) {
  // map crea un nuevo array y el spread copia cada libro antes de cambiar su precio
  return books.map((book) => ({
    ...book,
    price: Number((book.price * (1 + percentage)).toFixed(2)), // redondea a dos decimales
  }))
}

export function getUserById(users, userId) {
  // find devuelve el primer usuario que cumple la condición
  const user = users.find((user) => user.id === userId)

  if (!user) {
    throw new Error('Usuario no encontrado')
  }

  return user
}

export function getUserIndexById(users, userId) {
  // findIndex devuelve el índice del primer usuario que cumple la condición
  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) {
    throw new Error('Usuario no encontrado')
  }

  return userIndex
}