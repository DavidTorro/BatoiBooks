const REQUIRED_FIELDS = ['moduleCode', 'publisher', 'price', 'pages', 'status']

export default class View {
  constructor() {
    this.booksList = document.querySelector('#list')
    this.about = document.querySelector('#about')
    this.form = document.querySelector('#form')
    this.formHeading = document.querySelector('#form-heading')
    this.bookForm = document.querySelector('#book-form')
    this.bookIdField = document.querySelector('#book-id-field')
    this.bookIdInput = document.querySelector('#bookId')
    this.moduleSelect = document.querySelector('#moduleCode')
    this.messages = document.querySelector('#messages')
    this.submitButton = this.bookForm.querySelector('[type="submit"]')
    this.moduleCheckVersion = 0
    this.moduleCheckPending = false
    this.validatedFields = new Set()
  }

  renderModules(modules) {
    this.moduleSelect.replaceChildren(new Option('Selecciona un módulo', ''))

    for (const module of modules) {
      this.moduleSelect.add(new Option(`${module.code} · ${module.cliteral}`, module.code))
    }
  }

  renderBooks(books, modules) {
    this.booksList.replaceChildren()

    for (const book of books) {
      this.renderBook(book, modules)
    }
  }

  renderBook(book, modules) {
    this.booksList.append(this.createBookCard(book, modules))
  }

  updateBook(book, modules) {
    const card = [...this.booksList.querySelectorAll('.card')]
      .find((item) => item.dataset.bookId === String(book.id))
    card.replaceWith(this.createBookCard(book, modules))
  }

  createBookCard(book, modules) {
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

    const actions = document.createElement('div')
    actions.className = 'card-actions'
    actions.append(
      this.createActionButton('cart', 'add_shopping_cart', `Añadir libro ${book.id} al carrito`),
      this.createActionButton('edit', 'edit', `Editar libro ${book.id}`),
      this.createActionButton('delete', 'delete', `Eliminar libro ${book.id}`)
    )

    body.append(moduleName, publisher, pages, status, sale, comments, price)
    card.append(imageContainer, body, actions)
    return card
  }

  createActionButton(action, iconName, label) {
    const button = document.createElement('button')
    button.type = 'button'
    button.dataset.action = action
    button.setAttribute('aria-label', label)

    const icon = document.createElement('span')
    icon.className = 'material-icons'
    icon.setAttribute('aria-hidden', 'true')
    icon.textContent = iconName
    button.append(icon)
    return button
  }

