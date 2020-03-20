import DomElement from "./dom-element"

export default class Inspector extends DomElement {
  constructor(sequence) {
    if (typeof sequence === "undefined") {
      throw "Pass sequence in to inspector!"
    }
    super()
    this.sequence = sequence
    this.dom.id = "inspector"
    this.style({
      position: "absolute",
      top: 0,
      left: 0,
      width: "200px",
      height: "70px",
      backgroundColor: "pink",
      paddingLeft: "10px",
      zIndex: 9999
    })
    this.togglePlaying = this.togglePlaying.bind(this)
    this.addEvent("click", this.togglePlaying)
    this.timeElement = new DomElement()
    this.timeElement.appendTo(this)
    this.barBeatElement = new DomElement()
    this.barBeatElement.appendTo(this)
    document.body.addEventListener('keyup',this.keyUp.bind(this))
    this.appendTo(document.body)
  }

  updateTime(time){
    time = time.toString()
    const decimalIndex = time.indexOf('.')
    const twodps = time.slice(0,decimalIndex+3)
    this.timeElement.dom.innerText = parseFloat(twodps)
    this.barBeatElement.dom.innerText = `Bar: ${this.sequence.getBar(time)} Beat: ${this.sequence.getBeat(time)}`
  }

  keyUp(e){
    if (e.keyCode === 32){
      this.togglePlaying()
    }
  }

  togglePlaying(){
    if (window.AP.playing) {
      this.sequence.pause()
    } else {
      this.sequence.play()
    }
  }

  destroy(){
    document.body.removeEventListener('keyup',this.keyUp.bind(this))
    super.destroy()
  }
}
