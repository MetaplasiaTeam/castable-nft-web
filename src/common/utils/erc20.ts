import Constants from '@/common/constants'
import { ethers } from 'ethers'
import { ERC20 } from 'vue-dapp'

export default {
  getERC20Contract(symbol: string) {
    switch (symbol) {
      case 'DAI':
        return new ethers.Contract(Constants.DAI_ADDRESS, ERC20.abi)
      default:
    }
  },
}
