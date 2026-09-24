import { describe, expect, test } from 'vitest'
import data from '../src/data/datos.js'
import { getBookById, getBookIndexById, bookExists } from '../src/functions.js'

describe('getBookById', () => {
  test('Devuelve el libro cuya id coincide', () => {
    const book = getBookById(data.books, 6)

    expect(book.id).toBe(6)
  })

  test('Lanza un error si no existe el libro', () => {
    expect(() => getBookById(data.books, 999)).toThrow('Libro no encontrado')
  })
})

describe('getBookIndexById', () => {
  test('Devuelve la posición del libro cuya id coincide', () => {
    const bookIndex = getBookIndexById(data.books, 6)

    expect(bookIndex).toBe(1)
  })

  test('Lanza un error si no existe el libro', () => {
    expect(() => getBookIndexById(data.books, 999)).toThrow(
      'Libro no encontrado'
    )
  })
})

describe('bookExists', () => {
  test('Devuelve true si el usuario tiene un libro del módulo', () => {
    const exists = bookExists(data.books, 4, '5025')

    expect(exists).toBe(true)
  })

  test('Devuelve false si el usuario no tiene un libro del módulo', () => {
    const exists = bookExists(data.books, 2, '5021')

    expect(exists).toBe(false)
  })
})