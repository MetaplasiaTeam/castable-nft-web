import { PinIPFS } from '@/types/pin-ipfs'
import { ethers } from 'ethers'
import Request from './request'
import { useStore } from '@/store'
import axios from 'axios'
import { NFTInfo } from '@/types/nft-info'
import IPFSUtil from '../utils/ipfs'

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
    const data = new FormData()
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

  // 暂不使用
  static async getIpfsImgRace(url: string) {
    const hash = IPFSUtil.getHash(url)

    const imgBlob = await Promise.race([
      axios.get(`${IPFSUtil.ipfsGateway[0]}/${hash}`, {
        responseType: 'blob',
      }),
      axios.get(`${IPFSUtil.ipfsGateway[1]}/${hash}`, {
        responseType: 'blob',
      }),
      axios.get(`${IPFSUtil.ipfsGateway[2]}/${hash}`, {
        responseType: 'blob',
      }),
    ])

    const imgUrl = URL.createObjectURL(imgBlob.data)
    console.log(imgUrl)
  }

  static async getAllNftInfo(contract: ethers.Contract | undefined) {
    if (contract === undefined) {
      throw new Error('contract is undefined')
    }
    try {
      const store = useStore()
      const nftInfo: NFTInfo[] = await contract.getByOwner(store.web3address)
      const allNftInfo: Array<{
        id: number
        addr: string
        value: string
        info: PinIPFS
      }> = []
      for (const ele of nftInfo) {
        if (ele.uri === '') {
          continue
        }
        try {
          const hash = IPFSUtil.getHash(ele.uri)
          const info = await Promise.race([
            axios.get(`${IPFSUtil.ipfsGateway[0]}/${hash}`),
            axios.get(`${IPFSUtil.ipfsGateway[1]}/${hash}`),
            axios.get(`${IPFSUtil.ipfsGateway[2]}/${hash}`),
          ])

          allNftInfo.push({
            id: ele.id.toNumber(),
            value: ele.value.toString(),
            addr: ele.addr.toString(),
            info: info.data,
          })
        } catch {
          continue
        }
      }
      return allNftInfo
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

export { request }
