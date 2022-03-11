import mitt from 'mitt'

type Events = {
  changeSymbol: string
  refreshNftList: boolean
  searchContractResult: {
    address: string
    symbol: string
    decimals: number
  }
}

const emitter = mitt<Events>()
export default emitter
