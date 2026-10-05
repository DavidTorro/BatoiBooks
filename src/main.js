import data from './data/datos.js'
import Books from './model/books.class.js'
import Modules from './model/modules.class.js'
import Users from './model/users.class.js'

const modules = new Modules()
const users = new Users()
const books = new Books()

modules.populate(data.modules)
users.populate(data.users)
books.populate(data.books)

console.log(books.booksFromModule('5021'))
console.log(books.booksWithStatus('new'))
console.log(books.incrementPriceOfbooks(0.1))
