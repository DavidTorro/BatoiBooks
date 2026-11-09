import { describe, expect, test } from 'vitest'
import Book from '../src/model/book.class.js'
import Cart from '../src/model/cart.class.js'

const createBook = () => new Book({
  id: 6,
  userId: 2,
  moduleCode: '5021',
  publisher: 'Apunts',
  price: 12,
  pages: 25,
  status: 'good',
})

describe('Cart', () => {
  test('empieza vacío y devuelve un objeto vacío para una ID ausente', () => {
    const cart = new Cart()

    expect(cart.data).toEqual([])
    expect(cart.populate()).toBeUndefined()
    expect(cart.getBookById(6)).toEqual({})
  })

  test('añade una copia independiente del Book y representa su contenido', () => {
    const cart = new Cart()
    const book = createBook()
    const copy = cart.addItem(book)

    expect(copy).toBeInstanceOf(Book)
    expect(copy).toEqual(book)
    expect(copy).not.toBe(book)
    expect(cart.getBookById(6)).toBe(copy)
    expect(cart.toString()).toContain('"id":6')

    book.price = 99
    expect(copy.price).toBe(12)
  })

  test('rechaza duplicados y la eliminación de libros ausentes', () => {
    const cart = new Cart()
    const book = createBook()
    cart.addItem(book)

    expect(() => cart.addItem(book)).toThrow('ya está en el carrito')
    expect(cart.data).toHaveLength(1)
    expect(() => cart.removeItem(7)).toThrow('no está en el carrito')
    expect(cart.removeItem(6).id).toBe(6)
    expect(cart.data).toEqual([])
  })
})
