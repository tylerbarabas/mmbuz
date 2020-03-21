const supported_types = {
  image: [
    'png',
    'svg',
    'jpg',
    'gif',
  ],
  video: [
    'mp4',
  ]
}
export default class Preloader {
  constructor(assets){
    if (!Array.isArray(assets)){
      throw 'Cannot instantiate Preloader.  Assets argument must be an array.'
    }
    this.assets = assets
    this.assetsStarted = []
    this.assetsFinished = []

    this.queueLimit = 5
    this.queue = []

    this.totalToLoad = 0
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
        element.src = asset
        element.addEventListener('load', e=>{
          this.assetsFinished.push(e.target.src)
          console.log(this.getPercentComplete())
        })
      break
      case 'video':
        element = document.createElement('VIDEO')
        element.src = asset
      break
      default:
      break
    }
    return asset
  }

  getPercentComplete(){
    const numAssets = this.assets.length
    return Math.round(100 - (this.getNumberOfAssetsRemaining() / numAssets) * 100)
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
