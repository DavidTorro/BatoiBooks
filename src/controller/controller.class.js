import Books from '../model/books.class.js'
import Cart from '../model/cart.class.js'
import Modules from '../model/modules.class.js'
import View from '../view/view.class.js'

export default class Controller {
  constructor({
    view = new View(),
    books = new Books(),
    cart = new Cart(),
    modules = new Modules(),
  } = {}) {
    this.view = view
    this.books = books
    this.cart = cart
    this.modules = modules
  }

  async init() {
    try {
      await Promise.all([
        this.modules.populate(),
        this.books.populate(),
        this.cart.populate(),
      ])

      this.view.renderModules(this.modules.data)
      this.view.renderBooks(this.books.data, this.modules.data)
      this.view.bindSubmitBook((bookData) => this.handleSubmitProductForm(bookData))
      this.view.bindResetBookForm()
      this.view.bindBookActions({
        onAddToCart: (bookId) => this.handleAddToCart(bookId),
        onEdit: (bookId) => this.handleEditBook(bookId),
        onRemove: (bookId) => this.handleRequestRemoveBook(bookId),
      })
      return true
    } catch (error) {
      this.view.showMessage('error', `Error cargando los datos: ${error.message}`)
      return false
    }
  }

  async handleSubmitProductForm(bookData) {
    try {
      const { id, ...fields } = bookData
      let book

      if (id === undefined) {
        book = await this.books.addBook({ ...fields, userId: 2 })
        this.view.renderBook(book, this.modules.data)
      } else {
        const existing = this.books.getBookById(id)
        book = await this.books.changeBook({ id, ...fields, userId: existing.userId })
        this.view.updateBook(book, this.modules.data)
      }

      this.view.resetBookForm()
      this.view.showMessage('info', id === undefined ? 'Libro añadido' : 'Libro actualizado')
      return book
    } catch (error) {
      this.view.showMessage('error', error.message)
      return null
    }
  }

  handleAddToCart(bookId) {
    try {
      const book = this.books.getBookById(bookId)
      this.cart.addItem(book)
      this.view.showMessage('info', `Libro ${bookId} añadido al carrito`)
      return true
    } catch (error) {
      this.view.showMessage('error', error.message)
      return false
    }
  }

  handleEditBook(bookId) {
    try {
      this.view.showEditBookForm(this.books.getBookById(bookId))
      return true
    } catch (error) {
      this.view.showMessage('error', error.message)
      return false
    }
  }

  handleRequestRemoveBook(bookId) {
    try {
      const book = this.books.getBookById(bookId)
      const module = this.modules.data.find((item) => item.code === book.moduleCode)
      if (!this.view.confirmRemoveBook(book, module?.cliteral ?? book.moduleCode)) {
        return false
      }

      return this.handleRemoveBook(bookId)
    } catch (error) {
      this.view.showMessage('error', error.message)
      return false
    }
  }

  async handleRemoveBook(bookId) {
    const id = Number(bookId)

    if (!Number.isInteger(id) || id < 1) {
      this.view.showMessage('error', 'Indica una ID de libro válida')
      return false
    }

    try {
      await this.books.removeBook(id)
      this.view.removeBook(id)
      this.view.showMessage('info', 'Libro eliminado')
      return true
    } catch (error) {
      this.view.showMessage('error', error.message)
      return false
    }
  }
}
