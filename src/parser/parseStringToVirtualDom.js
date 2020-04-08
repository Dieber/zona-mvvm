import { genTextNode, genVirtualNode } from '../generator/generateNode'
import {Stack, BinTree} from 'learn-data-struct'
import {isTagStart, isTagEnd} from '../utils/is'
import insertToTree from './insertToTree'
import Watcher from '../observer/watcher'
import { DIRECTIVE_TYPE } from '../utils/consts'

export default function parseStringToVirtualDom(context) {
  let templateString = context._template
  let data = context._data
  let tagStack = new Stack() // 
  let nodeStack = new Stack()
  let nodeTree = new BinTree()
  for (let i = 0; i < templateString.length; i++) {
    if (templateString.charAt(i) === '<') {
      let j = i + 1
      while(templateString.charAt(j) !== '>') {
        j++
      }
      let tagString = templateString.substring(i, j + 1)

      // 查看tagString是否和最后一个一致
      if (isTagStart(tagString)) {
        tagStack.push(tagString)
        let virtualNode = genVirtualNode(tagString)
        let node
        if (nodeStack.isEmpty()) {
          node = nodeTree.insertAsRoot(virtualNode)
        } else {
          let stackTopNode = nodeStack.getTop()
          node = insertToTree(nodeTree, stackTopNode, virtualNode)
        }
        nodeStack.push(node)
      }
      if (isTagEnd(tagString)) {
        tagStack.pop()
        nodeStack.pop()
      }
      i = j
      continue;
    } else if (templateString.charAt(i) === '{' && templateString.charAt(i + 1) === '{') {
      // 寻找变量绑定符
      let j = i + 2
      while(!(templateString.charAt(j) === '}' && templateString.charAt(j + 1) === '}')) {
        j++
      }
      let variableString = templateString.substring(i + 2, j).trim()
      if (data[variableString]) {
        let textNode = genTextNode(data[variableString])
        insertToTree(nodeTree, nodeStack.getTop(), textNode)
        new Watcher(context, textNode, variableString, DIRECTIVE_TYPE.NODE_VALUE);
      } else {
        // 若data中没有variableString
        throw Error('Your Variable dosen\'t show in data' )
      }
      i = j + 1
      continue;
    } else if (templateString.charAt(i) !== ' '){
      // 普通的字符
      let j = i
      while(templateString.charAt(j + 1) !== ' ' && templateString.charAt(j + 1) !== '<'  && templateString.charAt(j + 1) !== '{') {
        j++
      }
      let textNode = genTextNode(templateString.substring(i, j + 1))
      insertToTree(nodeTree, nodeStack.getTop(), textNode)

      i = j
    }
  }
  if (!tagStack.isEmpty()) {
    throw Error('Tag don\'t match!')
  }
  return nodeTree
}
