// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import Router from '../src/services/router.js'

let router
let onNavigate

beforeEach(() => {
  window.history.replaceState(null, '', '#list')
  document.body.innerHTML = `
    <a href="#form">Añadir libro</a>
    <section id="list"></section>
    <section id="form"></section>
    <section id="about"></section>
  `
  onNavigate = vi.fn()
  router = new Router({
    pages: ['list', 'form', 'about'].map((id) => ({ id, element: document.getElementById(id) })),
    onNavigate,
  })
  router.init()
})

afterEach(() => {
  window.removeEventListener('hashchange', router.handleHashChange)
  window.removeEventListener('popstate', router.handleHashChange)
  document.removeEventListener('click', router.handleLinkClick)
  window.history.replaceState(null, '', '#list')
})

test('abre el formulario para editar sin reiniciarlo y Añadir lo reinicia en la misma ruta', () => {
  expect(onNavigate).toHaveBeenCalledOnce()
  router.navigate('form', { notify: false })

  expect(window.location.hash).toBe('#form')
  expect(document.getElementById('form').classList.contains('hidden')).toBe(false)
  expect(document.getElementById('list').classList.contains('hidden')).toBe(true)
  expect(onNavigate).toHaveBeenCalledOnce()

  document.querySelector('a[href="#form"]').click()
  expect(onNavigate).toHaveBeenLastCalledWith('form')
  expect(onNavigate).toHaveBeenCalledTimes(2)
})
