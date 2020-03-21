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
    const nextSequence = this.sequences[this.currentIndex+1]
    this.currentSequence.play()
    this.preloadSequence(nextSequence)
  }

  next(){
    if (typeof this.sequences[this.currentIndex + 1] === "undefined") {
      throw "Cannot find next song sequence."
    }
    this.currentSequence.pause()
    this.currentSequence.destroy()
    this.stage.clear()
    this.currentIndex += 1
    this.currentSequence = this.sequences[this.currentIndex]
    this.currentSequence.init()
  }

  instantiateSequences(){
    this.sequences = this.sequences.map(s=>new s())
  }

  preloadSequence(seq = this.currentSequence){
    seq.preloadAssets()
  }
}
