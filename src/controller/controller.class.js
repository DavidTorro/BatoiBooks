import Books from '../model/books.class.js'
import Modules from '../model/modules.class.js'
import Users from '../model/users.class.js'
import View from '../view/view.class.js'

export default class Controller {
  constructor({
    view = new View(),
    books = new Books(),
    modules = new Modules(),
    users = new Users(),
  } = {}) {
    this.view = view
    this.books = books
    this.modules = modules
    this.users = users
  }

  async init() {
    try {
      await Promise.all([
        this.users.populate(),
        this.modules.populate(),
        this.books.populate(),
      ])

      this.view.renderUsers(this.users.data)
      this.view.renderModules(this.modules.data)
      this.view.renderBooks(this.books.data, this.modules.data)
      return true
    } catch (error) {
      this.view.showMessage('error', `Error cargando los datos: ${error.message}`)
      return false
    }
  }

  async handleSubmitBook(bookData) {
    try {
      const book = await this.books.addBook(bookData)
      this.view.renderBook(book, this.modules.data)
      this.view.resetBookForm()
      this.view.showMessage('info', 'Libro añadido')
      return book
    } catch (error) {
      this.view.showMessage('error', error.message)
      return null
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
      this.view.clearRemoveBookId()
      this.view.showMessage('info', 'Libro eliminado')
      return true
    } catch (error) {
      this.view.showMessage('error', error.message)
      return false
    }
  }
}
