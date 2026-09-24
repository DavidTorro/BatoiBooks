import data from './data/datos.js'
import { 
    getBookById, 
    getBookIndexById, 
    bookExists, 
    booksFromUser 
} from './functions.js'

console.log(getBookById(data.books, 6))
console.log(getBookIndexById(data.books, 6))
console.log(bookExists(data.books, 4, '5025'))
console.log(booksFromUser(data.books, 4))