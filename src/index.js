import parseStringToVirtualDom  from './parser/parseStringToVirtualDom'
import parseVirtualDomToFragment from './parser/parseVirtualDomToFragment'
import Dep from './observer/dep'
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
  this._dep = new Dep()
  watchAllProperty(this, this._data)
  this._created && this._created()
  this._vdt = parseStringToVirtualDom(this)
  this._mounted && this._mounted()
}

MYMv.prototype.$mount = function(parentDom) {
  this._parentDom = parentDom
  let fragment = document.createDocumentFragment()
  parseVirtualDomToFragment(this._vdt, fragment)
  parentDom.appendChild(fragment)
  return this
}



function update(context, updateFunction) {
  context._vdt = parseStringToVirtualDom(context._template, context._data)
  parseVirtualDomToFragment(context._vdt, context.parentDom)
  updateFunction && updateFunction.call(context)
}

// 流程：
// 需要两个个栈，分出Tag标签的栈，分出完整Tag的栈

new MYMv({
  template: 
  `<div>
    <span>
      <span>刘海 </span>
      <div>刘海 </div>
      <span>刘海 </span>
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
  Object.keys(vmData).forEach((key) => {
    let oldValue = vmData[key]
    Object.defineProperty(vmData, key, {
      set(value) {
        if (oldValue === value) {
          return
        }
        context._dep.notify();
        // update(context)
        oldValue = value
      },
      get() {
        // console.log(1233)
        return oldValue
      }
    })
  })
}




