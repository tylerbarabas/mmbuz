export default class GlobalStyles{
  constructor(str, prepend = false){
    if (typeof str !== "string") throw "No style given"
    this.checkForStyleTag()
    if (!prepend)
      this.appendStyle( str )
    else
      this.prependStyle( str )
  }

  checkForStyleTag(){
    let tags = document.head.getElementsByTagName("STYLE")
    if (tags.length < 1) {
      this.styleTag = document.createElement("STYLE")
      document.head.appendChild(this.styleTag)
    } else {
      this.styleTag = tags[0]
    }
  }

  appendStyle(str) {
    this.styleTag.innerHTML += str
  }

  prependStyle(str) {
    this.styleTag.innerHTML = str + this.styleTag.innerHTML
  }
}
