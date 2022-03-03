import { PinIPFS } from '@/types/pin-ipfs'
import { useMessage } from 'naive-ui'
import { BigNumber, ethers } from 'ethers'
import Request from './request'
import { store, useStore } from '@/store'
import axios from 'axios'
import { NFTInfo } from '@/types/nft-info'

const request = new Request({
  timeout: 30000,
  baseURL: 'https://api.pinata.cloud/',
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlNmIyYzVkZS1kMDdmLTQ4YzMtOTQzNS1iMmE1MDgyNGU0MzYiLCJlbWFpbCI6Im5paGFvY3VuMjAwMDEyMjVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZX0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijc2NDlkNDJjNTczNzM2M2Y4Yjc3Iiwic2NvcGVkS2V5U2VjcmV0IjoiNTFlMDI4OTliMjMwNWExNTc2MzdlYjc0M2E5OGNjZjBlMjc3NjQ0M2FiMDQzM2ExZjJhN2U4YWFmNjA1YTJkMCIsImlhdCI6MTY0NjEzMjQ2OX0.Wu2YDpjhMdab1FbeWFG_JqR1OpK6kCFHNmycd2MLXYU',
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
        pinata_api_key: '7649d42c5737363f8b77',
        pinata_secret_api_key:
          '51e02899b2305a157637eb743a98ccf0e2776443ab0433a1f2a7e8aaf605a2d0',
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
        pinata_api_key: '7649d42c5737363f8b77',
        pinata_secret_api_key:
          '51e02899b2305a157637eb743a98ccf0e2776443ab0433a1f2a7e8aaf605a2d0',
      },
    })
  }

  static uploadJson(pinIPFS: PinIPFS) {
    return request.post({
      url: 'pinning/pinJSONToIPFS',
      data: pinIPFS,
      headers: {
        pinata_api_key: '7649d42c5737363f8b77',
        pinata_secret_api_key:
          '51e02899b2305a157637eb743a98ccf0e2776443ab0433a1f2a7e8aaf605a2d0',
      },
    })
  }

  static getAllNFTId(contract: ethers.Contract | undefined): Promise<number[]> {
    return new Promise((resolve, reject) => {
      if (contract === undefined) {
        reject('contract is undefined')
        return
      }
      const message = useMessage()
      const store = useStore()
      contract
        .tokenCounter()
        .then(async (count: BigNumber) => {
          let trueCount = count.toNumber()
          console.log(trueCount)
          let allNFTId: Array<number> = []
          let currCount: number
          for (currCount = 0; currCount < trueCount; currCount++) {
            await contract
              .ownerOf(currCount)
              .then((address: string) => {
                if (address === store.state.web3address) {
                  allNFTId.push(currCount)
                }
              })
              .catch((err: Error) => {
                // message.error(err.message)
                // reject(err.message)
              })
          }
          resolve(allNFTId)
        })
        .catch((err: Error) => {
          message.error(err.message)
          reject(err.message)
        })
    })
  }

  static getAllNftInfo(
    contract: ethers.Contract | undefined
  ): Promise<{ id: number; value: number; info: PinIPFS }[]> {
    return new Promise((resolve, reject) => {
      if (contract === undefined) {
        reject('contract is undefined')
        return
      }
      contract
        .getCollectiblesByOwner(store.state.web3address)
        .then(async (res: NFTInfo[]) => {
          let allNFTInfo: Array<{ id: number; value: number; info: PinIPFS }> =
            []
          for (let ele of res) {
            let link = `https://gateway.pinata.cloud/ipfs${ele.uri.substring(
              ele.uri.lastIndexOf('/'),
              ele.uri.length
            )}`
            let info = await this.getNftInfo(link)
            allNFTInfo.push({
              id: ele.id.toNumber(),
              value: parseFloat(
                (
                  parseFloat(ele.value.toString()) /
                  parseFloat('1000000000000000000')
                ).toString()
              ),
              info: await info.data,
            })
          }
          resolve(allNFTInfo)
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  private static getNftInfo(link: string) {
    return axios.get(link)
  }
}

export { request }
