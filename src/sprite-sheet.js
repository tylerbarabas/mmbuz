import "latest-createjs"
import DomElement from "./dom-element"
const createjs = window.createjs

export default class SpriteSheet extends DomElement {
  constructor(){
    super()
    this.dom = document.createElement("canvas")
    this.json = null
  }

  init( append = true ){
    if (typeof this.json !== "object") {
      throw 'Cannot init sprite sheet. No JSON present.'
    }

    this.spritesheet = new createjs.SpriteSheet(this.json)
    this.stage = new createjs.Stage(this.dom)

    this.dom.height = this.json.frames.height || this.findFrameDimension(3)
    this.dom.width = this.json.frames.width || this.findFrameDimension(2)

    createjs.Ticker.timingMode = createjs.Ticker.RAF
    createjs.Ticker.addEventListener("tick", this.stage)

    this.pause = this.pause.bind(this)
    this.play = this.play.bind(this)

    window.AP.addEvent("pause", this.pause)
    window.AP.addEvent("play", this.play)

    if (append) this.appendTo()
  }

  pause(e){
    if (!e.isTrusted) return //Still not sure why this pause listener double fires
    if(this.animation)this.animation.stop()
  }

  play(){
    if (this.animation) this.animation.play()
  }

  findFrameDimension(o){
    let highest = 0
    for (let i=0;i<this.json.frames.length;i++) {
      let d = this.json.frames[i][o]
      if (d > highest) highest = d
    }
    return highest
  }

  changeSprite(seq){
    if (typeof seq != "string") return
    if (this.currentAnim == seq) return

    if (this.stage !== null) this.stage.removeChild(this.animation)

    this.currentAnim = seq
    this.animation = new createjs.Sprite(this.spritesheet, this.currentAnim)

    this.stage.addChild(this.animation)
  }

  destroy(){
    createjs.Ticker.removeEventListener("tick", this.stage)
    window.AP.removeEvent("pause", this.pause)
    window.AP.removeEvent("play", this.play)
    setTimeout(()=>{
      super.destroy()
    },250)
  }
}
