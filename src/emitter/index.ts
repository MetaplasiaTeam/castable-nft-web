import mitt from 'mitt'

type Events = {
  changeSymbol: string
}

const emitter = mitt<Events>()
export default emitter
