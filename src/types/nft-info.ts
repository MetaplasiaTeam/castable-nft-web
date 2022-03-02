import { BigNumber } from 'ethers'

export interface NFTInfo {
  id: BigNumber
  value: BigNumber
  addr: string
  uri: string
}
