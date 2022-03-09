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
}
