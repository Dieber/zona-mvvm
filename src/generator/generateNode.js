

export function genTextNode(text) {
  return {
    type: 'text',
    text,
  }
}
export function genVirtualNode(tagStart) {
  let tagName = tagStart.substring(1, tagStart.length - 1)
  return {
    type: 'tag',
    tagName,
  }
}

