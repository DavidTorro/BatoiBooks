import Books from './model/books.class.js'
import Modules from './model/modules.class.js'
import Users from './model/users.class.js'

const modules = new Modules()
const users = new Users()
const books = new Books()

await Promise.all([modules.populate(), users.populate(), books.populate()])

console.log(books.booksFromModule('5021'))
console.log(books.booksWithStatus('new'))
