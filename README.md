# diff 算法理论

功能：提升性能

虚拟 dom：把 dom 数据化

### 什么是虚拟 dom

虚拟对象是一个对象，一个用来表示真实 dom 的对象。

虚拟 dom 算法操作真实 dom，性能高于直接操作真实 dom

虚拟 dom 算法 = 虚拟 dom + Diff 算法

### 什么是 diff 算法

diff 算法是一种对比算法。对比两者是旧虚拟 dom 和新虚拟 dom，对比出是哪个虚拟节点更改了，找出这个虚拟节点，并只更新这个虚拟节点对应的真实节点，而不用更新其他数据没有发生改变的节点，实现精准地更新真实 dom，进而提高效率。

使用虚拟 dom 算法的损耗计算：总损耗 = 虚拟 dom 增删改 + （与 diff 算法效率有关）真实 dom 差异增删改 + （较少节点）排版与重绘

直接操作真实 dom 损耗计算：总损耗 = 真实 dom 完全增删改 + （可能较多的节点）排版与重绘

## diff 算法的原理

### diff 同层对比

新旧虚拟 dom 对比的时候，diff 算法比较只会在同层级进行，不会跨层级比较。所以 diff 算法是：深度优先算法。时间复杂度 0(n)

### diff 对比流程

当数据改变时，会触发 setter，并且通过 Dep.notify 去通知所有的订阅者 Watcher，订阅者们就会调用 patch 方法，给真实 dom 打补丁，更新响应的视图。

#### patch 方法

这个方法作用就是，对比当前同层的虚拟节点是否为同一种类型的标签

- 是：继续执行 patchVnode 方法进行深层对比
- 否：没必要对比了，直接整个节点替换成新的虚拟节点

```
function patch(oldVnode, newVnode) {
  // 比较是否为一个类型的节点
  if (sameVnode(oldVnode, newVnode)) {
    // 是：继续进行深层比较
    patchVnode(oldVnode, newVnode)
  } else {
    // 否
    const oldEl = oldVnode.el // 旧虚拟节点的真实DOM节点
    const parentEle = api.parentNode(oldEl) // 获取父节点
    createEle(newVnode) // 创建新虚拟节点对应的真实DOM节点
    if (parentEle !== null) {
      // 将新元素添加进父元素
      api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl))
      // 移除以前的旧元素节点
      api.removeChild(parentEle, oldVnode.el)
      // 设置null，释放内存
      oldVnode = null
    }
  }

  return newVnode
}
```

#### sameVnode 方法

patch 关键的一步就是 sameVnode 方法判断是否为同一类型节点

```
function sameVnode(oldVnode, newVnode) {
  return (
    oldVnode.key === newVnode.key && // key值是否一样
    oldVnode.tagName === newVnode.tagName && // 标签名是否一样
    oldVnode.isComment === newVnode.isComment && // 是否都为注释节点
    isDef(oldVnode.data) === isDef(newVnode.data) && // 是否都定义了data
    sameInputType(oldVnode, newVnode) // 当标签为input时，type必须是否相同
  )
}
```

#### patchVnode 方法

这个函数做了以下事情：

- 找到对应的真实 dom，称为 el
- 判断 newVnode 和 oldVnode 是否指向同一个对象，如果是，那么直接 return
- 如果他们都有文本节点且不相等，那么将 el 的文本节点设置为 newVnode 的文本节点
- 如果 oldVnode 有子节点而 newVnode 没有，则删除 el 的子节点
- 如果 oldVnode 没有子节点而 newVnode 有，则将 newVnode 的子节点真实化后添加到 el
- 如果两者都有子节点，则执行 updateChildren 函数比较子节点，diff 算法核心

