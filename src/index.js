import h from './dom/h'
import patch from './dom/patch'

// const vnode1 = h('div', {}, 'hello')
// const vnode2 = h('ul', {}, [
//   h('li', {}, 'a'),
//   h('li', {}, 'b'),
//   h('li', {}, 'c'),
//   h('li', {}, 'd')
// ])

// console.log(vnode1, 'vnode1')
// console.log(vnode2, 'vnode2')



const container = document.getElementById('container')
// const vnode1 = h('h1', {}, 'hello')
const vnode1 = h('ul', {}, [
  // h('li', { key: 'a' }, 'a'),
  // h('li', { key: 'b' }, 'b'),
  // h('li', { key: 'c' }, 'c'),
  // h('li', { key: 'd' }, 'd'),
  // h('li', { key: 'e' }, 'e')
  h('li', { key: 'a' }, 'a'),
  h('li', { key: 'b' }, 'b'),
  h('li', { key: 'c' }, 'c'),
  h('li', { key: 'd' }, 'd'),
  // h('li', { key: 'e' }, 'e')

])

// console.log(vnode1, "index.js")
patch(container, vnode1)

const btn = document.getElementById('btn')

const vnode2 = h('ul', {}, [
  // h('li', { key: 'c' }, 'c'),
  // h('li', { key: 'b' }, 'b'),
  // h('li', { key: 'e' }, 'e'),
  // h('li', { key: 'a' }, 'a'),
  // h('li', { key: 'd' }, 'd'),
  h('li', { key: 'a' }, 'a'),
  h('li', { key: 'b' }, 'b'),
  h('li', { key: 'c' }, 'c'),
  // h('li', { key: 'd' }, 'd'),
  // h('li', { key: 'e' }, 'e')

])

btn.onclick = function () {
  patch(vnode1, vnode2)
}