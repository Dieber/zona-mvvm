import {Stack, BinTree} from 'learn-data-struct'
import {isTagStart, isTagEnd} from './utils/is'
import insertToTree from './parser/insertToTree'
import parseVirtualDomToDom from './parser/parseVirtualDomToDom'
// TODO: 异步更新，触发update


let tagList = [
  'div',
  'span'
]

function MYMv(options) {
  this._template = options.template
  this._data = options.data
  this._mounted = options.mounted
  this._created= options.created
  this._update= options.update
  watchAllProperty(this, this._data)
  this._created && this._created()
  mount(this, this._mounted)
}

MYMv.prototype.$mount = function(parentDom) {
  this.parentDom = parentDom
  parseVirtualDomToDom(this._vd, parentDom)
}


function mount(context, mountedFunction) {
  context._vd = parseTemplateToVirtualDomTree(context._template, context._data)
  mountedFunction && mountedFunction.call(context)
}

function update(context, updateFunction) {
  context._vd = parseTemplateToVirtualDomTree(context._template, context._data)
  parseVirtualDomToDom(context._vd, context.parentDom)
  updateFunction && updateFunction.call(context)
}
// 流程：
// 需要两个个栈，分出Tag标签的栈，分出完整Tag的栈



function parseTemplateToVirtualDomTree(templateString, data) {
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
      // 若data中没有variableString

      if (data[variableString]) {
        let textNode = genTextNode(data[variableString])
        insertToTree(nodeTree, nodeStack.getTop(), textNode)
      } else {
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
      let textNodeString = genTextNode(templateString.substring(i, j + 1))
      insertToTree(nodeTree, nodeStack.getTop(), textNodeString)
      i = j
    }
  }
  if (!tagStack.isEmpty()) {
    throw Error('Tag don\'t match!')
  }
  return nodeTree
}



function genTextNode(text) {
  return {
    type: 'text',
    text,
  }
}

function genVirtualNode(tagStart) {
  let tagName = tagStart.substring(1, tagStart.length - 1)
  return {
    type: 'tag',
    tagName,
  }
}



let j = new MYMv({
  template: `<div><span><span>刘海 </span></span> {{goo}}<span>{{switch}}</span>{{goo}}厉害了</div>`,
  data: {
    switch: 'switch',
    goo: 'goo'
  },
  mounted() {
    let i = 0
    setInterval(() => {
      this._data.switch = 'switch' + (++i)
    }, 1000)
  },

})





j.$mount(document.querySelector('#app'))



function watchAllProperty (context, vmData) {
  let keys = Object.keys(vmData)
  let watchObj = {}
  keys.forEach((item) => {
    watchObj[item] = vmData[item]
    Object.defineProperty(vmData, item, {
      set(value) {
        update(context)
        watchObj[item] = value
      },
      get() {
        // console.log(`get Value: ${watchObj[item]}`)
        return watchObj[item]
      }
    })
  })
}




