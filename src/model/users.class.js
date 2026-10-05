import User from './user.class.js'

export default class Users {
  constructor() {
    this.data = []
  }

  populate(users) {
    this.data = users.map(
      (user) => new User(user.id, user.nick, user.email, user.password)
    )
  }

  addUser(userData) {
    const id = Math.max(0, ...this.data.map((user) => user.id)) + 1
    const user = new User(
      id,
      userData.nick,
      userData.email,
      userData.password
    )

    this.data.push(user)
    return user
  }

  removeUser(userId) {
    const userIndex = this.getUserIndexById(userId)

    this.data.splice(userIndex, 1)
  }

  changeUser(userData) {
    const userIndex = this.getUserIndexById(userData.id)
    const user = new User(
      userData.id,
      userData.nick,
      userData.email,
      userData.password
    )

    this.data[userIndex] = user
    return user
  }

  getUserById(userId) {
    const user = this.data.find((item) => item.id === userId)

    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    return user
  }

  getUserIndexById(userId) {
    const userIndex = this.data.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
      throw new Error('Usuario no encontrado')
    }

    return userIndex
  }

  getUserByNickName(nick) {
    const user = this.data.find((item) => item.nick === nick)

    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    return user
  }

  toString() {
    return this.data.toString()
  }
}
