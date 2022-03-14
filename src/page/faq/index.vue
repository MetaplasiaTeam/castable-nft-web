<template>
  <div id="faq">
    <router-link to="/">
      <img id="title_img" :src="commonUtil.getSrc('logo.svg')"
    /></router-link>
    <div class="item">
      <a class="title">Introduction:</a>
      <a
        >CastableNFT is a platform for everyone to mint and sell valuable NFT.
        Minted NFT can be traded directly on OpenSea. CastableNFT is a open
        marketplace that everyone can join freely.</a
      >
    </div>
    <a class="title">CastableNFT Advantage:</a>
    <div class="item">
      <ul>
        <li>
          Solve the useless NFT problem, make NFT with basic value. Collateral
          is required for minting NFT, and can be redeemed via burning NFT.
        </li>
        <li>
          Code is open sourced and verifiable. Everyone can mint NFT and manage
          NFT marketplace freely.
        </li>
        <li>Supports trading on OpenSea and setting for Twitter icon</li>
        <li>
          NFT marketplace is a social experiment, more application scenarios can
          be extended by community based on the basic rules
        </li>
      </ul>
    </div>
    <div class="item">
      <a class="title">Safety Verification:</a>
      <a>Verified Contract ERC-721:</a>
      <a
        href="https://etherscan.io/address/0x842864f1cd1491b77a404b0e30aac2b67b2c647b"
        target="_blank"
        >0x842864f1Cd1491B77a404b0E30aAc2B67b2c647B</a
      >
      <a><br />Open source contract code:</a>
      <a
        href="https://github.com/MetaplasiaTeam/castable-nft-demo"
        target="_blank"
        >https://github.com/MetaplasiaTeam/castable-nft-demo</a
      >
    </div>
    <div class="item">
      <a class="title">How to use</a>
      <ol>
        <li>
          <div>
            <a
              >English/Chinese/numbers are supported for setting NFT series
              name</a
            >
            <img :src="commonUtil.getSrc('faq/faq1.jpg')" />
          </div>
        </li>
        <li>
          <div>
            <a
              >Upload NFT image, the image will be saved in IPFS network and no
              worry about losing image</a
            >
            <img :src="commonUtil.getSrc('faq/faq2.jpg')" />
          </div>
        </li>
        <li>
          To prevent bulk useless image minting, 0.002ETH as collateral is
          needed for each NFT minting.
        </li>
        <li>
          <div>
            <a>Enter NFT quantity and click “Mint Now” to process minting</a>
            <img :src="commonUtil.getSrc('faq/faq3.jpg')" />
          </div>
        </li>
        <li>
          <div>
            <a
              >NFT can be checked in wallet after minted, or checked and traded
              on OpenSwap (<a
                href="https://opensea.io/collection/castable-nft"
                target="_blank"
                >https://opensea.io/collection/castable-nft</a
              >)
            </a>
            <img :src="commonUtil.getSrc('faq/faq4.jpg')" />
            <a>NFT can be set as Twitter icon</a>
            <img :src="commonUtil.getSrc('faq/faq5.jpg')" />
          </div>
        </li>
        <li>
          <div>
            <a
              >User can stake ETH to mint a series of NFT, staked assets can be
              redeemed via burning at anytime. Click “Profile” to burn all NFT
              in series, click “Burn” to burn NFT and redeem staked assets, the
              staked ETH in smart contract will be transferred back to
              wallet.</a
            >
            <img :src="commonUtil.getSrc('faq/faq6.png')" />
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import commonUtil from '@/common/utils/common-util'
</script>

<style scoped>
#faq {
  padding-left: 20vw;
  padding-right: 20vw;
  display: flex;
  background: var(--color-background);
  flex-direction: column;
  align-items: flex-start;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

#title_img {
  width: 400px;
  margin-top: 40px;
  align-self: center;
}

.title {
  color: #ed7d31;
  font-size: 2rem;
  margin-top: 10vh;
}

a,
li {
  color: #fff;
  font-size: 1rem;
  text-align: start;
}

li {
  margin-left: 60px;
}

img {
  width: 100%;
  margin-top: 16px;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  #faq {
    padding-left: 5vw;
    padding-right: 5vw;
  }

  #title_img {
    width: 200px;
  }

  .title {
    margin-top: 5vh;
  }
}
</style>
