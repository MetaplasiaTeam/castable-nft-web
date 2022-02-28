export const store: IStore = {
  state: {
    web3address: undefined,
  },
  setWeb3Address(address: string) {
    this.state.web3address = address
  },
}

interface IStore {
  state: {
    web3address: string | undefined
  }
  setWeb3Address(address: string): void
}
