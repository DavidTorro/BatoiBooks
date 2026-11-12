import Controller from './controller/controller.class.js'
import Router from './services/router.js'

document.addEventListener('DOMContentLoaded', async () => {
  const template = document.querySelector('#page-template')
  document.querySelector('#app').append(template.content.cloneNode(true))

  const myController = new Controller()
  
  const router = new Router({
    pages: [
      { id: 'list', element: document.querySelector('.books-section') },
      { id: 'form', element: myController.view.form },
      { id: 'about', element: myController.view.about },
    ],
    onNavigate: (pageId) => {
      if (pageId === 'form') myController.view.resetBookForm()
    },
  })
  router.init()

  if (await myController.init()) {
    console.log(myController.books.booksFromModule('5021'))
    console.log(myController.books.booksWithStatus('new'))
    console.log(myController.books.averagePriceOfBooks())
  }
})
