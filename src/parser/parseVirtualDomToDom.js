import {Stack} from 'learn-data-struct'

export default function parseVirtualDomToDom (virtualDomTree, parentDom) {
  if (virtualDomTree._root === null) {
    return
  }
  
  let rootNode = virtualDomTree.getRoot()
  let rootDom = generateDomOrTextNodeByBinNode(rootNode)

  function visit(node, dom) {
    while (node) {
      let nodeDom = generateDomOrTextNodeByBinNode(node)
      dom.appendChild(nodeDom)
      if (node.getLc()) {
        visit(node.getLc(), nodeDom)
      }
      node = node.getRc()
    }
  }
  visit(rootNode, rootDom)
  parentDom.innerHTML = ''
  parentDom.appendChild(rootDom)
}


function generateDomOrTextNodeByBinNode (binNode) {
  let vNode = binNode.getData()
  if (vNode.type === 'tag') {
    return document.createElement(vNode.tagName)
  } else {
    return document.createTextNode(vNode.text)
  }
}
