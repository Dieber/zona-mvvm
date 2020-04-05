// not Pure, will be extended to DomTree Method

export default function insertToTree (nodeTree, stackTopNode, virtualNode) {
  let node
  let lc = stackTopNode.getLc()
  if (!lc) { // 若无左孩子，则放到左孩子上
    node = nodeTree.insertAsLc(stackTopNode, virtualNode)
  } else { // 若无右孩子，则放到右孩子最后一个上
    stackTopNode = stackTopNode.getLc()
    while(stackTopNode.getRc()) {
      stackTopNode = stackTopNode.getRc()
    }
    node = nodeTree.insertAsRc(stackTopNode, virtualNode)
  }
  return node
}