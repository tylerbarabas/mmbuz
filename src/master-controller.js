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
    this.currentSequence.init()
    const nextSequence = this.sequences[this.currentIndex+1]
    this.preloadSequence(nextSequence)
  }

  next(){
    if (typeof this.sequences[this.currentIndex + 1] === "undefined") {
      throw "Cannot find next song sequence."
    }
    if (this.currentSequence.isPlaying) this.currentSequence.pause()
    this.currentSequence.destroy()
    this.currentIndex += 1
    this.currentSequence = this.sequences[this.currentIndex]
    this.stage.clear()
    this.currentSequence.init()
  }

  instantiateSequences(){
    this.sequences = this.sequences.map(s=>new s())
  }

  preloadSequence(seq = this.currentSequence){
    seq.preloader.addEvent('preloader-finished', this.preloaderFinished.bind(this))
    seq.preloader.addEvent('preloader-asset-loaded', this.preloaderAssetLoaded.bind(this))
    seq.preloadAssets()
  }

  preloaderFinished(e){
    const { hideOverlay } = this.currentSequence
    if (typeof hideOverlay === 'function') hideOverlay()
  }

  preloaderAssetLoaded(e){
    const {
      percentComplete,
    } = e.detail
    const {
      updateLoadStatus
    } = this.currentSequence
    if (typeof updateLoadStatus === 'function') updateLoadStatus.call(this.currentSequence,percentComplete)
  }
}
