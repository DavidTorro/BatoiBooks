import User from './user.class.js'
import {
  addDBUser,
  changeDBUser,
  changeDBUserPassword,
  getDBUser,
  getDBUsers,
  removeDBUser,
} from '../services/api.js'

export default class Users {
  constructor() {
    this.data = []
  }

  async populate() {
    const users = await getDBUsers()
    this.data = users.map(
      (user) => new User(user.id, user.nick, user.email, user.password)
    )
  }

  async addUser(userData) {
    const userDataFromDB = await addDBUser(userData)
    const user = new User(
      userDataFromDB.id,
      userDataFromDB.nick,
      userDataFromDB.email,
      userDataFromDB.password
    )

    this.data.push(user)
    return user
  }

  async removeUser(userId) {
    const userIndex = this.getUserIndexById(userId)

    await removeDBUser(userId)
    this.data.splice(userIndex, 1)
  }

  async changeUser(userData) {
    const userIndex = this.getUserIndexById(userData.id)
    const userDataFromDB = await changeDBUser(userData)
    const user = new User(
      userDataFromDB.id,
      userDataFromDB.nick,
      userDataFromDB.email,
      userDataFromDB.password
    )

    this.data[userIndex] = user
    return user
  }

  async changeUserPassword(userId, password) {
    const userIndex = this.getUserIndexById(userId)
    const userDataFromDB = await changeDBUserPassword(userId, password)
    const user = new User(
      userDataFromDB.id,
      userDataFromDB.nick,
      userDataFromDB.email,
      userDataFromDB.password
    )

    this.data[userIndex] = user
    return user
  }

  async getUserById(userId) {
    const user = await getDBUser(userId)
    return new User(user.id, user.nick, user.email, user.password)
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
