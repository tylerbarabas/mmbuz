import DomElement from "./dom-element"

export default class Stage extends DomElement {
  constructor(){
    super()
    if (typeof window.stage !== "undefined") return window.stage
    this.dom.id = "content-stage"
    this.dom.setAttribute("style",`
            position: absolute;
            width: 1200px;
            background-size: 100% 100%;
            background-repeat: no-repeat; 
            height: 650px;
            overflow: hidden;
            visibility: hidden;
        `)

    this.overlay = document.createElement("DIV")
    this.overlay.id = "overlay"
    this.overlay.setAttribute("style", `
            height: 100%;
            width: 100%;
            background-color: #000000;
            opacity: 0;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
        `)

    this.pageScale = 1
    this.init()
  }

  init(){
    if ( typeof window.stage !== "undefined" ) {
      throw "Cannot init Stage, instance already exists."
    }

    document.body.appendChild(this.dom)
    this.dom.appendChild(this.overlay)

    setTimeout(function(){
      this.resize()
      this.dom.style.visibility = "visible"
      window.addEventListener("resize",this.resize.bind(this))
    }.bind(this),25)
    window.stage = this
  }

  resize(){
    let div_w = this.dom.clientWidth, div_h = this.dom.clientHeight

    let scale_w = window.innerWidth / div_w
    let scale_h = window.innerHeight / div_h

    this.pageScale = Math.min(scale_w, scale_h)
    document.body.style.webkitTransform = "scale(" + this.pageScale + ")"
    document.body.style.msTransform = "scale(" + this.pageScale + ")"
    document.body.style.transform = "scale(" + this.pageScale + ")"

    let move_x = ( window.innerWidth - this.dom.clientWidth * this.pageScale) / 2
    let move_y = ( window.innerHeight - this.dom.clientHeight * this.pageScale) / 2

    move_x = (move_x / this.pageScale) - 10
    move_y = (move_y / this.pageScale) - 7

    this.dom.style.top = move_y + "px"
    this.dom.style.left = move_x + "px"
  }

  setBackdrop(img){
    this.style("background-image",`url(${img})`)
  }

  setMasterFont(){
    document.body.style.fontFace = "Catholic School Girl"
  }

  showOverlay() {
    this.overlay.style.opacity = 1
  }

  hideOverlay() {
    this.overlay.style.opacity = 0
  }

  clear() {
    for (let i=0;i<this.dom.children.length;i++) {
      let c = this.dom.children[i]
      if (c.id !== "overlay") this.dom.removeChild(c)
    }
    this.setBackdrop("")
  }

  requestFullScreen(element = document.body) {
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen

    if (requestMethod) { // Native full screen.
        requestMethod.call(element)
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell")
        if (wscript !== null) {
            wscript.SendKeys("{F11}")
        }
    }
  } 
}
