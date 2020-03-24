import DomElement from "./dom-element"
import { uuid } from "uuidv4"

window.AudioContext = window.AudioContext||window.webkitAudioContext

export default class AudioPlayer extends DomElement {
  constructor(){
    super()
    this.loaded = false
    this.playing = false
    this.currentAudio = {
      path: null,
      title: null
    }
    this.dom = null
    this.id = uuid()
  }

  init() {
    this.dom = document.createElement("AUDIO")
    this.dom.id = `ap-${this.id}`
    document.body.appendChild(this.dom)
    window.AP = this
  }

  loadFile(audioPath, audioTitle='Untitled'){
    this.currentAudio.path = audioPath
    this.currentAudio.title = audioTitle
    this.dom.onloadeddata = this.onFileLoad.bind(this)
    this.dom.src = audioPath
  }

  onFileLoad(){
    this.loaded = true
    this.dispatchEvent( "song-loaded" )
  }

  play(){
    if (!this.loaded){
      throw 'Audio cannot play because it is not loaded.'
    } else if (this.playing) {
      console.error('Audio is already playing!')
      return
    }
    console.log('audioplayer.play')
    this.playing = true
    this.dom.play()
  }

  pause(){
    this.playing = false
    this.dom.pause() // pause event will dispatch
  }

  stop(){
    this.pause()
    this.setPosition(0)
  }

  getPosition(){
    return this.dom.currentTime
  }

  setPosition(pos){
    this.dom.currentTime = pos
  }

  destroy(){
    this.stop()
    this.dom.parentNode.removeChild(this.dom)
    delete this
    delete window.AP
  }
}
