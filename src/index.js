function MYVue(options) {
  this._template = options.template
  this._data = options.data
  this._mounted = options.mounted
  this._created= options.created
  watchAllProperty(this, this._data)
  update(this)

  // this.data = options.data()


}

function update(context) {
  this._vd = parseToVirtualDom(context.template)
}

function parseToVirtualDom(template) {

}

function toVirtualDom() {

}

let j = new MYVue({
  data: {
    switch: 1,
    goo: 2
  }
})


function watchAllProperty (context, vmData) {
  let keys = Object.keys(vmData)
  let watchObj = {}
  for (item of keys) {
    watchObj[item] = vmData[item]
    Object.defineProperty(vmData, item, {
      set(value) {
        // console.log(`set ${item}'s value = ${value}`)
        update(context)
        watchObj[item] = value
      },
      get() {
        console.log(`get Value: ${watchObj[item]}`)
        return watchObj[item]
      }
    })
  }
}



let i = {
  a: 1,
  b: 2
}

watchAllProperty(i)
i.b = 5




