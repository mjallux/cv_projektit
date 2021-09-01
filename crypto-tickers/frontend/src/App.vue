<template>
  <div>
    <ticker token="polkadot" height="175" />
    <ticker token="cardano" height="175" />
    <ticker token="darwinia-network-native-token" height="175" />
    <ticker token="near" height="175" />
    <ticker token="ocean-protocol" height="175" />
    <ticker token="ankr" height="175" />
    <ticker token="chainx" height="175"/>
    <ticker token="bifrost" height="175"/>
    <ticker token="reef-finance" height="175"/>
    <ticker token="pha" height="175"/>
    <ticker token="iris-network" height="175"/>
    <portfolio :apiKeys="apiKeys" height="175"/>
  </div>
  

</template>

<script>
import ticker from "@/components/ticker.vue";
import portfolio from "@/components/portfolio.vue";
import dotenv from "dotenv";
dotenv.config({
  path: "@/../.env",
});
export default {
  name: "App",
  components: {
    ticker,
    portfolio,
  },
  setup() {
    return {
      apiKeys: {
        binance: {
          key: process.env.VUE_APP_BINANCE_API_KEY,
          secret: process.env.VUE_APP_BINANCE_API_SECRET,
        },
        gate: {
          key: process.env.VUE_APP_GATEIO_API_KEY,
          secret: process.env.VUE_APP_GATEIO_API_SECRET,
        },
      },
    };
  },
};
</script>

<style>
body
{
  margin: 0;
  padding: 0;
  background-color: #1a151e;

}
div {
  display: grid;
  grid-template-columns: auto auto auto;
}
</style>
