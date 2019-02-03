import DomElement from "./dom-element"
import AudioPlayer from "./audio-player"

export default class Mixer extends DomElement {
  constructor(){
    super()
    this.loaded = false
    this.playing = false
    this.tracks = []
    this.dom = null
  }

  createTrack(file = null){
    //if file === null throw 'Unable to create track. File cannot be null.'
    let newTrack = new AudioPlayer()
    newTrack.init()
    newTrack.loadFile(file)
    this.tracks.push(newTrack)
  }
}
