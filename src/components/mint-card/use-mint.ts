import { ERC20, useEthers } from 'vue-dapp'
import i18n from '@/i18n'
import { BigNumber, ethers } from 'ethers'
import Constants from '@/common/data/constants'
import { Ref } from 'vue'

/**
 * 铸造单个 NFT
 *
 * @param jsonUrl 上传 JSON 返回的链接
 * @param price 单个 NFT 的价格
 * @returns NFT 的 ID
 */
export function useMintSingle(jsonUrl: Ref<string>, price: Ref<string>) {
  return new Promise<number>(async (resolve, rejects) => {
    const { signer } = useEthers()
    if (signer.value === null) {
      rejects(i18n.global.t('error.please_connect_web3'))
    }
    let mySigner = signer.value!
    let contract = new ethers.Contract(
      Constants.CONTRACT_ADDRESS,
      Constants.CONTRACT_ABI,
      mySigner
    )

    try {
      let gas = await contract.estimateGas.mint(jsonUrl.value, 0, {
        value: ethers.utils.parseEther(price.value),
      })

      let tx = await contract.connect(mySigner).mint(jsonUrl.value, 0, {
        gasLimit: gas.add(BigNumber.from(10000)),
        value: ethers.utils.parseEther(price.value),
      })

      let result = await tx.wait()

      let tokenId = parseInt((result.events[0].args[2] as BigNumber).toString())

      resolve(tokenId)
    } catch (e) {
      rejects(e)
    }
  })
}

/**
 * 铸造多个 NFT
 *
 * @param jsonUrl 上传 JSON 返回的链接
 * @param price 单个 NFT 的价格
 * @param amount NFT 的数量
 * @returns
 */
export function useMintMultiple(
  jsonUrl: Ref<string>,
  price: Ref<string>,
  amount: Ref<number>
) {
  return new Promise<any>(async (resolve, rejects) => {
    const { signer } = useEthers()
    if (signer.value === null) {
      rejects(i18n.global.t('error.please_connect_web3'))
    }
    let mySigner = signer.value!
    let contract = new ethers.Contract(
      Constants.CONTRACT_ADDRESS,
      Constants.CONTRACT_ABI,
      mySigner
    )

    try {
      let gas = await contract.estimateGas.mintAvg(
        jsonUrl.value,
        amount.value,
        0,
        {
          value: ethers.utils.parseEther(
            (parseFloat(price.value) * amount.value).toString()
          ),
        }
      )

      let tx = await contract
        .connect(mySigner)
        .mintAvg(jsonUrl.value, amount.value, 0, {
          gasLimit: gas.add(BigNumber.from(10000)),
          value: ethers.utils.parseEther(
            (parseFloat(price.value) * amount.value).toString()
          ),
        })

      let result = await tx.wait()

      resolve(result)
    } catch (e) {
      rejects(e)
    }
  })
}

/**
 * 使用 ERC20 代币铸造单个 NFT
 *
 * @param address ERC20 合约地址
 * @param decimals 该 ERC20 合约的精度
 * @param jsonUrl 上传 JSON 返回的链接
 * @param price 单个 NFT 的价格
 * @returns NFT 的 ID
 */
export function useMintSingleERC20(
  address: Ref<string>,
  decimals: Ref<number>,
  jsonUrl: Ref<string>,
  price: Ref<string>
) {
  return new Promise<number>(async (resolve, rejects) => {
    const { signer } = useEthers()
    if (signer.value === null) {
      rejects(i18n.global.t('error.please_connect_web3'))
    }
    let mySigner = signer.value!
    let erc20Contract = new ethers.Contract(address.value, ERC20.abi, mySigner)
    let mintContract = new ethers.Contract(
      Constants.CONTRACT_ADDRESS,
      Constants.CONTRACT_ABI,
      mySigner
    )
    try {
      // 允许调用资产
      let approveGas = await erc20Contract.estimateGas.approve(
        Constants.CONTRACT_ADDRESS,
        BigNumber.from(parseFloat(price.value) * 10 ** decimals.value)
      )
      await erc20Contract.approve(
        Constants.CONTRACT_ADDRESS,
        BigNumber.from(parseFloat(price.value) * 10 ** decimals.value),
        {
          gasLimit: approveGas.add(BigNumber.from(10000)),
        }
      )

      let mintGas = await mintContract.estimateGas.mintByERC20(
        address.value,
        BigNumber.from(parseFloat(price.value) * 10 ** decimals.value),
        jsonUrl.value,
        0
      )

      let tx = await mintContract
        .connect(mySigner)
        .mintByERC20(
          address.value,
          BigNumber.from(parseFloat(price.value) * 10 ** decimals.value),
          jsonUrl.value,
          0,
          {
            gasLimit: mintGas.add(BigNumber.from(10000)),
          }
        )

      let result = await tx.wait()
      let tokenId = parseInt((result.events[2].args[2] as BigNumber).toString())

      resolve(tokenId)
    } catch (e) {
      rejects(e)
    }
  })
}

/**
 * 使用 ERC20 代币铸造多个 NFT
 * 
 * @param address ERC20 合约地址
 * @param decimals 该 ERC20 合约的精度
 * @param jsonUrl 上传 JSON 返回的链接
 * @param price 单个 NFT 的价格
 * @param amount NFT 的数量
 * @returns 
 */
export function useMintMultipleERC20(
  address: Ref<string>,
  decimals: Ref<number>,
  jsonUrl: Ref<string>,
  price: Ref<string>,
  amount: Ref<number>
) {
  return new Promise<number>(async (resolve, rejects) => {
    const { signer } = useEthers()
    if (signer.value === null) {
      rejects(i18n.global.t('error.please_connect_web3'))
    }
    let mySigner = signer.value!
    let erc20Contract = new ethers.Contract(address.value, ERC20.abi, mySigner)
    let mintContract = new ethers.Contract(
      Constants.CONTRACT_ADDRESS,
      Constants.CONTRACT_ABI,
      mySigner
    )
    try {
      // 允许调用资产
      let approveGas = await erc20Contract.estimateGas.approve(
        Constants.CONTRACT_ADDRESS,
        BigNumber.from(parseFloat(price.value) * 10 ** decimals.value).mul(
          amount.value
        )
      )
      await erc20Contract.approve(
        Constants.CONTRACT_ADDRESS,
        BigNumber.from(parseFloat(price.value) * 10 ** decimals.value).mul(
          amount.value
        ),
        {
          gasLimit: approveGas.add(BigNumber.from(10000)),
        }
      )

      let mintGas = await mintContract.estimateGas.mintByERC20Avg(
        address.value,
        jsonUrl.value,
        BigNumber.from(parseFloat(price.value) * 10 ** decimals.value).mul(
          amount.value
        ),
        amount.value,
        0
      )

      let tx = await mintContract
        .connect(mySigner)
        .mintByERC20Avg(
          address.value,
          jsonUrl.value,
          BigNumber.from(parseFloat(price.value) * 10 ** decimals.value).mul(
            amount.value
          ),
          amount.value,
          0,
          {
            gasLimit: mintGas.add(BigNumber.from(10000)),
          }
        )

      let result = await tx.wait()
      let tokenId = parseInt((result.events[0].args[2] as BigNumber).toString())

      resolve(tokenId)
    } catch (e) {
      rejects(e)
    }
  })
}
