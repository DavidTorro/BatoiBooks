import Book from './book.class.js'

export default class Cart {
  constructor() {
    this.data = []
  }

  populate() {}

  getBookById(bookId) {
    return this.data.find((book) => book.id === bookId) ?? {}
  }

  addItem(book) {
    if (this.getBookById(book.id).id !== undefined) {
      throw new Error('El libro ya está en el carrito')
    }

    const copy = new Book({ ...book })
    this.data.push(copy)
    return copy
  }

  removeItem(bookId) {
    const index = this.data.findIndex((book) => book.id === bookId)

    if (index === -1) {
      throw new Error('El libro no está en el carrito')
    }

    return this.data.splice(index, 1)[0]
  }

  toString() {
    return this.data.toString()
  }
}
