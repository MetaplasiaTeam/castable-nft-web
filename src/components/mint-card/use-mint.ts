import { ERC20, useEthers } from 'vue-dapp'
import i18n from '@/i18n'
import { BigNumber, ethers } from 'ethers'
import Constants from '@/common/data/constants'

/**
 * 铸造单个 NFT
 *
 * @param jsonUrl 上传 JSON 返回的链接
 * @param price 单个 NFT 的价格
 * @returns NFT 的 ID
 */
export async function useMintSingle(
  jsonUrl: string,
  price: string
): Promise<number> {
  const { signer } = useEthers()
  if (signer.value === null) {
    throw new Error(i18n.global.t('error.please_connect_web3'))
  }
  try {
    const _singer = signer.value
    const contract = new ethers.Contract(
      Constants.CONTRACT_ADDRESS,
      Constants.CONTRACT_ABI,
      _singer
    )

    const gas = await contract.estimateGas.mint(jsonUrl, 0, {
      value: ethers.utils.parseEther(price),
    })
    const tx = await contract.connect(_singer).mint(jsonUrl, 0, {
      gasLimit: gas.add(BigNumber.from(10000)),
      value: ethers.utils.parseEther(price),
    })
    const result = await tx.wait()

    return result
  } catch (e) {
    console.error(e)
    throw e
  }
}

/**
 * 铸造多个 NFT
 *
 * @param jsonUrl 上传 JSON 返回的链接
 * @param price 单个 NFT 的价格
 * @param amount NFT 的数量
 * @returns
 */
export async function useMintMultiple(
  jsonUrl: string,
  price: string,
  amount: number
) {
  const { signer } = useEthers()
  if (signer.value === null) {
    throw new Error(i18n.global.t('error.please_connect_web3'))
  }
  try {
    const _signer = signer.value
    const contract = new ethers.Contract(
      Constants.CONTRACT_ADDRESS,
      Constants.CONTRACT_ABI,
      _signer
    )

    const gas = await contract.estimateGas.mintAvg(jsonUrl, amount, 0, {
      value: ethers.utils.parseEther((parseFloat(price) * amount).toString()),
    })

    const tx = await contract.connect(_signer).mintAvg(jsonUrl, amount, 0, {
      gasLimit: gas.add(BigNumber.from(10000)),
      value: ethers.utils.parseEther((parseFloat(price) * amount).toString()),
    })

    const result = await tx.wait()

    return result
  } catch (e) {
    console.error(e)
    throw e
  }
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
export async function useMintSingleERC20(
  address: string,
  decimals: number,
  jsonUrl: string,
  price: string
) {
  const { signer } = useEthers()
  if (signer.value === null) {
    throw new Error(i18n.global.t('error.please_connect_web3'))
  }
  try {
    const _signer = signer.value
    const erc20Contract = new ethers.Contract(address, ERC20.abi, _signer)
    const mintContract = new ethers.Contract(
      Constants.CONTRACT_ADDRESS,
      Constants.CONTRACT_ABI,
      _signer
    )

    // 允许调用资产
    const approveGas = await erc20Contract.estimateGas.approve(
      Constants.CONTRACT_ADDRESS,
      BigNumber.from(parseFloat(price) * 10 ** decimals)
    )
    await erc20Contract.approve(
      Constants.CONTRACT_ADDRESS,
      BigNumber.from(parseFloat(price) * 10 ** decimals),
      {
        gasLimit: approveGas.add(BigNumber.from(10000)),
      }
    )

    const mintGas = await mintContract.estimateGas.mintByERC20(
      address,
      BigNumber.from(parseFloat(price) * 10 ** decimals),
      jsonUrl,
      0
    )

    const tx = await mintContract
      .connect(_signer)
      .mintByERC20(
        address,
        BigNumber.from(parseFloat(price) * 10 ** decimals),
        jsonUrl,
        0,
        {
          gasLimit: mintGas.add(BigNumber.from(10000)),
        }
      )

    const result = await tx.wait()
    const tokenId = parseInt((result.events[2].args[2] as BigNumber).toString())

    return tokenId
  } catch (e) {
    console.error(e)
    throw e
  }
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
export async function useMintMultipleERC20(
  address: string,
  decimals: number,
  jsonUrl: string,
  price: string,
  amount: number
) {
  const { signer } = useEthers()
  if (signer.value === null) {
    return new Error(i18n.global.t('error.please_connect_web3'))
  }

  try {
    const mySigner = signer.value
    const erc20Contract = new ethers.Contract(address, ERC20.abi, mySigner)
    const mintContract = new ethers.Contract(
      Constants.CONTRACT_ADDRESS,
      Constants.CONTRACT_ABI,
      mySigner
    )
    // 允许调用资产
    const approveGas = await erc20Contract.estimateGas.approve(
      Constants.CONTRACT_ADDRESS,
      BigNumber.from(parseFloat(price) * 10 ** decimals).mul(amount)
    )
    await erc20Contract.approve(
      Constants.CONTRACT_ADDRESS,
      BigNumber.from(parseFloat(price) * 10 ** decimals).mul(amount),
      {
        gasLimit: approveGas.add(BigNumber.from(10000)),
      }
    )

    const mintGas = await mintContract.estimateGas.mintByERC20Avg(
      address,
      jsonUrl,
      BigNumber.from(parseFloat(price) * 10 ** decimals).mul(amount),
      amount,
      0
    )

    const tx = await mintContract
      .connect(mySigner)
      .mintByERC20Avg(
        address,
        jsonUrl,
        BigNumber.from(parseFloat(price) * 10 ** decimals).mul(amount),
        amount,
        0,
        {
          gasLimit: mintGas.add(BigNumber.from(10000)),
        }
      )

    const result = await tx.wait()
    const tokenId = parseInt((result.events[0].args[2] as BigNumber).toString())

    return tokenId
  } catch (e) {
    console.error(e)
    throw e
  }
}
