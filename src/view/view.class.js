export default class View {
  constructor() {
    this.booksList = document.querySelector('#list')
    this.about = document.querySelector('#about')
    this.form = document.querySelector('#form')
    this.bookForm = document.querySelector('#book-form')
    this.moduleSelect = document.querySelector('#moduleCode')
    this.userSelect = document.querySelector('#userId')
    this.messages = document.querySelector('#messages')
    this.removeBookInput = document.querySelector('#remove-book-id')
  }

  renderModules(modules) {
    this.moduleSelect.replaceChildren(new Option('Selecciona un módulo', ''))

    for (const module of modules) {
      this.moduleSelect.add(new Option(`${module.code} · ${module.cliteral}`, module.code))
    }
  }

  renderUsers(users) {
    this.userSelect.replaceChildren(new Option('Selecciona un usuario', ''))

    for (const user of users) {
      this.userSelect.add(new Option(`${user.nick} (${user.id})`, user.id))
    }
  }

  renderBooks(books, modules) {
    this.booksList.replaceChildren()

    for (const book of books) {
      this.renderBook(book, modules)
    }
  }

  renderBook(book, modules) {
    const module = modules.find((item) => item.code === book.moduleCode)
    const card = document.createElement('article')
    card.className = 'card'
    card.dataset.bookId = book.id

    const imageContainer = document.createElement('div')
    imageContainer.className = 'card-img'
    const image = document.createElement('img')
    image.src = book.photo || '/logoBatoi.png'
    image.alt = `Libro: ${book.id}`
    imageContainer.append(image)

    const body = document.createElement('div')
    body.className = 'card-body'

    const moduleName = document.createElement('h3')
    moduleName.textContent = `${module?.cliteral ?? book.moduleCode} (${book.id})`

    const publisher = document.createElement('h4')
    publisher.textContent = book.publisher

    const pages = document.createElement('p')
    pages.textContent = `${book.pages} páginas`

    const status = document.createElement('p')
    status.textContent = `Estado: ${book.status}`

    const sale = document.createElement('p')
    sale.textContent = book.soldDate
      ? `Vendido el ${this.formatDate(book.soldDate)}`
      : 'En venta'

    const comments = document.createElement('p')
    comments.textContent = book.comments || 'Sin comentarios'

    const price = document.createElement('h4')
    price.className = 'card-price'
    price.textContent = `${Number(book.price).toFixed(2)} €`

    body.append(moduleName, publisher, pages, status, sale, comments, price)
    card.append(imageContainer, body)
    this.booksList.append(card)
  }

  removeBook(bookId) {
    for (const card of this.booksList.querySelectorAll('.card')) {
      if (card.dataset.bookId === String(bookId)) {
        card.remove()
        break
      }
    }
  }

  showMessage(type, message) {
    const alert = document.createElement('div')
    alert.className = `${type} alert alert-${type} alert-dismissible`
    alert.setAttribute('role', 'alert')
    alert.textContent = message

    const closeButton = document.createElement('button')
    closeButton.type = 'button'
    closeButton.className = 'btn-close'
    closeButton.dataset.bsDismiss = 'alert'
    closeButton.setAttribute('aria-label', 'Cerrar mensaje')
    closeButton.textContent = '×'
    closeButton.addEventListener('click', () => alert.remove())
    alert.append(closeButton)
    this.messages.append(alert)

    if (type !== 'error') {
      setTimeout(() => alert.remove(), 3000)
    }
  }

  getBookFormData() {
    const data = new FormData(this.bookForm)

    return {
      userId: Number(data.get('userId')),
      moduleCode: data.get('moduleCode'),
      publisher: data.get('publisher').trim(),
      price: Number(data.get('price')),
      pages: Number(data.get('pages')),
      status: data.get('status'),
      photo: data.get('photo').trim(),
      comments: data.get('comments').trim(),
      soldDate: data.get('soldDate'),
    }
  }

  resetBookForm() {
    this.bookForm.reset()
  }

  getRemoveBookId() {
    return this.removeBookInput.value
  }

  clearRemoveBookId() {
    this.removeBookInput.value = ''
  }

  formatDate(date) {
    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year}`
  }
}
