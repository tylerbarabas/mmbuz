import DomElement from "./dom-element"
import Stage from "./stage"

export default class MasterController extends DomElement {
  constructor(seq) {
    super()
    if (!Array.isArray(seq)){
      throw "Master controller needs an array of song sequences"
    }

    this.stage = new Stage()
    window.masterController = this
    this.sequences = seq
    this.init()
  }

  init(){
    this.currentIndex = 0
    this.addEvent("next", this.next.bind(this))
    this.instantiateSequences()
    this.currentSequence = this.sequences[this.currentIndex]
  }

  next(){
    if (typeof this.sequences[this.currentIndex + 1] === "undefined") {
      throw "Cannot find next song sequence."
    }
    this.currentSequence.destroy()
    this.currentIndex += 1
    this.stage.clear()
    this.currentSequence = this.sequences[this.currentIndex]
    this.currentSequence.play()
  }

  instantiateSequences(){
    this.sequences = this.sequences.map(s=>new s())
  }
}
