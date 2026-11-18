export default class Router {
  constructor({ pages, onNavigate = () => {} }) {
    this.pages = pages
    this.onNavigate = onNavigate
    this.handleHashChange = this.handleHashChange.bind(this)
    this.handleLinkClick = this.handleLinkClick.bind(this)
  }

  init() {
    window.addEventListener('hashchange', this.handleHashChange)
    window.addEventListener('popstate', this.handleHashChange)
    document.addEventListener('click', this.handleLinkClick)
    this.showPage(window.location.hash)
  }

  handleHashChange() {
    this.showPage(window.location.hash)
  }

  handleLinkClick(event) {
    const link = event.target.closest('a[href^="#"]')
    if (link?.hash === window.location.hash) this.showPage(link.hash)
  }

  navigate(pageId, { notify = true } = {}) {
    const hash = `#${pageId}`
    if (window.location.hash !== hash) window.history.pushState(null, '', hash)
    this.showPage(hash, { notify })
  }

  showPage(hash, { notify = true } = {}) {
    const pageId = hash.startsWith('#') ? hash.slice(1) : hash
    const page = this.pages.find(({ id }) => id === pageId) ?? this.pages[0]

    for (const currentPage of this.pages) {
      currentPage.element.classList.toggle('hidden', currentPage !== page)
    }

    if (notify) this.onNavigate(page.id)
  }
}
