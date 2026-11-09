// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import View from '../src/view/view.class.js'

const modules = [
  { code: '5021', cliteral: 'Incidentes de ciberseguridad' },
  { code: '5025', cliteral: 'Hacking ético' },
]

const book = {
  id: 6,
  userId: 3,
  moduleCode: '5021',
  publisher: 'McGraw-Hill',
  price: 75,
  pages: 273,
  status: 'new',
  photo: '/foto.png',
  comments: 'Sense obrir',
  soldDate: '',
}

let view

beforeEach(() => {
  document.body.innerHTML = `
    <div id="messages"></div>
    <div id="list"></div>
    <div id="form">
      <h2 id="form-heading">Añadir libro</h2>
      <form id="book-form">
        <div id="book-id-field" hidden><input id="bookId" name="id" type="text" disabled></div>
        <select id="moduleCode" name="moduleCode" required></select>
        <input id="publisher" name="publisher" required>
        <input id="price" name="price" type="number" step="0.01" required>
        <input id="pages" name="pages" type="number" required>
        <input id="status-new" name="status" type="radio" value="new" required>
        <input id="status-good" name="status" type="radio" value="good">
        <input id="status-used" name="status" type="radio" value="used">
        <input id="status-bad" name="status" type="radio" value="bad">
        <input id="status-digital" name="status" type="radio" value="digital">
        <input id="photo" name="photo">
        <textarea id="comments" name="comments"></textarea>
        <input id="soldDate" name="soldDate" type="date">
        <button type="submit">Guardar</button>
        <button type="reset">Reset</button>
      </form>
    </div>
    <div id="about"></div>
  `
  view = new View()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Vista', () => {
  test('el desplegable muestra los módulos recibidos', () => {
    view.renderModules(modules)

    expect([...view.moduleSelect.options].map((option) => option.value)).toEqual([
      '', '5021', '5025',
    ])
    expect(view.moduleSelect.options[1].textContent).toContain('Incidentes de ciberseguridad')
  })

  test('las tarjetas muestran los datos del libro y el módulo', () => {
    view.renderBooks([book], modules)

    const card = document.querySelector('.card')
    expect(card.dataset.bookId).toBe('6')
    expect(card.querySelector('img').getAttribute('src')).toBe('/foto.png')
    expect(card.querySelector('img').alt).toBe('Libro: 6')
    expect(card.querySelector('h3').textContent).toBe('Incidentes de ciberseguridad (6)')
    expect(card.textContent).toContain('McGraw-Hill')
    expect(card.textContent).toContain('273 páginas')
    expect(card.textContent).toContain('Estado: new')
    expect(card.textContent).toContain('En venta')
    expect(card.textContent).toContain('Sense obrir')
    expect(card.textContent).toContain('75.00 €')
    expect([...card.querySelectorAll('.card-actions button')].map((button) => button.dataset.action))
      .toEqual(['cart', 'edit', 'delete'])
    expect(card.querySelector('[data-action="cart"]').getAttribute('aria-label'))
      .toContain('Añadir libro 6 al carrito')

    view.renderBooks([{ ...book, soldDate: '2023-12-21' }], modules)
    expect(document.querySelector('.card').textContent).toContain('Vendido el 21/12/2023')
  })

  test('al actualizar el listado no duplica tarjetas', () => {
    view.renderBooks([book, { ...book, id: 7 }], modules)
    view.renderBooks([book], modules)

    expect(document.querySelectorAll('.card')).toHaveLength(1)
  })

  test('al editar reemplaza la tarjeta en su posición', () => {
    view.renderBooks([book, { ...book, id: 7 }], modules)
    view.updateBook({ ...book, publisher: 'Anaya', price: 20 }, modules)

    expect([...document.querySelectorAll('.card')].map((card) => card.dataset.bookId))
      .toEqual(['6', '7'])
    expect(document.querySelector('[data-book-id="6"]').textContent).toContain('Anaya')
    expect(document.querySelector('[data-book-id="6"]').textContent).toContain('20.00 €')
  })

  test('los mensajes se cierran; los informativos caducan y los errores permanecen', () => {
    vi.useFakeTimers()

    view.showMessage('info', 'Libro añadido')
    expect(document.querySelector('.alert-info').textContent).toContain('Libro añadido')
    vi.advanceTimersByTime(2999)
    expect(document.querySelector('.alert-info')).not.toBeNull()
    vi.advanceTimersByTime(1)
    expect(document.querySelector('.alert-info')).toBeNull()

    view.showMessage('error', 'Error de red')
    vi.advanceTimersByTime(3000)
    expect(document.querySelector('.alert-error')).not.toBeNull()
    document.querySelector('.alert-error .btn-close').click()
    expect(document.querySelector('.alert-error')).toBeNull()
  })

  test('el callback de submit recibe los datos con sus tipos', () => {
    const callback = vi.fn()
    view.renderModules(modules)
    view.bindSubmitBook(callback)

    document.querySelector('#moduleCode').value = '5021'
    document.querySelector('#publisher').value = 'Apunts'
    document.querySelector('#price').value = '12.50'
    document.querySelector('#pages').value = '40'
    document.querySelector('#status-new').checked = true
    document.querySelector('#photo').value = '/foto.png'
    document.querySelector('#comments').value = 'Buen estado'
    document.querySelector('#book-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    expect(callback).toHaveBeenCalledExactlyOnceWith({
      moduleCode: '5021',
      publisher: 'Apunts',
      price: 12.5,
      pages: 40,
      status: 'new',
      photo: '/foto.png',
      comments: 'Buen estado',
      soldDate: '',
    })
  })

  test('reset limpia los campos sin eliminar el formulario', () => {
    const form = document.querySelector('#book-form')
    view.renderModules(modules)
    view.bindResetBookForm()
    view.showEditBookForm(book)

    expect(document.querySelector('#form-heading').textContent).toBe('Editar libro')
    expect(document.querySelector('#book-id-field').hidden).toBe(false)
    expect(form.querySelector('#bookId').disabled).toBe(true)
    expect(form.querySelector('#publisher').value).toBe('McGraw-Hill')
    expect(form.querySelector('#status-new').checked).toBe(true)
    expect(view.getBookFormData().id).toBe(6)

    form.querySelector('[type="reset"]').click()

    expect(document.querySelector('#book-form')).toBe(form)
    expect(form.querySelector('#publisher').value).toBe('')
    expect(form.querySelector('#status-new').checked).toBe(false)
    expect(document.querySelector('#form-heading').textContent).toBe('Añadir libro')
    expect(document.querySelector('#book-id-field').hidden).toBe(true)
    expect(form.querySelector('#bookId').value).toBe('')
    expect(view.getBookFormData()).not.toHaveProperty('id')
  })

  test('los botones de tarjetas existentes y nuevas envían la acción y la ID', () => {
    const onAddToCart = vi.fn()
    const onEdit = vi.fn()
    const onRemove = vi.fn()
    view.bindBookActions({ onAddToCart, onEdit, onRemove })
    view.renderBook(book, modules)
    view.renderBook({ ...book, id: 7 }, modules)

    document.querySelector('[data-book-id="6"] [data-action="cart"] .material-icons').click()
    document.querySelector('[data-book-id="7"] [data-action="edit"]').click()
    document.querySelector('[data-book-id="7"] [data-action="delete"]').click()

    expect(onAddToCart).toHaveBeenCalledExactlyOnceWith(6)
    expect(onEdit).toHaveBeenCalledExactlyOnceWith(7)
    expect(onRemove).toHaveBeenCalledExactlyOnceWith(7)
  })

  test('la confirmación identifica el libro y el módulo', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)

    expect(view.confirmRemoveBook(book, 'Incidentes de ciberseguridad')).toBe(false)
    expect(confirm).toHaveBeenCalledWith(expect.stringContaining('6'))
    expect(confirm.mock.calls[0][0]).toContain('Incidentes de ciberseguridad')
    confirm.mockRestore()
  })
})
