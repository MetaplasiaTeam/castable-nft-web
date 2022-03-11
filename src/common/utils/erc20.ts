import { ERC20Data, IERC20 } from '../data/erc20'

export default class ERC20Util {
  static getSymbol(addr: string): string | undefined {
    let filterData = ERC20Data.ALL_DATA.filter((data: IERC20) => {
      return data.address == addr
    })
    return filterData[0].symbol
  }

  static getAddress(symbol: string): string | undefined {
    let filterData = ERC20Data.ALL_DATA.filter((data: IERC20) => {
      return data.symbol == symbol
    })
    return filterData[0].address
  }

  static getDecimals(addressOrSymbol: string): number | undefined {
    let filterData = ERC20Data.ALL_DATA.filter((data: IERC20) => {
      return data.address == addressOrSymbol || data.symbol == addressOrSymbol
    })
    return filterData[0].decimals
  }
}
