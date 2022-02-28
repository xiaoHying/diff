import vnode from './vnode'

/**
 * @param {String} sel dom节点
 * @param {Object} data 
 * @param {String | Number | Array} params 节点内容
 * @returns {Object:  children, data, elm, key, sel, text} 返回数据
 */

export default function (sel, data, params) {
  if (typeof params === 'string' || typeof params === 'number') {
    // 第三个参数是字符串类型，是则没有子元素
    return vnode(sel, data, undefined, params, undefined)
  } else if (Array.isArray(params)) {
    // 判断第三个参数是否为数组，是则添加子元素
    let children = []
    for (let item of params) {
      children.push(item)
    }
    return vnode(sel, data, children, undefined, undefined)
  }
}