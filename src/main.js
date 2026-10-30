import Controller from './controller/controller.class.js'

document.addEventListener('DOMContentLoaded', async () => {
  const template = document.querySelector('#page-template')
  document.querySelector('#app').append(template.content.cloneNode(true))

  const myController = new Controller()
  if (await myController.init()) {
    console.log(myController.books.booksFromModule('5021'))
    console.log(myController.books.booksWithStatus('new'))
    console.log(myController.books.averagePriceOfBooks())
  }
})
