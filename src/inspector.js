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
    this.onClick = this.onClick.bind(this)
    this.addEvent("click", this.onClick)

    this.timeElement = new DomElement()
    this.timeElement.appendTo(this)

    this.barBeatElement = new DomElement()
    this.barBeatElement.appendTo(this)

    this.appendTo(document.body)
  }



  updateTime(time){
    this.timeElement.dom.innerText = time
    this.barBeatElement.dom.innerText = `Bar: ${this.sequence.getBar(time)} Beat: ${this.sequence.getBeat(time)}`
  }

  onClick(){
    if (window.AP.playing) {
      this.sequence.pause()
    } else {
      this.sequence.play()
    }
  }
}
