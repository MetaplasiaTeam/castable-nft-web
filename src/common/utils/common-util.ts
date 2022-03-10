import Constants from '../constants'

export default {
  name: 'commonUtil',
  openLink(link: string) {
    window.open(link, '_blank')
  },

  getSrc(name: string) {
    return new URL(`../../assets/img/${name}`, import.meta.url).href
  },

  isInteger(obj: any) {
    return Math.floor(obj) === obj
  },

  getSymbol(addr: string) {
    switch (addr) {
      case Constants.DAI_ADDRESS:
        return 'DAI'
      default:
        return 'ETH'
    }
  },
}