```
function patchVnode(oldVnode, newVnode) {
  const el = newVnode.el = oldVnode.el // 获取真实DOM对象
  // 获取新旧虚拟节点的子节点数组
  const oldCh = oldVnode.children, newCh = newVnode.children
  // 如果新旧虚拟节点是同一个对象，则终止
  if (oldVnode === newVnode) return
  // 如果新旧虚拟节点是文本节点，且文本不一样
  if (oldVnode.text !== null && newVnode.text !== null && oldVnode.text !== newVnode.text) {
    // 则直接将真实DOM中文本更新为新虚拟节点的文本
    api.setTextContent(el, newVnode.text)
  } else {
    // 否则

    if (oldCh && newCh && oldCh !== newCh) {
      // 新旧虚拟节点都有子节点，且子节点不一样

      // 对比子节点，并更新
      updateChildren(el, oldCh, newCh)
    } else if (newCh) {
      // 新虚拟节点有子节点，旧虚拟节点没有

      // 创建新虚拟节点的子节点，并更新到真实DOM上去
      createEle(newVnode)
    } else if (oldCh) {
      // 旧虚拟节点有子节点，新虚拟节点没有

      //直接删除真实DOM里对应的子节点
      api.removeChild(el)
    }
  }
}
```

### updateChildren 方法

这是 patchVnode 里最重要的一个方法，新旧虚拟节点的子节点对比，就是发生在 updateChildren 中。

收尾指针发，新的子节点集合和旧的子节点集合，各有收尾两个指针

1. 旧前 和 新前

   oldStart 和 newStart 使用 sameVnode 方法进行比较，sameVnode(oldStart, newStart)

   旧前指针++， 新前指针++

2. 旧后 和 新后

   oldEnd 和 newEnd 使用 sameVnode 方法进行比较，sameVnode(oldEnd,newEnd)

   旧后指针++， 新后指针++

3. 旧前 和 新后

   oldStart 和 newEnd 使用 sameVnode 方法进行比较，sameVnode(oldStart,newEnd)

   旧前指针++， 新后指针--

4. 新前 和 旧后

   newStart 和 oldEnd 使用 sameVnode 方法进行比较，sameVnode(newStart,oldEnd)

   新前指针++， 旧后指针--

5. 以上都不满足 --> 查找

   如果以上逻辑都不满足，再把所有旧子节点的 key 做一个映射到旧节点下标的 key -> index 表，然后用新的 vnode 的 key 去找出在旧节点中可以复用的位置。

   也就是说旧的第一个元素与新的第一个元素作比较，不匹配，则创建新的第一个元素，同时新的第一个元素在旧的中查找，找到后给旧的这个元素赋值为 undefined，旧的指针不变，新的指针++

   旧的第一项与新的其中一项匹配，旧的指针不变，新的指针++，与旧的第一项匹配的新的这一项之前的元素添加到页面上，并在旧的中查找，找到后旧的赋值为 undefined，旧的指针不变。

6. 创建或删除

```
function updateChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0, newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx
  let idxInOld
  let elmToMove
  let before
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx]
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode)
      api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode)
      api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 使用key时的比较
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) // 有key生成index表
      }
      idxInOld = oldKeyToIdx[newStartVnode.key]
      if (!idxInOld) {
        api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
        newStartVnode = newCh[++newStartIdx]
      }
      else {
        elmToMove = oldCh[idxInOld]
        if (elmToMove.sel !== newStartVnode.sel) {
          api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
        } else {
          patchVnode(elmToMove, newStartVnode)
          oldCh[idxInOld] = null
          api.insertBefore(parentElm, elmToMove.el, oldStartVnode.el)
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
  }
  if (oldStartIdx > oldEndIdx) {
    before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
    addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}
```

## 总结

### 新老节点替换规则

1. 如果新老节点不是同一个标签，就删除旧的，创建新的
2. 只能同层比较，不能跨层比较
3. 如果是相同标签，又分为多种情况：新老节点有没有子节点：
   1. 都没有：新节点是文本，直接替换文本即可
   2. 新的有，旧的没有：新的创建子节点，旧的删除文本内容
   3. 旧的有，新的没有：删除旧的子节点，旧的内容替换新的文本
   4. 都有：为 diff 核心，请看 updateChildren 方法
