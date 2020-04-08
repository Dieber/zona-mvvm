import { List } from "learn-data-struct";


export default class Dep {
  constructor () {
    this.subs = new List()
  }
  addSub(sub) {
    this.subs.insertAsLast(sub)
  }
  notify () {
    this.subs.visit((sub) => {
      sub.update()
    })
  }
}