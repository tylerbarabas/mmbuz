import DomElement from './dom-element'

const supported_types = {
  image: [
    'png',
    'svg',
    'jpg',
    'gif',
  ],
  video: [
    'mp4',
  ],
  audio: [
    'mp3',
    'wav',
    'm4a',
  ],
}
export default class Preloader extends DomElement {
  constructor(assets=[]){
    super()
    this.assets = assets
    this.assetsStarted = []
    this.assetsFinished = []

    this.queueLimit = 5
    this.queue = []

    this.totalToLoad = 0
  }
  load(assets){
    if (!Array.isArray(assets)){
      throw 'Cannot instantiate Preloader.  Assets argument must be an array.'
    }
  }
  preloadOneAsset(asset){
    if (
      typeof asset === null
      || typeof asset === 'undefined'
    ) throw 'No preload asset given'

    const ext = this.getExtension(asset)
    const type = this.getTypeFromExtension(ext) 
    if (type === null) throw `File extension not recognized for ${asset}.`
    let element = null
    switch(type){
      case 'image':
        element = document.createElement('IMG')
        element.addEventListener('load',this.assetLoaded.bind(this))
        element.src = asset
      break
      case 'video':
        element = document.createElement('VIDEO')
        element.addEventListener('load',this.assetLoaded.bind(this))
        element.src = asset
      break
      case 'audio':
        element = document.createElement('AUDIO')
        element.addEventListener('loadeddata',this.assetLoaded.bind(this))
        element.src = asset
      default:
      break
    }
    return asset
  }

  assetLoaded(e){
    this.assetsFinished.push(e.target.src)
    const pc = this.getPercentComplete()
    if (pc === 100) this.dispatchEvent('preloader-finished')
    e.target.removeEventListener('loadeddata', this.assetLoaded.bind(this))
  }

  getPercentComplete(){
    const numAssets = this.assets.length
    const percentRemaining = (this.getNumberOfAssetsRemaining() / numAssets) * 100
    return 100 - Math.round(percentRemaining)
  }

  getNumberOfAssetsRemaining(){
    return this.assetsStarted.length - this.assetsFinished.length
  }

  getTypeFromExtension(ext){
    let type = null
    if (supported_types.image.indexOf(ext) !== -1) {
      type = 'image'
    } else if (supported_types.video.indexOf(ext) !== -1) {
      type = 'video'
    } else if (supported_types.audio.indexOf(ext) !== -1) {
      type = 'audio'
    }
    return type
  }

  getExtension(file){
    const arr = file.split('.')
    return arr[arr.length-1].toLowerCase()
  }

  preloadAllAssets(){
    this.assetsStarted = this.assets.map(asset=>this.preloadOneAsset(asset))
  }
}
