export class ERC20Data {
  static ETH: IERC20 = {
    symbol: 'ETH',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
  }
  static USDT: IERC20 = {
    symbol: 'USDT',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 6,
  }
  static DAI: IERC20 = {
    symbol: 'DAI',
    address: '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867',
    decimals: 18,
  }
  static ALL_DATA = [ERC20Data.ETH, ERC20Data.USDT]
}

export interface IERC20 {
  symbol: string
  address: string
  decimals: number
}
