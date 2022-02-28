import vnode from './vnode'
import createElement from './createElement'
import patchVnode from './patchVnode'

/**
 * @param {dom节点} oldVnode 旧的真实dom节点
 * @param {Object} newvnode 新的虚拟节点
 */

export default function (oldVnode, newVnode) {

  // 判断oldVnode是否有sel，否则为真实dom，则需要转为虚拟节点
  if (!oldVnode.sel) {
    oldVnode = vnode(
      oldVnode.tagName.toLowerCase(),
      {}, // data
      [], // children
      undefined,
      oldVnode
    )
  }

  // 判断旧的虚拟节点和新的虚拟节点是否是同一个节点
  if (oldVnode.sel === newVnode.sel) {
    // 同一个节点，多重判断
    // console.log(111)
    patchVnode(oldVnode, newVnode)

  } else {
    // 不是同一个节点则则删除添加
    const newVnodeElm = createElement(newVnode)

    // 获取旧的dom
    const oldVnodeElm = oldVnode.elm

    // 创建新节点
    if (newVnodeElm) {
      oldVnodeElm.parentNode.insertBefore(newVnodeElm, oldVnodeElm)
    }

    // 删除旧节点
    oldVnodeElm.parentNode.removeChild(oldVnodeElm)
  }

}