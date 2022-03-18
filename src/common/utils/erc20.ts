import { ethers } from 'ethers'
import { ERC20Data, IERC20 } from '../data/erc20'
import { ERC20 } from 'vue-dapp'
import { useStore } from '@/store'
import { useEthers } from 'vue-dapp'
export default class ERC20Util {
  static getSymbol(addr: string): string | undefined {
    const store = useStore()
    let dataList: IERC20[] = [...ERC20Data.ERC20_DATA, ...store.tokenCache]
    let filterData = dataList.find((data: IERC20) => {
      return data.address == addr
    })

    return filterData?.symbol
  }

  static getAddress(symbol: string): string | undefined {
    const store = useStore()
    let dataList: IERC20[] = []
    dataList.push(...ERC20Data.ERC20_DATA)
    dataList.push(...store.tokenCache)
    let filterData = dataList.find((data: IERC20) => {
      return data.symbol == symbol
    })

    return filterData?.address
  }

  static getDecimals(addressOrSymbol: string): number | undefined {
    const store = useStore()
    let dataList: IERC20[] = []
    dataList.push(...ERC20Data.ERC20_DATA)
    dataList.push(...store.tokenCache)
    let filterData = dataList.find((data: IERC20) => {
      return data.address == addressOrSymbol || data.symbol == addressOrSymbol
    })

    return filterData?.decimals
  }

  static searchToken(address: string): Promise<IERC20> {
    return new Promise((resolve, reject) => {
      const { signer } = useEthers()
      const store = useStore()

      if (address === '' || signer.value === null) {
        return
      }
      let contract = ERC20Util.getERC20Contract(address)?.connect(signer.value)
      contract
        .name()
        .then(async () => {
          let symbol: string = await contract.symbol()
          let decimals: number = await contract.decimals()
          let otherToken: IERC20 = {
            symbol: symbol,
            address: address,
            decimals: decimals,
          }
          store.addTokenCache(otherToken)
          resolve(otherToken)
        })
        .catch((err: Error) => {
          console.log(err.message)
          reject(err)
        })
    })
  }

  static getERC20Contract(address: string) {
    return new ethers.Contract(address, ERC20.abi)
  }
}
