import { ethers } from 'ethers'
import { ERC20Data, IERC20 } from '../data/erc20'
import { ERC20 } from 'vue-dapp'
import { useStore } from '@/store'
import { useEthers } from 'vue-dapp'
export default class ERC20Util {
  static getSymbol(addr: string): string | undefined {
    const store = useStore()
    const dataList: IERC20[] = [...ERC20Data.ERC20_DATA, ...store.tokenCache]
    const filterData = dataList.find((data: IERC20) => {
      return data.address == addr
    })

    return filterData?.symbol
  }

  static getAddress(symbol: string): string | undefined {
    const store = useStore()
    const dataList: IERC20[] = []
    dataList.push(...ERC20Data.ERC20_DATA)
    dataList.push(...store.tokenCache)
    const filterData = dataList.find((data: IERC20) => {
      return data.symbol == symbol
    })

    return filterData?.address
  }

  static getDecimals(addressOrSymbol: string): number | undefined {
    const store = useStore()
    const dataList: IERC20[] = []
    dataList.push(...ERC20Data.ERC20_DATA)
    dataList.push(...store.tokenCache)
    const filterData = dataList.find((data: IERC20) => {
      return data.address == addressOrSymbol || data.symbol == addressOrSymbol
    })

    return filterData?.decimals
  }

  static async searchToken(address: string): Promise<IERC20> {
    const { signer } = useEthers()
    const store = useStore()

    if (address === '' || signer.value === null) {
      throw new Error('address is empty')
    }
    try {
      const contract = ERC20Util.getERC20Contract(address)?.connect(
        signer.value
      )
      const name = await contract.name()
      if (name === '' || name === null || name === undefined) {
        throw new Error('name is empty')
      }
      const symbol = await contract.symbol()
      const decimals = await contract.decimals()

      const otherToken = {
        symbol,
        address,
        decimals,
      }
      store.addTokenCache(otherToken)
      return otherToken
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  static getERC20Contract(address: string) {
    return new ethers.Contract(address, ERC20.abi)
  }
}
