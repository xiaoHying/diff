import patchVnode from "./patchVnode"
import createElement from "./createElement"

/**
 * @param {*} parentElm 真实dom，父节点
 * @param {*} oldChildren 旧节点的子节点
 * @param {*} newChildren 新节点的子节点
 */
export default (parentElm, oldChildren, newChildren) => {
  console.log('==========updataChildren==========')
  console.log(parentElm, oldChildren, newChildren)
  console.log('==========updataChildren==========')

  let oldStartIdx = 0 // 旧前指针
  let oldEndIdx = oldChildren.length - 1 // 旧后的指针

  let newStartIdx = 0 // 新前指针
  let newEndIdx = newChildren.length - 1 // 新后的指针

  let oldStartVnode = oldChildren[0] // 旧前虚拟节点
  let oldEndVnode = oldChildren[oldEndIdx] // 旧后虚拟节点

  let newStartVnode = newChildren[0] // 新前虚拟节点
  let newEndVnode = newChildren[newEndIdx] // 新后虚拟节点

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode === undefined) { // oldStartVnode为undefined
      console.log(oldStartVnode, 'oldStartVnode')
      oldStartVnode = oldChildren[++oldStartIdx]
    } else if (oldEndVnode === undefined) { // oldEndVnode为unde
      console.log(oldEndVnode, 'oldEndVnode')
      oldEndVnode = oldChildren[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 第一种情况 旧前和新前
      console.log('1111111111111111')
      patchVnode(oldStartVnode, newStartVnode)

      if (newStartVnode) newStartVnode.elm = oldStartVnode?.elm

      oldStartVnode = oldChildren[++oldStartIdx]
      newStartVnode = newChildren[++newStartIdx]

    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 第二种情况 旧后和新后
      console.log('22222222222222222')
      patchVnode(oldEndVnode, newEndVnode)

      if (newEndVnode) newEndVnode.elm = oldEndVnode?.elm

      oldEndVnode = oldChildren[--oldEndIdx]
      newEndVnode = newChildren[--newEndIdx]

    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // 第三种情况 旧前和新后
      console.log('333333333333333')
      patchVnode(oldStartVnode, newEndVnode)

      if (newEndVnode) newEndVnode.elm = oldStartVnode?.elm

      // 把旧前指定的节点移动到旧后指向的节点的后面
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)

      oldStartVnode = oldChildren[++oldStartIdx]
      newEndVnode = newChildren[--newEndIdx]

    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // 第四种情况 旧后和新前
      console.log('4444444444444')
      patchVnode(oldEndVnode, newStartVnode)

      if (newStartVnode) newStartVnode.elm = oldEndVnode?.elm

      // 把旧后指定的节点移动到旧前指向的节点的前面
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)

      oldEndVnode = oldChildren[--oldEndIdx]
      newStartVnode = newChildren[++newStartIdx]

    } else {
      // 第五种情况 以上都不满足
      console.log('5555555555555555')
      // 创建一个对象，存放虚拟节点，判断新旧有没有相同节点

      const keyMap = {}
      for (let i = oldStartIdx; i <= oldEndIdx; i++) {
        const key = oldChildren[i]?.key
        if (key) keyMap[key] = i
      }
      // 在旧节点中查找匹配节点
      let idxInOld = keyMap[newStartVnode.key]
      if (idxInOld) {
        // 如果有，说明该数据在新旧虚拟节点中都存在
        const elmMove = oldChildren[idxInOld]
        patchVnode(elmMove, newStartVnode)
        // 处理过的节点在旧虚拟节点的数据中设置为undefined
        oldChildren[idxInOld] = undefined
        parentElm.insertBefore(elmMove.elm, oldStartVnode.elm)

      } else {
        // 没有找到是一个新的几点，需要创建
        parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
      }
      // 新数据指针+1
      newStartVnode = newChildren[++newStartIdx]
    }
  }

  // 结束循环，新增和删除
  // 1. oldStartIdx > oldEndIdx
  // 2. newStartIdx > newEndIdx

  if (oldStartIdx > oldEndIdx) {

    const before = newChildren[newEndIdx + 1] ? newChildren[newEndIdx + 1].elm : undefined
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      parentElm.insertBefore(createElement(newChildren[i]), before)
    }

  } else {
    // 删除操作
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      parentElm.removeChild(oldChildren[i].elm)
    }
  }

}

// 判断两个节点是否为虚拟节点
function sameVnode (vnode1, vnode2) {
  return vnode1.key === vnode2.key
}