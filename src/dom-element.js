export default class DomElement {
  constructor(tag = "DIV"){
    this.dom = document.createElement(tag)
  }

  addEvent(evtName, func){
    this.dom.addEventListener(evtName,func, false)
  }

  removeEvent(evtName, func){
    this.dom.removeEventListener(evtName,func)
  }

  dispatchEvent(evtName, params = {}){
    var evt = new CustomEvent(evtName, params)
    this.dom.dispatchEvent(evt)
  }

  setTransition (transition,setChildren,element) {
    setChildren = setChildren || false
    element = element || this.dom

    element.style.transition = transition
    element.style.WebkitTransition = transition
    element.style.MozTransition = transition

    if (!setChildren) return

    let children = element.childNodes
    for (let i=0;i<children.length;i++) {
      children[i].style.transition = transition
      children[i].style.WebkitTransition = transition
      children[i].style.MozTransition = transition

      if (children[i].childNodes.length > 0) this.setTransition(transition,true,children[i])
    }
  }

  handWrite( txt = "This is working!" ) {
    let canvas = document.createElement("CANVAS")
    this.dom.appendChild(canvas)
    let ctx = canvas.getContext("2d")

    let dashLen = 220, dashOffset = dashLen, speed = 3,
      x = 30, i = 0

    ctx.font = "50px Comic Sans MS, cursive, TSCu_Comic, sans-serif" 
    ctx.lineWidth = 5; ctx.lineJoin = "round"; ctx.globalAlpha = 2/3
    ctx.strokeStyle = ctx.fillStyle = "#1f2f90";

    (function loop() {
      ctx.clearRect(x, 0, 60, 150)
      ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]) // create a long dash mask
      dashOffset -= speed                                         // reduce dash length
      ctx.strokeText(txt[i], x, 90)                               // stroke letter

      if (dashOffset > 0) requestAnimationFrame(loop)             // animate
      else {
        ctx.fillText(txt[i], x, 90)                               // fill final letter
        dashOffset = dashLen                                      // prep next char
        x += ctx.measureText(txt[i++]).width + ctx.lineWidth * Math.random()
        ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random())        // random y-delta
        ctx.rotate(Math.random() * 0.005)                         // random rotation
        if (i < txt.length) requestAnimationFrame(loop)
      }
    })()
  }

  flashyflash(){
    this.style("filter", "invert(100%)")
    var i = 0
    let increment = 1
    setInterval(()=>{
      i += increment
      this.style("filter", "invert("+i+"%)")
      if (i > 99 || i < 1) {
        increment *= -1
      }
    },10)
  }

  style (attr,val) {
    if ( typeof attr === "string" ) {
      this.dom.style[attr] = val
    } else {
      for (let i in attr) {
        this.dom.style[i] = attr[i]
      }
    }
  }

  appendTo( elem = window.stage || document.body ) {
    if (elem !== document.body) {
      elem.dom.appendChild( this.dom )
    } else {
      elem.appendChild( this.dom )
    }
  }

  destroy(){
    this.dom.parentNode.removeChild(this.dom)
    delete this
  }
}
