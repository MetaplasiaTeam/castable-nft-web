import { ethers } from 'ethers'
import { ERC20Data, IERC20 } from '../data/erc20'
import { ERC20 } from 'vue-dapp'

export default class ERC20Util {
  static getSymbol(addr: string): string | undefined {
    let filterData = ERC20Data.ALL_DATA.filter((data: IERC20) => {
      return data.address == addr
    })

    if (filterData.length > 0) {
      return filterData[0].symbol
    }
    return undefined
  }

  static getAddress(symbol: string): string | undefined {
    let filterData = ERC20Data.ALL_DATA.filter((data: IERC20) => {
      return data.symbol == symbol
    })
    if (filterData.length > 0) {
      return filterData[0].address
    }
    return undefined
  }

  static getDecimals(addressOrSymbol: string): number | undefined {
    let filterData = ERC20Data.ALL_DATA.filter((data: IERC20) => {
      return data.address == addressOrSymbol || data.symbol == addressOrSymbol
    })
    if (filterData.length > 0) {
      return filterData[0].decimals
    }
    return undefined
  }

  static getERC20Contract(address: string) {
    return new ethers.Contract(address, ERC20.abi)
  }
}
