/**
 * @param {String} sel dom节点字符串
 * @param {Object} data 
 * @param {Array} children 节点子元素
 * @param {String} text 节点文本
 * @param {dom节点} elm dom节点
 * @param {*} key 标识
 * @returns {Object:  children, data, elm, key, sel, text, key} 返回以上数据
 */

export default function (sel, data, children, text, elm) {
  return {
    sel,
    data,
    children,
    text,
    elm,
    key: data?.key
  }
}