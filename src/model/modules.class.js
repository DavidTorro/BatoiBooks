import Module from './module.class.js'
import { getDBModules } from '../services/api.js'

export default class Modules {
  constructor() {
    this.data = []
  }

  async populate() {
    const modules = await getDBModules()
    this.data = modules.map(
      (module) =>
        new Module(
          module.code,
          module.cliteral,
          module.vliteral,
          module.courseId
        )
    )
  }

  getModuleByCode(moduleCode) {
    const module = this.data.find((item) => item.code === moduleCode)

    if (!module) {
      throw new Error('Módulo no encontrado')
    }

    return module
  }

  toString() {
    return this.data.toString()
  }
}
