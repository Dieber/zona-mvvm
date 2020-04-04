import {Stack} from 'learn-data-struct'
import {isTagStart, isTagEnd} from './utils/is'

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


function mount(context, mountedFunction) {
  context._vd = parseToVirtualDom(context._template, context._data)
  mountedFunction && mountedFunction.call(context)
}

function update(context, updateFunction) {
  context._vd = parseToVirtualDom(context._template, context._data)
  updateFunction && updateFunction.call(context)
}



// 流程：
// 需要三个栈，分出Tag标签的栈，分出完整Tag的栈，node栈
//

function parseToVirtualDom(templateString, data) {
  let level = 0 // 之后要生成树的层级
  let stackTag = new Stack()
  let stackNode = new Stack()

  for (let i = 0; i < templateString.length; i++) {
    if (templateString.charAt(i) === '<') {
      let j = i + 1
      while(templateString.charAt(j) !== '>') {
        j++
      }
      let tagString = templateString.substring(i, j + 1)

      // 查看tagString是否和最后一个一致
      if (isTagStart(tagString)) {
        stackTag.push(tagString)
        level++
      }
      if (isTagEnd(tagString)) {
        stackNode.push(genVirtualNode(stackTag.pop(), --level))
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
      console.log(variableString)

      // 若data中没有variableString

      if (data[variableString]) {
        stackNode.push(genTextNode(data[variableString], level))
      } else {
        throw Error('Your Variable dosen\'t show in data' )
      }
      i = j + 1
      continue;
    } else if (templateString.charAt(i) !== ''){
      // 普通的字符变量
      let j = i + 1
      while(templateString.charAt(j) !== '' && templateString.charAt(j) !== '<'  && templateString.charAt(j) !== '{') {
        j++
      }
      let textNodeString = templateString.substring(i, j)
      console.log(j)
      stackNode.push(genTextNode(textNodeString, level))
      i = j - 1
    }
  }
  console.log(stackNode)
}

function genTextNode(text, level) {
  return {
    type: 'text',
    text,
    level
  }
}

function genVirtualNode(tagStart, level) {
  let tagName = tagStart.substring(1, tagStart.length - 1)
  return {
    type: 'tag',
    tagName,
    level
  }
}



let j = new MYMv({
  template: `<div><span><span>刘海了</span></span> {{goo}}<span>{{switch}}</span>{{goo}}厉害了</div>`,
  data: {
    switch: '我叫你骚气',
    goo: '非常没毛病'
  }
})


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