  removeBook(bookId) {
    for (const card of this.booksList.querySelectorAll('.card')) {
      if (card.dataset.bookId === String(bookId)) {
        card.remove()
        break
      }
    }

    if (this.bookIdInput.value === String(bookId)) this.resetBookForm()
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
      ...(this.bookIdInput.value ? { id: Number(this.bookIdInput.value) } : {}),
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

  getField(name) {
    return this.bookForm.querySelector(`[name="${name}"]`)
  }

  updatePublisherValidity() {
    const publisher = this.getField('publisher')
    publisher.setCustomValidity(
      publisher.value && !publisher.value.trim() ? 'La editorial es obligatoria' : ''
    )
  }

  getFieldError(name) {
    const field = this.getField(name)
    const { validity } = field

    if (validity.customError) return field.validationMessage
    if (validity.badInput) return `Introduce un ${name === 'price' ? 'precio' : 'número de páginas'} válido`
    if (validity.valueMissing) {
      return {
        moduleCode: 'Selecciona un módulo',
        publisher: 'La editorial es obligatoria',
        price: 'El precio es obligatorio',
        pages: 'El número de páginas es obligatorio',
        status: 'Selecciona un estado',
      }[name]
    }
    if (validity.rangeUnderflow) {
      return name === 'price'
        ? 'El precio no puede ser negativo'
        : 'El número de páginas debe ser al menos 1'
    }
    if (validity.stepMismatch) {
      return name === 'price'
        ? 'El precio puede tener como máximo dos decimales'
        : 'El número de páginas debe ser entero'
    }
    return validity.valid ? '' : `Revisa el campo ${name}`
  }

  showFieldError(name) {
    const field = this.getField(name)
    const message = this.getFieldError(name)
    const error = document.getElementById(`${name}-error`)
    if (error) error.textContent = message
    if (message) field.setAttribute('aria-invalid', 'true')
    else field.removeAttribute('aria-invalid')
  }

  validateBookForm() {
    this.updatePublisherValidity()
    this.validatedFields = new Set(REQUIRED_FIELDS)
    for (const name of REQUIRED_FIELDS) this.showFieldError(name)
    return this.bookForm.checkValidity() && !this.moduleCheckPending
  }

  clearValidationState() {
    this.moduleCheckVersion += 1
    this.moduleCheckPending = false
    this.submitButton.disabled = false
    this.validatedFields.clear()
    this.moduleSelect.setCustomValidity('')
    this.getField('publisher').setCustomValidity('')
    for (const name of REQUIRED_FIELDS) {
      const error = document.getElementById(`${name}-error`)
      if (error) error.textContent = ''
      this.getField(name).removeAttribute('aria-invalid')
    }
  }

  bindModuleChange(callback) {
    this.moduleSelect.addEventListener('change', () => {
      this.moduleCheckVersion += 1
      const version = this.moduleCheckVersion
      this.moduleSelect.setCustomValidity('')
      this.showFieldError('moduleCode')
      this.moduleCheckPending = Boolean(this.moduleSelect.value)
      this.submitButton.disabled = this.moduleCheckPending

      if (this.moduleCheckPending) {
        callback({
          moduleCode: this.moduleSelect.value,
          bookId: this.bookIdInput.value ? Number(this.bookIdInput.value) : undefined,
          version,
        })
      }
    })
  }

  isCurrentModuleCheck(version) {
    return version === this.moduleCheckVersion
  }

  setModuleDuplicate(isDuplicate, version) {
    if (!this.isCurrentModuleCheck(version)) return
    this.moduleSelect.setCustomValidity(isDuplicate ? 'Módulo repetido: ya tienes un libro de este módulo' : '')
    this.showFieldError('moduleCode')
  }

  finishModuleCheck(version) {
    if (!this.isCurrentModuleCheck(version)) return
    this.moduleCheckPending = false
    this.submitButton.disabled = false
  }

  bindSubmitBook(callback) {
    this.bookForm.addEventListener('input', (event) => {
      const name = event.target.name
      if (!REQUIRED_FIELDS.includes(name) || name === 'moduleCode') return
      if (name === 'publisher') this.updatePublisherValidity()
      if (this.validatedFields.has(name)) this.showFieldError(name)
    })
    this.bookForm.addEventListener('change', (event) => {
      if (event.target.name === 'status' && this.validatedFields.has('status')) {
        this.showFieldError('status')
      }
    })
    this.bookForm.addEventListener('submit', (event) => {
      event.preventDefault()

      if (this.validateBookForm()) {
        callback(this.getBookFormData())
      }
    })
  }

  bindBookActions({ onAddToCart, onEdit, onRemove }) {
    this.booksList.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]')
      const card = button?.closest('.card')

      if (!card || !this.booksList.contains(card)) return

      const bookId = Number(card.dataset.bookId)
      if (button.dataset.action === 'cart') onAddToCart(bookId)
      if (button.dataset.action === 'edit') onEdit(bookId)
      if (button.dataset.action === 'delete') onRemove(bookId)
    })
  }

  bindResetBookForm() {
    this.bookForm.addEventListener('reset', () => this.showAddBookForm())
  }

  showEditBookForm(book) {
    this.clearValidationState()
    this.formHeading.textContent = 'Editar libro'
    this.bookIdField.hidden = false
    this.bookIdInput.value = String(book.id)
    this.bookForm.elements.moduleCode.value = book.moduleCode
    this.bookForm.elements.publisher.value = book.publisher
    this.bookForm.elements.price.value = String(book.price)
    this.bookForm.elements.pages.value = String(book.pages)
    this.bookForm.elements.photo.value = book.photo
    this.bookForm.elements.comments.value = book.comments
    this.bookForm.elements.soldDate.value = book.soldDate
    const status = [...this.bookForm.querySelectorAll('[name="status"]')]
      .find((input) => input.value === book.status)
    if (status) status.checked = true
  }

  showAddBookForm() {
    this.clearValidationState()
    this.formHeading.textContent = 'Añadir libro'
    this.bookIdField.hidden = true
    this.bookIdInput.value = ''
  }

  resetBookForm() {
    this.bookForm.reset()
    this.showAddBookForm()
  }

  confirmRemoveBook(book, moduleName) {
    return window.confirm(`¿Eliminar el libro ${book.id} del módulo ${moduleName}?`)
  }

  formatDate(date) {
    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year}`
  }
}
