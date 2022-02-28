import createElement from "./createElement"
import updataChildren from './updataChildren'
/**
 * @param {*} oldVnode 
 * @param {*} newVnode 
 */

export default function patchVnode (oldVnode, newVnode) {
  // 判断新节点有没有children
  if (!newVnode.children) { // 新节点没有子节点

    if (newVnode.text !== oldVnode.text) { // 新旧节点文本内容不一样，替换即可
      oldVnode.elm.innerText = newVnode.text
    }

  } else { // 新节点子节点

    // 判断旧节点有没有子节点
    if (oldVnode.children && oldVnode.children.length) { // 旧节点有子节点

      // diff算法核心内容
      console.log('新旧节点都有children')
      // 需要传递的参数
      // console.log(oldVnode.elm, oldVnode.children, newVnode.children)
      updataChildren(oldVnode.elm, oldVnode.children, newVnode.children)

    } else { // 旧节点没有子节点

      oldVnode.elm.innerHTML = ''
      // 遍历新的子节点，创建dom
      for (let child of newVnode.children) {
        const childDom = createElement(child)
        oldVnode.elm.appendChild(childDom)
      }

    }
  }
}