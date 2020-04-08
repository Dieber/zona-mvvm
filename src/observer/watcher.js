import parseVirtualDomToFragment from '../parser/parseVirtualDomToFragment'
import { DIRECTIVE_TYPE } from '../utils/consts'


export default function Watcher(vm, node, name, directiveType) {
  this.name = name; //text
  this.id = (new Date()).getTime()
  this.node = node; //当前的节点 {{text}}
  this.vm = vm; //vm 
  this.directiveType = directiveType; //nodeValue
  this.vm._dep.addSub(this)
}
Watcher.prototype = {
  update: function () {
    if (this.directiveType === DIRECTIVE_TYPE.NODE_VALUE) {
      this.node.text = this.vm._data[this.name]
    }
    parseVirtualDomToFragment(this.vm._vdt, this.vm._parentDom)
  },
}