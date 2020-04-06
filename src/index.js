import parseStringToVirtualDom  from './parser/parseStringToVirtualDom'
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
  context._vd = parseStringToVirtualDom(context._template, context._data)
  mountedFunction && mountedFunction.call(context)
}

function update(context, updateFunction) {
  context._vd = parseStringToVirtualDom(context._template, context._data)
  parseVirtualDomToDom(context._vd, context.parentDom)
  updateFunction && updateFunction.call(context)
}

// 流程：
// 需要两个个栈，分出Tag标签的栈，分出完整Tag的栈

new MYMv({
  template: 
  `<div>
    <span>
      <span>刘海 </span>
    </span>
      {{goo}} 
    <span> 
      {{switch}}
    </span>
      {{goo}}厉害了
    </div>`,
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
}).$mount(document.querySelector('#app'))



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
        return watchObj[item]
      }
    })
  })
}




