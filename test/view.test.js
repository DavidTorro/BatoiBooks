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
    <div id="remove">
      <input id="remove-book-id" type="number">
      <button id="remove-book-button" type="button">Borrar</button>
    </div>
    <div id="form">
      <form id="book-form">
        <select id="userId" name="userId" required></select>
        <select id="moduleCode" name="moduleCode" required></select>
        <input id="publisher" name="publisher" required>
        <input id="price" name="price" type="number" step="0.01" required>
        <input id="pages" name="pages" type="number" required>
        <input id="status-new" name="status" type="radio" value="new" required>
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

    view.renderBooks([{ ...book, soldDate: '2023-12-21' }], modules)
    expect(document.querySelector('.card').textContent).toContain('Vendido el 21/12/2023')
  })

  test('al actualizar el listado no duplica tarjetas', () => {
    view.renderBooks([book, { ...book, id: 7 }], modules)
    view.renderBooks([book], modules)

    expect(document.querySelectorAll('.card')).toHaveLength(1)
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
    view.renderUsers([{ id: 3, nick: 'Juan' }])
    view.renderModules(modules)
    view.bindSubmitBook(callback)

    document.querySelector('#userId').value = '3'
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
      userId: 3,
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
    form.querySelector('#publisher').value = 'Apunts'
    form.querySelector('#status-new').checked = true

    form.querySelector('[type="reset"]').click()

    expect(document.querySelector('#book-form')).toBe(form)
    expect(form.querySelector('#publisher').value).toBe('')
    expect(form.querySelector('#status-new').checked).toBe(false)
  })

  test('el callback de borrado recibe la ID y una ID vacía muestra error', () => {
    const callback = vi.fn()
    view.bindRemoveBook(callback)

    document.querySelector('#remove-book-button').click()
    expect(callback).not.toHaveBeenCalled()
    expect(document.querySelector('.alert-error').textContent).toContain('ID de libro válida')

    document.querySelector('#remove-book-id').value = '6'
    document.querySelector('#remove-book-button').click()
    expect(callback).toHaveBeenCalledExactlyOnceWith(6)
  })
})
