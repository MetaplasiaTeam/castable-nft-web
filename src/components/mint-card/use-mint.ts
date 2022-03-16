import { ERC20, useEthers } from 'vue-dapp'
import i18n from '@/i18n'
import { BigNumber, ethers } from 'ethers'
import Constants from '@/common/data/constants'
import { Ref } from 'vue'

export function useMintSingle(
  { jsonUrl }: { jsonUrl: Ref<string> },
  { price }: { price: Ref<string> }
) {
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

export function useMintMultiple(
  { jsonUrl }: { jsonUrl: Ref<string> },
  { price }: { price: Ref<string> },
  { amount }: { amount: Ref<number> }
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

export function useMintSingleERC20(
  { address }: { address: Ref<string> },
  { decimals }: { decimals: Ref<number> },
  { jsonUrl }: { jsonUrl: Ref<string> },
  { price }: { price: Ref<string> }
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
      console.log(result)
      let tokenId = parseInt((result.events[2].args[2] as BigNumber).toString())

      resolve(tokenId)
    } catch (e) {
      rejects(e)
    }
  })
}

export function useMintMultipleERC20(
  { address }: { address: Ref<string> },
  { decimals }: { decimals: Ref<number> },
  { jsonUrl }: { jsonUrl: Ref<string> },
  { price }: { price: Ref<string> },
  { amount }: { amount: Ref<number> }
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
      console.log(result)
      let tokenId = parseInt((result.events[0].args[2] as BigNumber).toString())

      resolve(tokenId)
    } catch (e) {
      rejects(e)
    }
  })
}
