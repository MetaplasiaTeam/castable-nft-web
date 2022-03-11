import { IERC20 } from '@/common/data/erc20'
import mitt from 'mitt'

type Events = {
  changeSymbol: string
  refreshNftList: boolean
  searchContractResult: IERC20
}

const emitter = mitt<Events>()
export default emitter
