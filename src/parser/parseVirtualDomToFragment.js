export default function parseVirtualDomToFragment (virtualDomTree, parentDom) {
  if (virtualDomTree._root === null) {
    return
  }
  let rootNode = virtualDomTree.getRoot()
  let rootDom = generateDomOrTextNodeByBinNode(rootNode)
  // 遍历二叉树生成Dom树算法
  // TODO:使用迭代的方式解决
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

  if (parentDom.children[0]) {
    parentDom.children[0].replaceWith(rootDom)
  } else {
    parentDom.appendChild(rootDom)
  }
}

function generateDomOrTextNodeByBinNode (binNode) {
  let vNode = binNode.getData()
  if (vNode.type === 'tag') {
    return document.createElement(vNode.tagName)
  } else {
    return document.createTextNode(vNode.text)
  }
}
