export default class Router {
  constructor({ pages, onNavigate = () => {} }) {
    this.pages = pages
    this.onNavigate = onNavigate
    this.handleHashChange = this.handleHashChange.bind(this)
  }

  init() {
    window.addEventListener('hashchange', this.handleHashChange)
    this.showPage(window.location.hash)
  }

  handleHashChange() {
    this.showPage(window.location.hash)
  }

  showPage(hash) {
    const pageId = hash.startsWith('#') ? hash.slice(1) : hash
    const page = this.pages.find(({ id }) => id === pageId) ?? this.pages[0]

    for (const currentPage of this.pages) {
      currentPage.element.classList.toggle('hidden', currentPage !== page)
    }

    this.onNavigate(page.id)
  }
}
