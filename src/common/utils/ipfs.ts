export default class IPFSUtil {
  static ipfsGateway = [
    'https://ipfs.io/ipfs',
    'https://gateway.pinata.cloud/ipfs',
    'https://cloudflare-ipfs.com/ipfs',
  ]

  static getHash(url: string): string {
    const _url = new URL(url)
    if (_url.protocol === 'https:') {
      const hash = _url.pathname.slice(_url.pathname.indexOf('/ipfs/') + 6)
      return hash
    } else {
      return url.slice(7)
    }
  }
}
