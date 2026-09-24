import data from './data/datos.js'
import {
  bookExists,
  booksCheeperThan,
  booksFromModule,
  booksFromUser,
  booksWithStatus,
  getBookById,
  getBookIndexById,
  averagePriceOfBooks,
  booksOfTypeNotes
} from './functions.js'

console.log(getBookById(data.books, 6))
console.log(getBookIndexById(data.books, 6))
console.log(bookExists(data.books, 4, '5025'))
console.log(booksFromUser(data.books, 4))
console.log(booksFromModule(data.books, '5021'))
console.log(booksCheeperThan(data.books, 15))
console.log(booksWithStatus(data.books, 'good'))
console.log(averagePriceOfBooks(data.books))
console.log(booksOfTypeNotes(data.books))