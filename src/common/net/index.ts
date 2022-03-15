import { PinIPFS } from '@/types/pin-ipfs'
import { ethers } from 'ethers'
import Request from './request'
import { useStore } from '@/store'
import axios from 'axios'
import { NFTInfo } from '@/types/nft-info'

const request = new Request({
  timeout: 30000,
  baseURL: 'https://api.pinata.cloud/',
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyZmY1MTAyMy1iODY4LTQwNzctOGIyOS03YTNiNDExNzBmMDMiLCJlbWFpbCI6Im1vbmtleWNvaW42NkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlfSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiY2NmOThiYWM0ZGIwNWNkMDZlM2QiLCJzY29wZWRLZXlTZWNyZXQiOiI4ZGFjZDVhZDFmNzkyODQ5YmQ3ZmI1OTUyZDBkZWZiMGRhNzk3ODY4ZDg1NjVkZWU5ZjY2ZTE5YjJkNDcyOWJhIiwiaWF0IjoxNjQ2NjI0NzMzfQ.Gkc4g31mx_BAkkJJdDotZKikxNH8DiHMBYwwT1RwLgg',
  },
  interceptorHooks: {
    requestInterceptor: (config) => {
      return config
    },
    requestInterceptorCatch: (err) => {
      return err
    },
    responseInterceptor: (res) => {
      return res.data
    },
    responseInterceptorCatch: (err) => {
      return err
    },
  },
})

const ipfsNetwork = [
  'https://ipfs.io/ipfs',
  'https://gateway.pinata.cloud/ipfs',
  'https://cloudflare-ipfs.com/ipfs',
]

export class Api {
  static testApi() {
    return request.get({
      url: 'data/testAuthentication',
      headers: {
        pinata_api_key: 'ccf98bac4db05cd06e3d',
        pinata_secret_api_key:
          '8dacd5ad1f792849bd7fb5952d0defb0da797868d8565dee9f66e19b2d4729ba',
      },
    })
  }

  static uploadFile(file: File) {
    let data = new FormData()
    data.append('file', file)
    return request.post({
      url: 'pinning/pinFileToIPFS',
      data: data,
      headers: {
        pinata_api_key: 'ccf98bac4db05cd06e3d',
        pinata_secret_api_key:
          '8dacd5ad1f792849bd7fb5952d0defb0da797868d8565dee9f66e19b2d4729ba',
      },
    })
  }

  static uploadJson(pinIPFS: PinIPFS) {
    return request.post({
      url: 'pinning/pinJSONToIPFS',
      data: pinIPFS,
      headers: {
        pinata_api_key: 'ccf98bac4db05cd06e3d',
        pinata_secret_api_key:
          '8dacd5ad1f792849bd7fb5952d0defb0da797868d8565dee9f66e19b2d4729ba',
      },
    })
  }

  static getAllNftInfo(
    contract: ethers.Contract | undefined
  ): Promise<{ id: number; value: string; addr: string; info: PinIPFS }[]> {
    return new Promise((resolve, reject) => {
      if (contract === undefined) {
        reject('contract is undefined')
        return
      }
      const store = useStore()
      contract
        .getByOwner(store.web3address)
        .then(async (res: NFTInfo[]) => {
          let allNFTInfo: Array<{
            id: number
            addr: string
            value: string
            info: PinIPFS
          }> = []
          for (let ele of res) {
            if (ele.uri === '') {
              continue
            }

            let info = await axios.get(
              `${ipfsNetwork[window.ipfs]}${ele.uri.substring(
                ele.uri.lastIndexOf('/'),
                ele.uri.length
              )}`
            )

            if (info.status !== 200) {
              continue
            }

            allNFTInfo.push({
              id: ele.id.toNumber(),
              value: ele.value.toString(),
              addr: ele.addr.toString(),
              info: info.data,
            })
          }
          resolve(allNFTInfo)
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }
}

export { request }
