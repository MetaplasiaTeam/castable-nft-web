import { ethers } from 'ethers'
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  interface State {
    web3address: string | undefined
    nftContract: ethers.Contract | undefined
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
