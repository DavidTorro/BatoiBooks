import data from './data/datos.js'
import { getBookById, getBookIndexById } from './functions.js'

console.log(getBookById(data.books, 6))
console.log(getBookIndexById(data.books, 6))