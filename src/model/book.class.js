export default class Book {
  constructor({
    id,
    userId,
    moduleCode,
    publisher,
    price,
    pages,
    status,
    photo = '',
    comments = '',
    soldDate = '',
  }) {
    this.id = id
    this.userId = userId
    this.moduleCode = moduleCode
    this.publisher = publisher
    this.price = price
    this.pages = pages
    this.status = status
    this.photo = photo
    this.comments = comments
    this.soldDate = soldDate
  }

  toString() {
    return JSON.stringify(this)
  }
}
