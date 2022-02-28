/**
 * @param {Object} vnode 为新节点创建添加
 */

export default function createElement (vnode) {
  // 创建dom节点
  let domNode = document.createElement(vnode.sel)

  // 判断有没有子节点
  if (!vnode.children) {
    domNode.innerText = vnode.text
  } else if (Array.isArray(vnode.children)) {
    // 有子节点，需要递归创建dom
    for (let child of vnode.children) {
      const childDom = createElement(child)
      domNode.appendChild(childDom)
    }
  }

  // 补充elm属性值
  vnode.elm = domNode
  return domNode
}