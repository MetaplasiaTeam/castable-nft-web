import { ethers } from 'ethers'
import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import i18n from '@/i18n'
export interface State {
  nftList:
    | {
        tokenId: number
        imageUrl: string
        title: string
        price: string
      }[]
    | undefined
  web3address: string | undefined
  nftContract: ethers.Contract | undefined
  topbarButtonText:string
}

export const key: InjectionKey<Store<State>> = Symbol('store')

export function useStore() {
  return baseUseStore(key)
}

export const store = createStore({
  state() {
    return {
      web3address: undefined,
      nftContract: undefined,
      nftList: undefined,
      topbarButtonText: i18n.global.t('connect'),
    }
  },
  mutations: {
    setWeb3Address(state: any, address: string) {
      state.web3address = address
    },
    setNFTContract(state: any, contract: ethers.Contract) {
      state.nftContract = contract
    },
    setNftList(
      state: any,
      list: {
        tokenId: number
        imageUrl: string
        title: string
        price: string
      }[]
    ) {
      state.nftList = list
    },
    setTopbarButtonText(state: any, text: string) {
      state.topbarButtonText = text
    }
  },
})
