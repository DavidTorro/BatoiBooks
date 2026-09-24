import data from './data/datos.js'
import {
  booksFromModule,
  booksFromUser,
  booksWithStatus,
  incrementPriceOfbooks,
} from './functions.js'

const userId = 4
const moduleCode = '5021'
const status = 'good'
const percentage = 0.1

const userBooks = booksFromUser(data.books, userId)
const moduleBooks = booksFromModule(data.books, moduleCode)
const moduleBooksWithStatus = booksWithStatus(moduleBooks, status)
const booksWithIncrementedPrice = incrementPriceOfbooks(
  data.books,
  percentage
)

console.log(`Libros del usuario ${userId}:`, userBooks)
console.log(
  `Libros del módulo ${moduleCode} en estado ${status}:`,
  moduleBooksWithStatus
)
console.log(
  `Libros con un incremento del ${percentage * 100}%:`,
  booksWithIncrementedPrice
)
