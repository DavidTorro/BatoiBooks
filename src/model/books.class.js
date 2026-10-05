import Book from './book.class.js'

export default class Books {
  constructor() {
    this.data = []
  }

  populate(books) {
    this.data = books.map((book) => new Book(book))
  }

  addBook(bookData) {
    const id = Math.max(0, ...this.data.map((book) => book.id)) + 1
    const book = new Book({ ...bookData, id })

    this.data.push(book)
    return book
  }

  removeBook(bookId) {
    const bookIndex = this.getBookIndexById(bookId)

    this.data.splice(bookIndex, 1)
  }

  changeBook(bookData) {
    const bookIndex = this.getBookIndexById(bookData.id)
    const book = new Book(bookData)

    this.data[bookIndex] = book
    return book
  }

  getBookById(bookId) {
    const book = this.data.find((item) => item.id === bookId)

    if (!book) {
      throw new Error('Libro no encontrado')
    }

    return book
  }

  getBookIndexById(bookId) {
    const bookIndex = this.data.findIndex((book) => book.id === bookId)

    if (bookIndex === -1) {
      throw new Error('Libro no encontrado')
    }

    return bookIndex
  }

  bookExists(userId, moduleCode) {
    return this.data.some(
      (book) => book.userId === userId && book.moduleCode === moduleCode
    )
  }

  booksFromUser(userId) {
    return this.data.filter((book) => book.userId === userId)
  }

  booksFromModule(moduleCode) {
    return this.data.filter((book) => book.moduleCode === moduleCode)
  }

  booksCheeperThan(price) {
    return this.data.filter((book) => book.price <= price)
  }

  booksWithStatus(status) {
    return this.data.filter((book) => book.status === status)
  }

  averagePriceOfBooks() {
    const totalPrice = this.data.reduce((total, book) => total + book.price, 0)
    const averagePrice = totalPrice / this.data.length

    return `${averagePrice.toFixed(2)} €`
  }

  booksOfTypeNotes() {
    return this.data.filter((book) => book.publisher === 'Apunts')
  }

  booksNotSold() {
    return this.data.filter((book) => book.soldDate === '')
  }

  incrementPriceOfbooks(percentage) {
    return this.data.map(
      (book) =>
        new Book({
          ...book,
          price: Number((book.price * (1 + percentage)).toFixed(2)),
        })
    )
  }

  toString() {
    return this.data.toString()
  }
}
