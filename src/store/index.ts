import { ethers } from 'ethers'
import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'

export interface State {
  web3address: string | undefined
  nftContract: ethers.Contract | undefined
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
    }
  },
  mutations: {
    setWeb3Address(state: any, address: string) {
      state.web3address = address
    },
    setNFTContract(state: any, contract: ethers.Contract) {
      state.nftContract = contract
    },
  },
})
