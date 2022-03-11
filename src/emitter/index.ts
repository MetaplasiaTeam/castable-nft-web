import mitt from 'mitt'

type Events = {
  changeSymbol: string
  refreshNftList: boolean
}

const emitter = mitt<Events>()
export default emitter
