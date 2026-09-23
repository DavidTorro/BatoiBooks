import { describe, expect, test } from 'vitest'
import data from '../src/data/datos.js'
import { getBookById } from '../src/functions.js'

describe('getBookById', () => {
  test('Devuelve el libro cuya id coincide', () => {
    const book = getBookById(data.books, 6)

    expect(book.id).toBe(6)
  })

  test('Lanza un error si no existe el libro', () => {
    expect(() => getBookById(data.books, 999)).toThrow('Libro no encontrado')
  })
})