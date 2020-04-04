export function isTagStart(string) {
  return /\<[^\/].*\>/.test(string)
}

export function isTagEnd(string) {
  return /\<\/.*\>/.test(string)
}